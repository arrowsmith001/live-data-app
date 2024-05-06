import { useContext } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

export class WebSocketConfig {
    ipAddress!: string;
    port!: number;
    endpoint!: string;
}

class WebSocketListenerProps {
    wsConfig!: WebSocketConfig;
}

function WebSocketListener({ wsConfig }: WebSocketListenerProps) {

    const { sendMessage, sendJsonMessage, lastMessage, lastJsonMessage, readyState, getWebSocket }
        = useWebSocket("ws://" + wsConfig.ipAddress + ":" + wsConfig.port + '/' + wsConfig.endpoint, {}, true);

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    return <div>
        ${connectionStatus} ${lastMessage ? lastMessage.data : '...'}
        <button onClick={() => sendMessage("")}>OPEN</button>
    </div>;
}

export default WebSocketListener;