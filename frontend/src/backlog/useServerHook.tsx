// implement custom websocket hook which takes an address (for the backend) and filters messages based on the endpoint at the other end

import { useEffect, useRef, useState } from "react";
import { WebSocketConfig } from "./WebSocketListener";
import { DataReader, DataSchema, DataType } from "./DataReader";
import { set } from "date-fns";
import { DataEvent } from "./DataEvent";

const WS_URL = 'ws://localhost:5000';

export function useServerHook(wsConfig: WebSocketConfig | null, onMessage?: (message: string) => void) {

    const [dataEvents, setDataEvents] = useState<DataEvent[]>([]);
    const [readyState, setReadyState] = useState<number>(0);
    const [error, setError] = useState<Event | null>(null);

    const expiryTimeInternalRef = useRef<number>(2);

    const getExpiryTime = () => {
        return expiryTimeInternalRef.current;
    }

    const setExpiryTime = (expiryTime: number) => {
        expiryTimeInternalRef.current = expiryTime;
    }

    useEffect(() => {
        if (!wsConfig) {
            return;
        }

        const url = "ws://" + wsConfig.ip + ":" + wsConfig.port + "/" + wsConfig.endpoint;
        const ws = new WebSocket(url);// + `?ip=${wsConfig.ipAddress}&port=${wsConfig.port}&endpoint=${wsConfig.endpoint}`);

        ws.onopen = () => {
            setReadyState(ws.readyState);
        };

        ws.onmessage = (event) => {

            const dataEvent: DataEvent = { ...JSON.parse(event.data) };
            setDataEvents((prev) => {

                if (prev.length === 0) {
                    return [dataEvent];
                }

                const expiryTimeInternal = expiryTimeInternalRef.current;

                let i = 0;
                const cutoffTime = dataEvent.server_timestamp - expiryTimeInternal;
                while (i < prev.length) {
                    const diff = cutoffTime - prev[i].server_timestamp;
                    if (diff > 0) {
                        i++;
                    } else {
                        break;
                    }
                }

                return [...prev.slice(i), dataEvent];
            });

        };

        ws.onclose = () => {
            setReadyState(ws.readyState);
        };

        ws.onerror = (error) => {
            setError(error);
        };

        return () => {
            ws.close();
        };
    }, []);

    return { messages: dataEvents, readyState, error, setExpiryTime, getExpiryTime };
}