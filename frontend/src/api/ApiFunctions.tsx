import axios from "axios";
import { WebSocketConfig } from "../backlog/WebSocketListener";
import { DataStreamConfig } from "../backlog/DataStreamMenuItem";

export const API_URL = 'http://localhost:5000';


export type ConnectionInfo = {
    name: string;
    ip: string;
    port: number;
    endpoint: string;
}

export async function addConnection(connectionInfo: ConnectionInfo): Promise<void> {

    if (!connectionInfo.name) {
        throw new Error('Name is required');
    }
    if (!connectionInfo.ip) {
        throw new Error('IP is required');
    }
    if (!connectionInfo.port) {
        throw new Error('Port is required');
    }
    if (!connectionInfo.endpoint) {
        throw new Error('Endpoint is required');
    }

    const url = `${API_URL}/add_connection`;
    await axios.post(url,
        {
            ...connectionInfo,
            isPrivate: false
        }, {
        headers: {
        }
    });
}

export async function getConnections(): Promise<ConnectionInfo[]> {
    const url = `${API_URL}/get_connections`;
    const connections = await axios.get(url);
    console.log('getConnections: ' + JSON.stringify(connections));
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
