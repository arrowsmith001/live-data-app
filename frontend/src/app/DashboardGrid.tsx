import { Button, Card, Container, Grid, Typography, useTheme } from "@mui/material";
import { tokens } from "../styles/theme";
import { useContext, useEffect, useRef } from "react";
import { DashboardContext, DashboardContextProvider } from "../data/DashboardContextProvider";
import { ConnectionInfo, SchemaInfo } from "../api/model";
import { getConnections, getSchemas } from "../api/ApiFunctions";
import { DataView } from "./DataView";


// TODO: React DnD

const DashboardGrid = ({setDashboard} : {setDashboard : React.Dispatch<React.SetStateAction<any>> }) => {
    
    const { dashboard } = useContext(DashboardContext);
    const colors = tokens(useTheme().palette.mode);
    const gridRef = useRef<HTMLDivElement | null>(null);


    const normalizeWidth = (width?: number) => {
        if(width === undefined) return gridRef.current?.clientWidth || 0;
        console.log(gridRef.current?.clientWidth);
        const norm = (width / (gridRef.current?.clientWidth || 0)) * 12;
        return Math.max(1, Math.floor(norm + 0.5));
    }


    const handleResize = (index: number, w?: number, h?: number) => {

        if (w === undefined && h === undefined) return;

        const v = {...dashboard!.dashboardViews[index]};
            
        if (w !== undefined) { v.w = normalizeWidth(w); }
        if (h !== undefined) { v.h = h; }

        setDashboard({
            ...dashboard,
            dashboardViews: dashboard!.dashboardViews.map((view, i) => {
                if (i === index) {
                    return v;
                }
                return view;
            })
        });
    };


    return (
        <Container>

            <Grid ref={gridRef} container spacing={2}>
                {dashboard?.dashboardViews.map((v, index) => (
                    <DataView key={index} 
                    index={index}
                    handleResize={handleResize}  />
                ))}
                <Grid item xs={4} height={200}>
                    <Card sx={{ backgroundColor: colors.primary[600], border: 'white', borderWidth: 2, borderRadius: 4, color: colors.grey[100], padding: 2, height: '100%' }}>
                        
                            <Typography>Add View</Typography>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}


export default DashboardGrid;

