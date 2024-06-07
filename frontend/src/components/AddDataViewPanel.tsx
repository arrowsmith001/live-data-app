import { Add } from "@mui/icons-material";
import { Box, Card, Grid, IconButton, colors, useTheme } from "@mui/material";
import { useContext } from "react";
import { DashboardContext } from "../data/DashboardContextProvider";
import { DashboardInfo, DataViewType } from "../api/model";
import { tokens } from "../styles/theme";
import { DataType } from "../backlog/DataReader";
import { useDrag } from "react-dnd";



const AddDataViewPanel = ({orientation} : {orientation: 'horizontal' | 'vertical'}) => {

    const colors = tokens(useTheme().palette.mode);

    const { dashboard } = useContext(DashboardContext);

    const flexDir = orientation === 'horizontal' ? 'row' : 'column';
    return (
        <Box display={'flex'} flexDirection={flexDir} width={'100%'} alignItems={'center'} justifyContent={'center'} >
        <AddDataViewItem type={'line'} />
        <AddDataViewItem type={'display'} />
        <AddDataViewItem type={'pose'} />
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