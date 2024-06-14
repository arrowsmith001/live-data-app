import { Box, Grid, IconButton, Menu, MenuItem, Paper, Typography, useTheme } from "@mui/material";
import { tokens } from "../styles/theme";
import { useContext, useState } from "react";
import { ResizableGridItem } from "./ResizableGridItem";
import LineChart from "./LineChart";
import Display from "./Display";
import { DashboardContext } from "../data/DashboardContextProvider";
import { Cancel, Schema, Settings, SettingsInputAntenna } from "@mui/icons-material";
import { DashboardViewInfo } from "../api/model";
import { DataContext } from "../data/DataContextProvider";
import { resetGlobalState } from "react-use-websocket";
import { rgba } from "polished";
import PoseView from "./PoseView";
import { DataStreamContext } from "../data/DataStreamContext";
import { SingleStreamContext, SingleStreamContextProvider } from "../data/SingleStreamContext";
import { DashboardEditContext } from "../data/DashboardEditContextProvider";

export const DataView = ({ index, handleResize }: { index: number; handleResize: (index: number, w?: number, h?: number) => void; }) => {


    const { setSelectedView, workingDashboard } = useContext(DashboardEditContext);

    const config = workingDashboard.views[index].config;
    const l = workingDashboard.views[index].layout;

    const colors = tokens(useTheme().palette.mode);


    return <Grid
        // ref={dragRef} 
        width={'100%'} key={index} item xs={l.w} height={l.h}>
        <ResizableGridItem onResize={(w, h) => handleResize(index, w, h)}>

            <Box  position={'absolute'} right={2}>
                <IconButton onClick={(e) => { setSelectedView({id: index, isEditing: true}); }}>
                    <Settings />
                </IconButton>
            </Box>

            <Paper sx={{ backgroundColor: colors.primary[400], color: colors.grey[100], padding: 2, height: '100%' }}>
                {/* <SingleStreamContextProvider connectionId={config.connectionId} schemaId={config.schemaId} args={[]}>
                    {config.type === 'line' && <LineChart connectionId={config.connectionId} args={[]} />}
                    {config.type === 'display' && <Display />}
                    {config.type === 'pose' && <PoseView connectionId={config.connectionId} schemaId={config.schemaId} args={[]} />}
                </SingleStreamContextProvider> */}
            </Paper>
        </ResizableGridItem>

    </Grid>;
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