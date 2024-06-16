import { Add } from "@mui/icons-material";
import { Box, Card, Grid, IconButton, colors, useTheme } from "@mui/material";
import { useContext, useEffect } from "react";
import { DashboardContext } from "../data/DashboardContextProvider";
import { DashboardInfo, DataViewType } from "../api/model";
import { tokens } from "../styles/theme";
import { DataType } from "../deprecated/DataReader";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { JsxElement } from "typescript";
import LineChart from "./dataview/LineChart";
import LineChartPreview from "./LineChartPreview";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';


const AddDataViewPanel = ({orientation} : {orientation: 'horizontal' | 'vertical'}) => {

    const colors = tokens(useTheme().palette.mode);

    const { dashboard } = useContext(DashboardContext);

    const flexDir = orientation === 'horizontal' ? 'row' : 'column';
    return (
        <Box display={'flex'} flexDirection={flexDir} width={'100%'} alignItems={'center'} justifyContent={'center'} >
        <AddDataViewItem type={'line'} />
        <AddDataViewItem type={'display'} />
        <AddDataViewItem type={'pose'} />
        <AddDataViewItem type={'position'} />
        </Box>
    );
}



const AddDataViewItem = ({type} : {type: DataViewType}) => {

    const colors = tokens(useTheme().palette.mode);

    const componentPreviewMap = {
        'line': <Card sx={{height: '100px', width: '100px', padding: 1, margin: 0, borderRadius: 4, backgroundColor: colors.primary[300]}}>
            {/* <LineChartPreview /> */}Line
        </Card>,
        'display': <Card sx={{height: '100px', width: '100px', padding: 1, margin: 0, borderRadius: 4, backgroundColor: colors.primary[300]}}>Display</Card>,
        'pose': <Card sx={{height: '100px', width: '100px', padding: 1, margin: 0, borderRadius: 4, backgroundColor: colors.primary[300]}}>Pose</Card>,
        'position': <Card sx={{height: '100px', width: '100px', padding: 1, margin: 0, borderRadius: 4, backgroundColor: colors.primary[300]}}>Position</Card>,
      }
    

    const { appendView } = useContext(DashboardContext);

    const [collected, drag, preview] = useDrag(() => ({
        type: 'DATA_VIEW',
        item: { type }
      }));

      useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true })
      }, [])

      return (<Card 
        className="droppable-element"
          draggable={true}
          unselectable="on"
          onDragStart={e => e.dataTransfer.setData("text", type)} 
          sx={{padding: 1, margin: 0, borderRadius: 4, backgroundColor: colors.primary[300]}}>
  {componentPreviewMap[type]}
    </Card>

      );

    return (
        <Card ref={drag} onClick={(e) => {appendView(type)}} sx={{height: '100px', width: '100px', padding: 1, margin: 0, borderRadius: 4, backgroundColor: colors.primary[300]}}>
            {componentPreviewMap[type]}
            </Card>
    );
}

export default AddDataViewPanel;