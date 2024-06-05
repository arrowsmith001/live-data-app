import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const Content = () => {



    return (
        <Box sx={{width: 'calc('}}>
            <Outlet />
        </Box>
    );
    };

export default Content;