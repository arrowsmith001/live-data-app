import axios from "axios";
import { WebSocketConfig } from "../backlog/WebSocketListener";
import { DataStreamConfig } from "../backlog/DataStreamMenuItem";
import { socket } from '../network/socket';

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

    socket.emit('add_connection', connectionInfo);
}

export async function getConnections(): Promise<ConnectionInfo[]> {
    const url = `${API_URL}/connections`;
    const response = await axios.get(url);
    console.log('getConnections: ' + JSON.stringify(response.data));
    return response.data.connections;
}

export async function deleteConnection(url: string): Promise<void> {
    console.log('deleting ' + url);
    socket.emit('delete_connection', url);
}

export async function subscribe(wsConfig: WebSocketConfig): Promise<void> {

    //socket.emit('subscribe', connectionInfo);
}
