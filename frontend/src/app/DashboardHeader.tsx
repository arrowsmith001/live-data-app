import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../styles/theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import LineChart from "../components/LineChart";
import Header from "../components/Header";
import { FiberManualRecord } from "@mui/icons-material";
import { useLatestData } from "../data/useServer";


const DashboardHeader = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const latestData = useLatestData();

    const data = !latestData ? '-' : latestData?.data;
    const time = !latestData ? '-' : new Date(latestData?.server_timestamp * 1000).toLocaleTimeString();


    return (
        <Box
            gridRow={1}
            p={1}
            sx={{
                backgroundColor: colors.primary[400],
                width: '100%',
                display: 'flex',
            }}
            borderRadius="3px"
        >

            <Header title={data} subtitle={time} icon={<FiberManualRecord color="error" />} />
        </Box>
    );
}

export default DashboardHeader;