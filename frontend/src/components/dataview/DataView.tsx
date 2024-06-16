import { Box, Card, Grid, IconButton, Menu, MenuItem, Paper, Typography, useTheme } from "@mui/material";
import { tokens } from "../../styles/theme";
import { useContext, useEffect, useState } from "react";
import { ResizableGridItem } from "../ResizableGridItem";
import Display from "./Display";
import PoseView from "./PoseView";
import { DataStreamContext } from "../../data/DataStreamContext";
import { SingleStreamContext, SingleStreamContextProvider } from "../../data/SingleStreamContext";
import { DashboardEditContext, DashboardView } from "../../data/DashboardEditContextProvider";
import PositionView from "./PositionView";
import { DragHandle, Pin, PinSharp, PushPin } from "@mui/icons-material";
import { getDataConfigError } from "../../utils/utils";
import LineChart from "./LineChart";
import { DataViewError } from "./DataViewError";
import { Error } from "../../api/model";
import { centeredStyle, columnStyle } from "../../styles/styles";
import { DataViewContext } from "../../data/DataViewContext";


export type DataViewProps = {
    error?: string
}

const borderRadius = 2;

export const DataView = () => {
    
    const colors = tokens(useTheme().palette.mode);

    const { setSelectedView, setViewPinned, getViewPinned, isSelected } = useContext(DashboardEditContext);

    const { view } = useContext(DataViewContext);

    if(!view) return <></>;

    const config = view.config;
    const layout = view.layout;
    
    const id = layout.i;
    const connectionId = config.connectionId;
    const schemaId = config.schemaId;
    const inputMapping = config.inputMapping;
    const type = config.type;

    const onClick = () => {
        setSelectedView((prev) => {
            return {isEditing: true, id: parseInt(id)};
        });
    }

    const error : Error | undefined = getDataConfigError(config);

    const _selected = isSelected(id);

    const DataViewDragHandle = () => {

       return <IconButton className='dragHandle' 
            sx={{position: 'absolute', border: _selected ? 1 : undefined, opacity: 0.5,
            borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius, borderColor: colors.primary[300],
            borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
            top: 0, right: 0, width: '100%', height: '12px', backgroundColor: colors.primary[400], color: colors.primary[200]}}>
            <DragHandle/>
        </IconButton>
    }

    return   <Card 

        elevation={_selected ? 12 : 2} 
        onClick={(e) => onClick()} 
        sx={{ 
            backgroundColor: colors.primary[400], borderRadius: borderRadius, 
            border: _selected ? 1 : undefined, borderColor: colors.primary[300],
        color: colors.grey[100], height: '100%' }}>
      
        <Box sx={centeredStyle}  p={1}>
        <DataViewDragHandle />
        
        {/* "pin" icon */}
        <IconButton onClick={(e) => {
            setViewPinned(id, !getViewPinned(id));
        }} sx={{position: 'absolute', top: '12px', right: 0, color: colors.primary[200]}}>
            <PushPin sx={{color: getViewPinned(id) ? 'white' : 'grey'}} />
        </IconButton>
        {/* <IconButton onClick={(e) => setSelectedView(parseInt(item.i))}>
            <Settings/>
        </IconButton> */}
        {/* <Paper className='dragHandle' sx={{position: 'absolute', top: 0, height: '16px', width: '100%', color: colors.primary[200]}}></Paper> */}
            {error ? 
                <DataViewError type={type} error={error} />
            :
            <Box height={'100%'} sx={centeredStyle}>

            {type === 'line' && <LineChart  />} 
            {type === 'display' && <Display />}
            {type === 'position' && <PositionView />}
            {type === 'pose' && <PoseView />}
            </Box>
            }
        </Box>
    </Card>;
};


// <Menu
// anchorEl={connAnchorEl}
// open={Boolean(connAnchorEl)}
// onClose={() => { setConnAnchorEl(null); }}
// >
// {/* Render the list of connections */}
// {Array.from(connections.values()).map((connection) => (
//     <MenuItem key={connection.id} onClick={() => { assignConnectionId(index, connection.id); setConnAnchorEl(null); }}>
//         {connection.name}
//     </MenuItem>
// ))}
// </Menu>
// <Menu
// anchorEl={schemaAnchorEl}
// open={Boolean(schemaAnchorEl)}
// onClose={() => { setSchemaAnchorEl(null); }}
// >
// {/* Render the list of connections */}
// {Array.from(schemas.values()).map((schema) => (
//     <MenuItem key={schema.id} onClick={() => { assignSchemaId(index, schema.id); setSchemaAnchorEl(null); }}>
//         {schema.name}
//     </MenuItem>
// ))}
// </Menu>

// {settings && 
//     <Box sx={{
//         backgroundColor: rgba(colors.primary[600], 0.8),
//         width: 'inherit',
//         height: 'inherit',
//     }} flexDirection={'row'} display={'flex'} position={'absolute'}>
//         <Box position={'fixed'}>
//             <IconButton onClick={(e) => { setSettings(false); }}>
//                 <Cancel />
//             </IconButton>
//         </Box>
//     <IconButton onClick={(e) => { onConnectionsClick(e); }}>
//         <SettingsInputAntenna />
//     </IconButton>
//     {view.connectionId && <Typography>{connections.get(view.connectionId)?.name}</Typography>}

//     <IconButton onClick={(e) => { onSchemaClick(e); }}>
//         <Schema />
//     </IconButton>
//     {view.schemaId && <Typography>{schemas.get(view.schemaId)?.name}</Typography>}
// </Box>
// }