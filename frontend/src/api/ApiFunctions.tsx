import axios from "axios";
import { WebSocketConfig } from "../backlog/WebSocketListener";
import { DataStreamConfig } from "../backlog/DataStreamMenuItem";

export const API_URL = 'http://localhost:5000';


export async function addConnection(wsConfig: WebSocketConfig): Promise<void> {
    const url = `${API_URL}/add_connection`;
    await axios.post(url,
        {
            ...wsConfig,
            isPrivate: false
        }, {
        headers: {
        }
    });
}

export async function getConnections(): Promise<DataStreamConfig[]> {
    const url = `${API_URL}/get_connections`;
    const connections = await axios.get(url);
    return connections.data;
}

export async function subscribe(wsConfig: WebSocketConfig): Promise<void> {
    const url = `${API_URL}/subscribe`;
    await axios.post(url,
        {
            ...wsConfig,
        }, {
        headers: {}
    });
}
