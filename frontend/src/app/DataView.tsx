import { Box, Grid, IconButton, Menu, MenuItem, Paper, Typography, useTheme } from "@mui/material";
import { tokens } from "../styles/theme";
import { useContext, useState } from "react";
import { ResizableGridItem } from "../components/ResizableGridItem";
import LineChart from "../components/LineChart";
import Display from "../components/Display";
import { DashboardContext } from "../data/DashboardContextProvider";
import { Cancel, Schema, Settings, SettingsInputAntenna } from "@mui/icons-material";
import { DashboardViewInfo } from "../api/model";
import { DataContext } from "../data/DataContextProvider";
import { resetGlobalState } from "react-use-websocket";
import { rgba } from "polished";
import PoseView from "../components/PoseView";

export const DataView = ({ index, handleResize }: { index: number; handleResize: (index: number, w?: number, h?: number) => void; }) => {

    const [settings, setSettings] = useState(false);

    const { connections, schemas } = useContext(DataContext);

    // const [{ opacity }, dragRef] = useDrag(
    //     () => ({
    //       type: 'card',
    //       collect: (monitor) => ({
    //         opacity: monitor.isDragging() ? 0.5 : 1
    //       })
    //     }),
    //     []
    //   )
    const [connAnchorEl, setConnAnchorEl] = useState<null | HTMLElement>(null); // State for the context menu anchor element
    const [schemaAnchorEl, setSchemaAnchorEl] = useState<null | HTMLElement>(null); // State for the context menu anchor element

    const { setEditingView, dashboard } = useContext(DashboardContext);
    const view = dashboard?.dashboardViews[index];

    const colors = tokens(useTheme().palette.mode);


    const onConnectionsClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setConnAnchorEl(e.currentTarget);
    };
    const onSchemaClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setSchemaAnchorEl(e.currentTarget);
    };

    return view === undefined ? <></> : <Grid
        // ref={dragRef} 
        width={'100%'} key={index} item xs={view.w} height={view.h}>
        <ResizableGridItem onResize={(w, h) => handleResize(index, w, h)}>

            <Box  position={'absolute'} right={2}>
                <IconButton onClick={(e) => { setEditingView({viewIndex: index, isEditing: true}); }}>
                    <Settings />
                </IconButton>
            </Box>

            <Paper sx={{ backgroundColor: colors.primary[400], color: colors.grey[100], padding: 2, height: '100%' }}>
                {view.name}
                {view.type === 'line' && <LineChart connectionId={view.connectionId} schemaId={view.schemaId} args={view.args} />}
                {view.type === 'display' && <Display connectionId={view.connectionId} schemaId={view.schemaId} args={view.args} />}
                {view.type === 'pose' && <PoseView connectionId={view.connectionId} schemaId={view.schemaId} args={view.args} />}
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