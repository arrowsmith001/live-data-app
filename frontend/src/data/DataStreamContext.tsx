import React, { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { socket } from '../network/socket';
import { SchemaParser } from './SchemaParser';
import { getSchemas } from '../api/ApiFunctions';
import { DataContext } from './DataContextProvider';
import { Stream } from './model';


interface DataStreamContextProviderProps {
    children: ReactNode;
    streams: Stream[];
}

interface DataStreamContextType {
    getData: (connectionId?: number, schemaId?: number) => any[];
    getLatestData: (connectionId?: number, schemaId?: number) => string | null;
}

export const DataStreamContext: React.Context<DataStreamContextType> = createContext<DataStreamContextType>({
    getData: (connectionId?: number, schemaId?: number) => [],
    getLatestData: (connectionId?: number, schemaId?: number) => null
});

export const DataStreamContextProvider: React.FC<DataStreamContextProviderProps> = ({ children, streams } : DataStreamContextProviderProps) => {

    const { schemas } = useContext(DataContext);

      // Initialize the state with an empty map
    const [streamMap, setStreamMap] = useState(new Map<number, number[]>());
    const [streamData, setStreamData] = useState(new Map<string, any[]>()); 


    useEffect(() => {


        const uniqueCids = Array.from(new Set(streams.map((s) => s.connectionId)));

        const newStreamMap = new Map<number, number[]>();

        for(const cid of uniqueCids) {
            newStreamMap.set(cid, streams
                .filter((s) => s.connectionId === cid && s.connectionId !== -1)
                .map((s) => s.schemaId)
                .filter((s) => schemas.has(s)));
        }


        for(const cid of uniqueCids) {


                socket.on('connection-' + cid, (msg) => {

                    
                for(const sid of newStreamMap.get(cid) || []) {
    
                    const schema = schemas.get(sid); // TODO: Error handling if no schema found
                    if(!schema) {
                        console.error('No schema found for schemaId ' + sid);
                        continue;
                    }
                    
                    const datum = SchemaParser.parseWithSchema(msg, schema);
    
                    const key = cid + '-' + sid;
    
                    setStreamData((prevData) => {
                        // append datum to appropriate map element
                        const newData = new Map(prevData);
                        const prevDataArray = prevData.get(key) || [];
                        newData.set(key, [...prevDataArray, datum].slice(-100));
                        return newData;
                    });
                }
                });
            
        }

        socket.on('connections_changed', (data) => {
            console.log('connections_changed!');
        });

        setStreamMap(newStreamMap);


        return () => {
            for (const cid of uniqueCids) {
                socket.off('connection-' + cid);
            }
        }
    }, [streams, schemas]);




    const getData = (connectionId?: number, schemaId?: number) => {
        if(connectionId === undefined || schemaId === undefined) return [];
        const key = connectionId + '-' + schemaId;
        return streamData.get(key) || [];
    };

    const getLatestData = (connectionId?: number, schemaId?: number) => {
        const data = getData(connectionId, schemaId);
        if(data.length === 0) return null;
        return data[data.length - 1];
    };

    return (
        <DataStreamContext.Provider value={{ 
            getData,
            getLatestData
            }}>
            {children}
        </DataStreamContext.Provider>
    );
};

