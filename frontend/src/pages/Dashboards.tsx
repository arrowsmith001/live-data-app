import { Box, Button, Card, Container, Grid, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../styles/theme";
import { createContext, useContext, useEffect, useState } from "react";
import { addConnection, getDashboards, subscribe } from "../api/ApiFunctions";
import { WebSocketConfig } from "../backlog/WebSocketListener";
import useWebSocket from "react-use-websocket";
import { ServerDataItem, WebSocketContext } from "../backlog/WebSocketContext";
import { useSetSecs } from "../backlog/useServer";
import DashboardGrid from "../app/DashboardGrid";
import { DashboardContext, DashboardContextProvider } from "../data/DashboardContextProvider";
import { socket } from "../network/socket";
import { Add } from "@mui/icons-material";
import AddViewButton from "../components/AddViewButton";
import { DashboardInfo } from "../api/model";
import { Outlet, useNavigate } from "react-router-dom";


export type DashboardParams = {
    timeLower?: number;
    timeUpper?: number;
}

const Dashboards = () => {
    return ( <Outlet />
    )
}


const DashboardsHome = () => {

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
        {/* <DashboardContextProvider dashboard={dashboard} >
                <DashboardGrid />
                <AddViewButton />
        </DashboardContextProvider > */}
            

        </Grid >);
};

export default Dashboards;