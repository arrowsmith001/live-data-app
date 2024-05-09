// implement custom websocket hook which takes an address (for the backend) and filters messages based on the endpoint at the other end

import { useEffect, useRef, useState } from "react";
import { WebSocketConfig } from "./WebSocketListener";

const WS_URL = 'ws://localhost:5000';

export function useWebSocketHook(wsConfig: WebSocketConfig | null, onMessage: (message: string) => void) {


    const [messages, setMessages] = useState<string[]>([]);
    const [readyState, setReadyState] = useState<number>(0);
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!wsConfig) {
            return;
        }

        const url = "ws://" + wsConfig.ip + ":" + wsConfig.port + "/" + wsConfig.endpoint;
        const ws = new WebSocket(url);// + `?ip=${wsConfig.ipAddress}&port=${wsConfig.port}&endpoint=${wsConfig.endpoint}`);
        //setWs(ws);

        ws.onopen = () => {
            setReadyState(ws.readyState);
        };

        ws.onmessage = (event) => {
            // check that string is only space separated numbers
            console.log("EVENT: " + event.data);
            var data = event.data;
            data = data.replace(/^"(.*)"$/, '$1');
            if (!data.split(' ').every((s: string) => !isNaN(Number(s)))) {
                return;
            }
            setMessages((prevMessages) => [...prevMessages, data]);
            onMessage(data);
        };

        ws.onclose = () => {
            setReadyState(ws.readyState);
        };

        ws.onerror = (error) => {
            //setError(error.message);
        };

        return () => {
            ws.close();
        };
    }, []);

    return { messages, readyState, error };
}