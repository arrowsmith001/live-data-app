// implement custom websocket hook which takes an address (for the backend) and filters messages based on the endpoint at the other end

import { useEffect, useRef, useState } from "react";
import { WebSocketConfig } from "./WebSocketListener";
import { DataReader, DataSchema, DataType } from "../data/DataReader";

const WS_URL = 'ws://localhost:5000';

export function useWebSocketHook(wsConfig: WebSocketConfig | null, onMessage?: (message: string) => void) {


    const [messages, setMessages] = useState<any[][]>([]);
    const [readyState, setReadyState] = useState<number>(0);
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [error, setError] = useState<Event | null>(null);

    const dr = new DataReader(new DataSchema(
        [
            'time', 'x', 'y'
        ],
        [
            DataType.TIMESTAMP, DataType.NUMBER, DataType.NUMBER
        ],
        ' '
    ));

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
            const line = dr.readLine(data);
            if (typeof line === 'object' && 'error' in line) {
                console.log("Validation error: " + line.error);
                return;
            }

            setMessages((prev) => {

                if (prev.length === 0) {
                    return [line as any[]];
                }


                // remove messages from front of list that are older than X seconds
                const x = 2;
                let i = 0;

                console.log('earliest time: ' + (prev[0][0] as Date).getTime());

                const cutoffTime = (line[0] as Date).getTime() - x * 1000;
                console.log("cutoffTime: " + cutoffTime);
                while (i < prev.length) {
                    const diff = cutoffTime - ((prev[i][0] as Date).getTime());
                    console.log("diff: " + diff);
                    if (diff > 0) {
                        i++;
                    } else {
                        break;
                    }
                }

                if (onMessage) onMessage!(data);

                console.log("i: " + i);

                return [...prev.slice(i), line as any];
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

    return { messages, readyState, error };
}