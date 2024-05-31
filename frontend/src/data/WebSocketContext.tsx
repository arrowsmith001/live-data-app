import React, { createContext, useState, useEffect, ReactNode } from 'react';
import WebSocketService from './WebSocketService';

const WS_URL = 'ws://localhost:5000/ws/connect';

interface WebSocketProviderProps {
    children: ReactNode;
}

interface WebSocketContextType {
    latestData: ServerDataItem | null;
    dataArray: ServerDataItem[];
    setSecs: (secs: number) => void;
}

export type ServerDataItem = {
    data: string;
    server_timestamp: number;
};

export class ServerData {
    private dataArray: ServerDataItem[] = [];
    private latestTimestamp: number | null = null;

    public addData(data: string, server_timestamp: number): ServerDataItem {
        const newItem = { data, server_timestamp };
        this.dataArray.push(newItem);
        this.latestTimestamp = server_timestamp;
        return newItem;
    }

    public getData(): ServerDataItem[] {
        return this.dataArray;
    }

    public getLatestData(): ServerDataItem | null {
        return this.dataArray.length > 0 ? this.dataArray[this.dataArray.length - 1] : null;
    }

}

export const WebSocketContext: React.Context<WebSocketContextType | null> = createContext<WebSocketContextType | null>(null);
export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {

    const [latestData, setLatestData] = useState<ServerDataItem | null>(null);
    const [dataArray, setDataArray] = useState<ServerDataItem[]>([]);
    const [secs, setSecs] = useState<number>(5); // Add state for secs parameter

    useEffect(() => {
        WebSocketService.connect(WS_URL);

        const callbackID = WebSocketService.addCallback((message) => {


            setLatestData(message);
            setDataArray(prev => {

                // truncate to last X seconds
                const cutoff = (message.server_timestamp - secs);
                var i = 0;
                while (i < prev.length && prev[i].server_timestamp < cutoff) {
                    i++;
                }

                return [...prev.slice(i), message];
            });
        });

        return () => {
            WebSocketService.removeCallback(callbackID);
        };
    }, [secs]); // Add secs as a dependency to the useEffect hook

    return (
        <WebSocketContext.Provider value={{ latestData, dataArray, setSecs }}> {/* Add setSecs to the context value */}
            {children}
        </WebSocketContext.Provider>
    );
};
