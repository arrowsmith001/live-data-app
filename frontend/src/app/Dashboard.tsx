import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../styles/theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import LineChart from "../components/LineChart";
import Header from "../components/Header";
import DashboardHeader from "./DashboardHeader";
import { useEffect } from "react";
import { addConnection, subscribe } from "../api/ApiFunctions";
import { WebSocketConfig } from "../backlog/WebSocketListener";

const Dashboard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        init();
    }, []);

    async function init() {
        try { await addConnection(new WebSocketConfig('ws://192.168.0.89:8080/ws1')); }
        catch (err) { console.log(err); }
        await subscribe(new WebSocketConfig('ws://192.168.0.89:8080/ws1'));
    }

    const EmptyBox = () => {
        return <Box
            sx={{ backgroundColor: colors.primary[400] }}
            gridColumn="span 3"
            display="flex"
            alignItems="center"
            justifyContent="center"
        />;
    };

    return (
        <Box m="20px">

            <DashboardHeader />

            {/* GRID & CHARTS */}
            <Box
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="140px"
                gap="20px"
            >
                {/* ROW 1 */}

                <EmptyBox />
                <EmptyBox />
                <EmptyBox />
                <EmptyBox />

                {/* ROW 2 */}
                <Box
                    gridColumn="span 8"
                    gridRow="span 2"
                    sx={{ backgroundColor: colors.primary[400] }}
                >
                    <Box
                        mt="25px"
                        p="0 30px"
                        display="flex "
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Box>
                            <Typography
                                variant="h5"
                                fontWeight="600"
                                color={colors.grey[100]}
                            >
                                Revenue Generated
                            </Typography>
                            <Typography
                                variant="h3"
                                fontWeight="bold"
                                color={colors.greenAccent[500]}
                            >
                                $59,342.32
                            </Typography>
                        </Box>
                        <Box>
                            <IconButton>
                                <DownloadOutlinedIcon
                                    sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                                />
                            </IconButton>
                        </Box>
                    </Box>
                    <Box height="250px" m="-20px 0 0 0">
                        <LineChart isDashboard={true} />
                    </Box>
                </Box>
                <Box
                    gridColumn="span 4"
                    gridRow="span 2"
                    sx={{ backgroundColor: colors.primary[400] }}
                    overflow="auto"
                >
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        borderBottom={`4px solid ${colors.primary[500]}`}
                        // colors={colors.grey[100]}
                        p="15px"
                    >
                        <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
                            Recent Transactions
                        </Typography>
                    </Box>

                </Box>

            </Box>
        </Box>
    );
};

export default Dashboard;