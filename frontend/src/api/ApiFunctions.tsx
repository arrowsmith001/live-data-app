import axios from "axios";
import { socket } from '../network/socket';
import { types } from "util";
import { ConnectionInfo, DashboardInfo, SchemaInfo } from "./model";

export const API_URL = 'http://localhost:5000';



const isPortValid = (port: number) => {
    return port >= 0 && port <= 65535;
}
const isIpValid = (ip: string) => {
    const ipRegex = new RegExp('^([0-9]{1,3}\.){3}[0-9]{1,3}$');
    return ipRegex.test(ip);
}

const isEndpointValid = (endpoint: string) => {
    const illegalChars = /[^a-zA-Z0-9_]/;
    return !illegalChars.test(endpoint);
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

    if(!isIpValid(connectionInfo.ip)) {
        throw new Error('Invalid IP address');
    }
    
    if(!isPortValid(connectionInfo.port)) {
        throw new Error('Invalid port number');
    }

    if(!isEndpointValid(connectionInfo.endpoint)) {
        throw new Error('Invalid endpoint');
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
        schema.name = schema.format === 'delimited' ? 'Delimited ' : 'JSON ';
        schema.name += schema.format === 'delimited' ? schema.types.join(schema.delimiter) : schema.types.join(', ');
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

export async function connect(id? : number): Promise<void> {
    if (id === undefined) {
        throw new Error('ID is required');
    }

    try{

    const url = `${API_URL}/connections/connect/` + id;
    const response = await axios.get(url);
    return response.data;
    }
    catch (error: any) {
        console.log('connect error: ' + error.message);
    }
}

export async function disconnect(id? : number): Promise<void> {
    if (id === undefined) {
        throw new Error('ID is required');
    }

    try{

    const url = `${API_URL}/connections/disconnect/` + id;
    const response = await axios.get(url);
    return response.data;
    }
    catch (error: any) {
        console.log('disconnect error: ' + error.message);
    }
}

export async function getDashboards(): Promise<DashboardInfo[]> {
    const url = `${API_URL}/dashboards`;
    const response = await axios.get(url);
    return response.data;
}

export async function getStatuses(): Promise<Map<number, string>> {
    const url = `${API_URL}/connections/statuses`;
    const response = await axios.get(url);
    return new Map(Object.entries(response.data).map(([k, v]) => [parseInt(k), v as string]));
}