// implement custom websocket hook which takes an address (for the backend) and filters messages based on the endpoint at the other end

import { useEffect, useRef, useState } from "react";
import { WebSocketConfig } from "./WebSocketListener";

export function useWebSocketHook(wsConfig: WebSocketConfig) {
    const [messages, setMessages] = useState<string[]>([]);
    const [readyState, setReadyState] = useState<number>(0);
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const ws = new WebSocket(wsConfig.toFullAddress());
        setWs(ws);

        ws.onopen = () => {
            setReadyState(ws.readyState);
        };

        ws.onmessage = (event) => {
            setMessages((prevMessages) => [...prevMessages, event.data]);
        };

        ws.onclose = () => {
            setReadyState(ws.readyState);
        };

        // ws.onerror = (error) => {
        //     setError(error.message);
        // };

        return () => {
            ws.close();
        };
    }, [wsConfig]);

    return { messages, readyState, error };
}