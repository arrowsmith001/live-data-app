import { TupleType } from "typescript";
import { DataViewType } from "../components/AddDataViewPanel";


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

export type DashboardInfo = {
    id?: number;
    name: string;
    streams: number[][];
    dashboardViews: DashboardViewInfo[];
}


export type DashboardViewInfo = {
    type?: DataViewType,
    name?: string;
    connectionId?: number,
    schemaId?: number,
    args: any[];
    w: number;
    h: number;
}