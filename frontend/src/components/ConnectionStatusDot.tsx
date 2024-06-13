import useWebSocket from "react-use-websocket";
import { WebSocketConfig } from "../deprecated/WebSocketListener";
import { useServerHook } from "../deprecated/useServerHook";
import { useContext, useEffect, useState } from "react";
import { DbContext } from "../data/DbContextProvider";
import { Box, IconButton } from "@mui/material";
import { connect, disconnect } from "../api/ApiFunctions";
import { ConnectionIcon } from "./icons";
import { Power, PowerSettingsNew } from "@mui/icons-material";

// interface ConnectionStatusDotProps {
//     wsConfig: WebSocketConfig;
// }

const iconSize = '50px';

function ConnectionStatusDot({ id } : { id? : number}) {

    const { getStatus } = useContext(DbContext);

    const [ status, setStatus] = useState<string>("unknown");

    useEffect(() => {
        if (id !== undefined)
        setStatus(getStatus(id));
    }
    , [id, getStatus]);

    const color = status === 'connected' ? 'green' : status === 'pending' ? 'amber' : status === 'disconnected' ? 'red' : 'grey';


    // draw small dot which can be grey, amber or green
    return (
        <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%'}}>

{ status === 'connected' &&    <IconButton style={{ width: iconSize, height: iconSize}} disabled={status !== 'connected'} onClick={(e) => disconnect(id)}>
    <PowerSettingsNew sx={{color: 'brown'}}/>
</IconButton>}

{ status !== 'connected' &&   <IconButton style={{ width: iconSize, height: iconSize}} disabled={status === 'connected'} onClick={(e) => connect(id)}>
    <ConnectionIcon />
</IconButton>}
   


<div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color }}></div>
        </Box>

    );
}

export default ConnectionStatusDot;