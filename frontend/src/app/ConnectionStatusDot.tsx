import useWebSocket from "react-use-websocket";
import { WebSocketConfig } from "../network/WebSocketListener";
import { useServerHook } from "../network/useServerHook";

// interface ConnectionStatusDotProps {
//     wsConfig: WebSocketConfig;
// }

function ConnectionStatusDot({ ...props }) {

    //const { readyState } = useWebSocketHook(new WebSocketConfig({ ip: props.wsConfig.ip, port: props.wsConfig.port, endpoint: props.wsConfig.ip }));
    //const { readyState } = useWebSocket(props.wsConfig.toFullAddress(), {}, false);

    const color = 'grey';// readyState === 1 ? 'green' : readyState === 0 ? 'amber' : 'grey';


    // draw small dot which can be grey, amber or green
    return (
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color }}></div>
    );
}

export default ConnectionStatusDot;