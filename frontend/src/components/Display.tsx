import { useContext, useEffect, useState } from "react";
import { socket } from "../network/socket";
import { SchemaParser } from "../data/SchemaParser";
import { Box } from "@mui/material";
import { DashboardContext } from "../data/DashboardContextProvider";
import { SingleStreamContext } from "../data/SingleStreamContext";


const Display = () => {

    const { getLatestData } = useContext(SingleStreamContext);

    return (
        <Box flex='row' width={'100%'}>
            {
               
                        <Box >
                            {JSON.stringify(getLatestData())}
                        </Box>
                    
                
            }
        </Box>
    );
}

export default Display;