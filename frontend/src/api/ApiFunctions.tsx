import axios from "axios";
import { socket } from '../network/socket';
import { types } from "util";
import { ConnectionInfo, DashboardInfo, SchemaInfo } from "./model";

export const API_URL = 'http://localhost:5000';



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

    const url = `${API_URL}/connections/add`;
    const response = await axios.post(url, connectionInfo);
    return response.data;
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

    const url = `${API_URL}/schemas/add`;
    const response = await axios.post(url, schema);
    return response.data;
}

export async function getSchema(id: any): Promise<SchemaInfo> {
    const url = `${API_URL}/schemas/${id}`;
    const response = await axios.get(url);
    return response.data;
}

export async function deleteSchema(id: any): Promise<void> {
    const url = `${API_URL}/schemas/delete/${id}`;
    const response = await axios.delete(url);
    return response.data;
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
    const url = `${API_URL}/connections/delete/${id}`;
    const response = await axios.delete(url);
    return response.data;
}

export async function subscribe(): Promise<void> {

    //socket.emit('subscribe', connectionInfo);
}

export async function getDashboards(): Promise<DashboardInfo[]> {
    const url = `${API_URL}/dashboards`;
    const response = await axios.get(url);
    return response.data;
}