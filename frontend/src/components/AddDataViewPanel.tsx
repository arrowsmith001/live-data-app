import { Add } from "@mui/icons-material";
import { Box, Card, Grid, IconButton, colors, useTheme } from "@mui/material";
import { useContext } from "react";
import { DashboardContext } from "../data/DashboardContextProvider";
import { DashboardInfo } from "../api/model";
import { tokens } from "../styles/theme";
import { DataType } from "../backlog/DataReader";
import { useDrag } from "react-dnd";

export enum DataViewType {
    Line = 'line',
    Display = 'display',
    Pose = 'pose'
}

const AddDataViewPanel = () => {

    const colors = tokens(useTheme().palette.mode);

    const { dashboard } = useContext(DashboardContext);

    return (
        <Box >
            <AddDataViewItem type={DataViewType.Line} />
            <AddDataViewItem type={DataViewType.Display} />
            <AddDataViewItem type={DataViewType.Pose} />
        </Box>
    );
}


const AddDataViewItem = ({type} : {type: DataViewType}) => {

    const colors = tokens(useTheme().palette.mode);

    const { appendView } = useContext(DashboardContext);

    const [collected, drag, dragPreview] = useDrag(() => ({
        type: 'ADD_DATA_VIEW',
        item: { type }
      }));
      
    return (
        <Card ref={drag} onClick={(e) => {appendView(type)}} sx={{height: '100px', width: '100px', padding: 1, margin: 0, borderRadius: 4, backgroundColor: colors.primary[300]}}>
            {type}
            </Card>
    );
}

export default AddDataViewPanel;