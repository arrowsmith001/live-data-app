import { Box, Button, Card, Grid, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../styles/theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import LineChart from "../components/LineChart";
import Header from "../components/Header";
import { useContext, useEffect } from "react";
import { addConnection, subscribe } from "../api/ApiFunctions";
import { WebSocketConfig } from "../backlog/WebSocketListener";
import useWebSocket from "react-use-websocket";
import { ServerDataItem, WebSocketContext } from "../backlog/WebSocketContext";
import { useSetSecs } from "../backlog/useServer";
import DashboardGrid from "../app/DashboardGrid";


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

    useEffect(() => {
    }, []);


    const setSecs = useSetSecs();

    // TODO: Scope data

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
            <DashboardGrid
                views={[
                    // {
                    //     name: 'LineChart',
                    //     type: 'Line',
                    //     schemaId: 1,
                    //     connectionId: 1,
                    //     args: [0, 2],
                    //     w: 4,
                    //     h: 200
                    // },
                    {
                        name: 'x',
                        type: 'Display',
                        schemaId: 1,
                        connectionId: 2,
                        args: [0],
                        w: 4,
                        h: 200
                    },
                    {
                        name: 'x',
                        type: 'Line',
                        schemaId: 1,
                        connectionId: 2,
                        args: [0, 1],
                        w: 4,
                        h: 200
                    },
                    {
                        name: 'x',
                        type: 'Display',
                        schemaId: 1,
                        connectionId: 2,
                        args: [0, 1],
                        w: 4,
                        h: 200
                    },
                    {
                        name: 'x',
                        type: 'Display',
                        schemaId: 1,
                        connectionId: 2,
                        args: [0, 1],
                        w: 4,
                        h: 200
                    },
                ]}
            />
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