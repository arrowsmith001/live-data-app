import { useContext } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

export class WebSocketConfig {
    ip!: string;
    port!: number;
    endpoint!: string;

    toDisplayString = () => {
        return `${this.ip}:${this.port}/${this.endpoint}`;
    }

    toFullAddress = () => {
        return `ws://${this.ip}:${this.port}/${this.endpoint}`;
    }

    constructor(init?: Partial<WebSocketConfig> | string) {
        if (typeof init === 'string') {
            if (init.startsWith('ws://')) {
                init = init.substring(5);
            }
            const parts = init.split(':');
            this.ip = parts[0];
            if (parts[1].includes('/')) {
                console.log(parts);
                const parts2 = parts[1].split('/');
                this.port = parseInt(parts2[0]);
                this.endpoint = parts2.slice(1).join('/');
            }
            else {
                this.port = parseInt(parts[1]);
                this.endpoint = '/';
            }
        } else if (init) {
            Object.assign(this, init);
        }
    }

}

class WebSocketListenerProps {
    wsConfig!: WebSocketConfig;
}

function WebSocketListener({ wsConfig }: WebSocketListenerProps) {

    const { sendMessage, sendJsonMessage, lastMessage, lastJsonMessage, readyState, getWebSocket }
        = useWebSocket("ws://" + wsConfig.ip + ":" + wsConfig.port + '/' + wsConfig.endpoint, {}, true);

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