import React, { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { socket } from '../network/socket';
import { SchemaParser } from './SchemaParser';
import { getSchemas } from '../api/ApiFunctions';
import { DataContext } from './DataContextProvider';
import { Stream } from './model';



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
}

export const SingleStreamContext: React.Context<SingleStreamContextType> = createContext<SingleStreamContextType>({
    data: [],
    error: null,
    getLatestData: () => [],
    inputMapping: {}
});

export const SingleStreamContextProvider = ({ children, connectionId, schemaId, inputMapping } : SingleStreamContextProviderProps) => {

    const { schemas } = useContext(DataContext);

    const [data, setData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const schema = schemas.get(schemaId);
        if(!schema) return;
        
        socket.on('connection-' + connectionId, (data) => {
            // console.log('Received data: ' + JSON.stringify(data));
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
            getLatestData
            }}>
            {children}
        </SingleStreamContext.Provider>
    );
};

