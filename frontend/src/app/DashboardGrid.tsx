import { Button, Card, Grid, IconButton, Paper, Typography, useTheme } from "@mui/material";
import { tokens } from "../styles/theme";
import { useLatestData } from "../backlog/useServer";
import { useRef, useState } from "react";
import { ResizableGridItem } from "../components/ResizableGridItem";
import { DashboardViewInfo } from "../pages/Dashboards";
import LineChart from "../components/LineChart";
import Display from "../components/Display";


const DashboardGrid = ({ views }: { views: DashboardViewInfo[] }) => {




    const gridRef = useRef<HTMLDivElement | null>(null);

    const [xsList, setXsList] = useState([4, 6, 4, 8]);
    const [heightList, setHeightList] = useState([200, 200, 200, 200]);

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const latestData = useLatestData();


    const handleResize = (index: number, w?: number, h?: number) => {
        if (gridRef.current === null) return;

        if (w === undefined && h === undefined) return;
        if (w !== undefined) {

            const percentage = (w / gridRef.current?.clientWidth || 0) * 12;
            const newList = [...xsList];
            newList[index] = Math.ceil(percentage);
            setXsList(newList);
        }

        if (h !== undefined) {

            const newHeightList = [...heightList];
            newHeightList[index] = h;
            setHeightList(newHeightList);
        }


    };

    return (
        <Grid ref={gridRef} container spacing={2}>
            {
                views.map((view, index) => (
                    <Grid width={'100%'} key={index} item xs={xsList[index]} height={heightList[index]}>
                        <ResizableGridItem onResize={(w, h) => handleResize(index, w, h)}>
                            <Paper sx={{ backgroundColor: colors.primary[400], color: colors.grey[100], padding: 2, height: '100%' }}>
                                {view.name}

                                {view.type === 'Line' && <LineChart connectionId={view.connectionId} schemaId={view.schemaId} args={view.args} />}
                                {view.type === 'Display' && <Display schemaId={view.schemaId} connectionId={view.connectionId} args={view.args} />}


                            </Paper>
                        </ResizableGridItem>
                    </Grid>
                ))
            }
            {/* <Grid item xs={xsList[0]} height={heightList[0]}>
                <ResizableGridItem onResize={(w, h) => handleResize(0, w, h)}>
                    <Paper sx={{ backgroundColor: colors.primary[400], color: colors.grey[100], padding: 2, height: '100%' }} />
                </ResizableGridItem>
            </Grid>
            <Grid item xs={xsList[1]} height={heightList[1]}>
                <ResizableGridItem onResize={(w, h) => handleResize(1, w, h)}>
                    <Paper sx={{ backgroundColor: colors.primary[400], color: colors.grey[100], padding: 2, height: '100%' }} />
                </ResizableGridItem>
            </Grid>
            <Grid item xs={xsList[2]} height={heightList[2]}>
                <ResizableGridItem onResize={(w, h) => handleResize(2, w, h)}>
                    <Paper sx={{ backgroundColor: colors.primary[400], color: colors.grey[100], padding: 2, height: '100%' }} />
                </ResizableGridItem>
            </Grid>
            <Grid item xs={xsList[3]} height={heightList[3]}>
                <ResizableGridItem onResize={(w, h) => handleResize(3, w, h)}>
                    <Paper sx={{ backgroundColor: colors.primary[400], color: colors.grey[100], padding: 2, height: '100%' }} />
                </ResizableGridItem>
            </Grid> */}
        </Grid>
    )


    // <Header title={data} subtitle={time} icon={<FiberManualRecord color="error" />} />
}


export default DashboardGrid;