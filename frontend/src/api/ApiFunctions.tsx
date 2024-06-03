import axios from "axios";
import { socket } from '../network/socket';
import { types } from "util";

export const API_URL = 'http://localhost:5000';


export type ConnectionInfo = {
    id?: number;
    name: string;
    ip: string;
    port: number;
    endpoint: string;
}

export type SchemaType = 'float' | 'integer' | 'string' | 'boolean' | 'timestamp';
export type SchemaFormat = 'delimited' | 'json';

export type SchemaInfo = {
    id?: number;
    count: number;
    name: string;
    labels: string[];
    types: SchemaType[];
    format: SchemaFormat;
    delimiter?: string;
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

export async function addSchema(schema: SchemaInfo): Promise<void> {
    if (schema.format === 'json') {
        schema.delimiter = undefined;
    }
    if (schema.name === '') {
        schema.name = schema.format === 'delimited' ? 'Delimited (' + schema.delimiter + ')' : 'JSON';
        schema.name += ' - ';
        schema.name += schema.types.join(', ');
    }

    socket.emit('add_schema', schema);
}

export async function getSchema(id: any): Promise<SchemaInfo> {
    const url = `${API_URL}/schemas/${id}`;
    const response = await axios.get(url);
    return response.data;
}

export async function deleteSchema(id: any): Promise<void> {
    socket.emit('delete_schema', id);
}

export async function getSchemas(): Promise<SchemaInfo[]> {
    const url = `${API_URL}/schemas`;
    const response = await axios.get(url);
    console.log('getSchemas: ' + JSON.stringify(response.data));
    return response.data;
}

export async function getConnections(): Promise<ConnectionInfo[]> {
    const url = `${API_URL}/connections`;
    const response = await axios.get(url);
    console.log('getConnections: ' + JSON.stringify(response.data));
    return response.data;
}

export async function deleteConnection(id: any): Promise<void> {
    socket.emit('delete_connection', id);
}

export async function subscribe(): Promise<void> {

    //socket.emit('subscribe', connectionInfo);
}
