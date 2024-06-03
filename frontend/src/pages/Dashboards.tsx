import { Box, Button, Card, Grid, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../styles/theme";
import { createContext, useContext, useEffect } from "react";
import { addConnection, subscribe } from "../api/ApiFunctions";
import { WebSocketConfig } from "../backlog/WebSocketListener";
import useWebSocket from "react-use-websocket";
import { ServerDataItem, WebSocketContext } from "../backlog/WebSocketContext";
import { useSetSecs } from "../backlog/useServer";
import DashboardGrid from "../app/DashboardGrid";
import { DashboardContext, DashboardContextProvider } from "../data/DashboardContextProvider";
import { socket } from "../network/socket";
import { Add } from "@mui/icons-material";
import AddViewButton from "../components/AddViewButton";


export type DashboardParams = {
    timeLower?: number;
    timeUpper?: number;
}

export type DashboardInfo = {
    id?: number;
    name: string;
    dashboardViews: DashboardViewInfo[];
}

export type DashboardViewType = 'Line' | 'Bar' | 'Display' | 'Pose';

export type DashboardViewInfo = {
    type: DashboardViewType,
    name: string;
    schemaId: number;
    connectionId: number;
    args: any[];
    w: number;
    h: number;
}

const Dashboards = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);


    const dashboard : DashboardInfo = {
        name: 'Dashboard',
        dashboardViews: [
            {
                name: 'x',
                type: 'Display',
                schemaId: 1,
                connectionId: 1,
                args: [0],
                w: 4,
                h: 200
            },
            {
                name: 'x',
                type: 'Line',
                schemaId: 1,
                connectionId: 1,
                args: [0, 1],
                w: 4,
                h: 200
            },
            {
                name: 'x',
                type: 'Display',
                schemaId: 1,
                connectionId: 1,
                args: [0, 1],
                w: 4,
                h: 200
            },
            {
                name: 'x',
                type: 'Display',
                schemaId: 1,
                connectionId: 1,
                args: [0, 1],
                w: 4,
                h: 200
            },
        ]
    };

    return (
        <Grid
            width={'100%'}
            padding={6}
            container spacing={2}
            display="grid"
        // gridTemplateColumns="repeat(12, 1fr)"
        // gridAutoRows="140px"
        // gap="20px"
        >
        <DashboardContextProvider dashboard={dashboard} >
                <DashboardGrid />
                <AddViewButton />
        </DashboardContextProvider >
            {/* 
            <Grid height={'200px'} item xs={8}>
                <LineChart
                    xSelect={selectServerT}
                    dataSelect={[
                        selectX, selectY, selectTheta
                    ]} />
                <LineChart
                    xSelect={(sdi: ServerDataItem) => sdi.server_timestamp}
                    dataSelect={[
                        selectX, selectY, selectTheta
                    ]} />
                <LineChart

                    xSelect={(sdi: ServerDataItem) => parseFloat(sdi.data.split(' ')[0])}
                    dataSelect={[
                        selectX
                    ]} />
                <LineChart

                    xSelect={(sdi: ServerDataItem) => sdi.server_timestamp}
                    dataSelect={[
                        selectY
                    ]} />
            </Grid> */}

            {/* <Grid color={colors.primary['400']} item xs={4} >
                <Card sx={{ height: '200px' }}></Card></Grid>
            <Grid color={colors.primary['400']} item xs={6}  >
                <Card sx={{ height: '200px' }}></Card></Grid>
            <Grid color={colors.primary['400']} item xs={4}   >
                <Card sx={{ height: '200px' }}></Card></Grid>
            <Grid color={colors.primary['400']} item xs={6}   >
                <Card sx={{ height: '200px' }}></Card></Grid> */}

        </Grid >
    );
};

export default Dashboards;