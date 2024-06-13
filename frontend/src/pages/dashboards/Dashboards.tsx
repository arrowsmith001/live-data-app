import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";


export type DashboardParams = {
    timeLower?: number;
    timeUpper?: number;
}

const Dashboards = () => {
    return ( 
        <Box sx={{overflowY : 'scroll', overflowX: 'hidden', height: '100%'}}>
            <Outlet />
        </Box>
    )
}

export default Dashboards;