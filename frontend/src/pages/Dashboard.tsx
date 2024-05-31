import { Box, Button, Card, Grid, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../styles/theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import LineChart from "../components/LineChart";
import Header from "../components/Header";
import DashboardHeader from "../app/DashboardHeader";
import { useContext, useEffect } from "react";
import { addConnection, subscribe } from "../api/ApiFunctions";
import { WebSocketConfig } from "../backlog/WebSocketListener";
import useWebSocket from "react-use-websocket";
import { ServerDataItem, WebSocketContext } from "../data/WebSocketContext";
import { useSetSecs } from "../data/useServer";

const Dashboard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        init();
    }, []);

    async function init() {
        await subscribe(new WebSocketConfig('ws://192.168.0.89:8080/ws1'));
    }

    const setSecs = useSetSecs();


    const selectServerT = (sdi: ServerDataItem) => parseFloat(sdi.data.split(' ')[0]);

    const selectT = (sdi: ServerDataItem) => sdi.server_timestamp;
    const selectX = (s: string) => parseFloat(s.split(' ')[1]);
    const selectY = (s: string) => parseFloat(s.split(' ')[2]);
    const selectTheta = (s: string) => parseFloat(s.split(' ')[3]);

    return (
        <Grid
            padding={6}
            container spacing={2}
            display="grid"
        // gridTemplateColumns="repeat(12, 1fr)"
        // gridAutoRows="140px"
        // gap="20px"
        >
            <Grid xs={11} item>
                <DashboardHeader />
            </Grid>

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
            </Grid>

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

export default Dashboard;