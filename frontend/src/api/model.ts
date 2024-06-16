
export type ConnectionInfo = {
    id?: number;
    name: string;
    ip: string;
    port: number;
    endpoint: string;
}

export type DataType = 'float' | 'integer' | 'string' | 'boolean' | 'timestamp' | 'any' | 'number';
export type SchemaFormat = 'delimited' | 'json';

export type SchemaInfo = {
    id?: number;
    count: number;
    name: string;
    labels: string[];
    types: DataType[];
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

export type DataViewType =
    'line'|
     'display'|
     'position'|
    'pose';


export type DataViewInput = {
    label: string,
    type: DataType,
    optional: boolean
}

// associate each type with a list of inputs i.e. x, y for line
export const DataViewTypeInputs = {
    ['line']: [{ label: 'x', type: 'float', optional: false }, { label: 'y', type: 'float', optional: false }],
    ['display']: [{ label: 'value', type: 'any', optional: false }],
    ['position']: [{ label: 'x', type: 'float', optional: false }, { label: 'y', type: 'float', optional: false }],
    ['pose']: [{ label: 'x', type: 'float', optional: false }, { label: 'y', type: 'float', optional: false }, { label: 'theta', type: 'float', optional: false }]
}

export type Error = {
    errorType: string,
    message: string
}