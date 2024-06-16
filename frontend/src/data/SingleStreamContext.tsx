import React, { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { socket } from '../network/socket';
import { SchemaParser } from './SchemaParser';
import { getSchemas } from '../api/ApiFunctions';
import { DataContext } from './DataContextProvider';
import { Stream } from './model';
import { getDataConfigError } from '../utils/utils';



interface SingleStreamContextProviderProps {
    children: ReactNode;
    connectionId?: number;
    schemaId?: number;
    inputMapping?: { [key: number]: number };
}

interface SingleStreamContextType {
    data: any[][],
    error: string | null,
    getLatestData: () => any[];
    inputMapping: { [key: number]: number };
    connectionStatus: string;
    connectionId?: number;
    schemaId?: number;
}

export const SingleStreamContext: React.Context<SingleStreamContextType> = createContext<SingleStreamContextType>({
    data: [],
    error: null,
    getLatestData: () => [],
    inputMapping: {},
    connectionStatus: 'unknown',
    connectionId: undefined,
    schemaId: undefined,
});

export const SingleStreamContextProvider = ({ children, connectionId, schemaId, inputMapping } : SingleStreamContextProviderProps) => {

    const { schemas } = useContext(DataContext);

    const [data, setData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    

    const { getStatus } = useContext(DataContext);
    const connectionStatus = connectionId === undefined ? 'unknown' : getStatus(connectionId);


    useEffect(() => {
        const schema = schemas.get(schemaId);
        if(!schema) return;

        console.log('Connecting to connection-' + connectionId + ' with schema ' + schema.name);

        socket.on('connection-' + connectionId, (data) => {
            console.log('Received data: ' + connectionId + '-' + schemaId 
            + ' ' + JSON.stringify(data));
            try{
                const decoded = SchemaParser.parseWithSchema(data, schema);
                setData((prevData) => [...prevData, decoded].slice(-100));
                setError(null);
            }
            catch(e : any) {
                setError(e.message);
            }

        });
        return () => {
            console.log('Disconnecting from connection-' + connectionId);
            socket.off('connection-' + connectionId);
        };

      }, [connectionId, schemaId]); 


    const getLatestData = () => {
        if(data.length === 0) return null;
        return data[data.length - 1];
    };

    inputMapping = inputMapping || {};

    return (
        <SingleStreamContext.Provider value={{ 
            data,
            error,
            inputMapping,
            getLatestData,
            connectionStatus,
            connectionId,
            schemaId,
            }}>
            {children}
        </SingleStreamContext.Provider>
    );
};

