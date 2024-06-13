import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";



const Schemas = () => {
    return ( 
        <Box sx={{overflowY : 'auto', height: '100%'}}>
            <Outlet />
        </Box>
    )
}

export default Schemas;