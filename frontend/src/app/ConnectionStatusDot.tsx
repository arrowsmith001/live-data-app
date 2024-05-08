import useWebSocket from "react-use-websocket";
import { WebSocketConfig } from "../network/WebSocketListener";

interface ConnectionStatusDotProps {
    wsConfig: WebSocketConfig;
}

function ConnectionStatusDot({ ...props }: ConnectionStatusDotProps) {

    const { readyState } = useWebSocket(props.wsConfig.toFullAddress(), {}, false);

    const color = readyState === 1 ? 'green' : readyState === 0 ? 'amber' : 'grey';


    // draw small dot which can be grey, amber or green
    return (
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color }}></div>
    );
}

export default ConnectionStatusDot;