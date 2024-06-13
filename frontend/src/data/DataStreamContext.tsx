import React, { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { socket } from '../network/socket';
import { SchemaParser } from './SchemaParser';
import { getSchemas } from '../api/ApiFunctions';


export type Stream = {
    connectionId: number;
    schemaId: number;
    data: any[];
    error?: string;
};

interface DataStreamContextProviderProps {
    children: ReactNode;
    streams: Stream[];
    setStreams: React.Dispatch<React.SetStateAction<Stream[]>>;
}

interface DataStreamContextType {
    getData: (connectionId?: number, schemaId?: number) => any[];
    getLatestData: (connectionId?: number, schemaId?: number) => string | null;
    registerStream: (connectionId: number, schemaId: number) => void;
}

export const DataStreamContext: React.Context<DataStreamContextType> = createContext<DataStreamContextType>({
    getData: (connectionId?: number, schemaId?: number) => [],
    getLatestData: (connectionId?: number, schemaId?: number) => null,
    registerStream: (connectionId: number, schemaId: number) => {}
});

export const DataStreamContextProvider: React.FC<DataStreamContextProviderProps> = ({ children, streams, setStreams: setStreams }) => {


    const getData = (connectionId?: number, schemaId?: number) => {
        if(connectionId === undefined || schemaId === undefined) return [];
        return streams.filter((s) => s.connectionId === connectionId && s.schemaId === schemaId)[0]?.data || [];
    };

    const getLatestData = (connectionId?: number, schemaId?: number) => {
        const data = getData(connectionId, schemaId);
        if(data.length === 0) return null;
        return data[data.length - 1];
    };

    const registerStream = (connectionId: number, schemaId: number) => {
        if(streams.filter((s) => s.connectionId === connectionId && s.schemaId === schemaId).length === 0) {
            setStreams((prevData) => {
                return [...prevData, { connectionId, schemaId, data: []}];
            });
        }
    }


    useEffect(() => {

        getSchemas().then((schemas) => {
            for (const schema of schemas) {
                SchemaParser.addSchema(schema);
            }
        });

        const connectionIds = Array.from(new Set(streams.map((s) => s.connectionId)));

        // iterate through keys and subscribe to connectionIds
        for (const connectionId of connectionIds) {

            const streamIds = Array.from(new Set(streams.filter((s) => s.connectionId === connectionId).map((s) => s.schemaId)));

            for (const schemaId of streamIds) {

                socket.on('connection-' + connectionId, (data) => {

                    try{
                        const decoded = SchemaParser.parse(data, schemaId);

                        setStreams((prevData) => {
                            const stream = streams.filter((s) => s.connectionId === connectionId && s.schemaId === schemaId)[0];
                            const data = stream.data;
                            const newData = [...data, decoded].slice(-100);

                            const newStream = { ...stream, data: newData };
                            //console.log(d);
                            return [...prevData.filter((s) => s.connectionId !== connectionId || s.schemaId !== schemaId), newStream];
                        });
                    }
                    catch(e: any) {
                        setStreams((prevData) => {
                            const stream = streams.filter((s) => s.connectionId === connectionId && s.schemaId === schemaId)[0];
                            const newStream = { ...stream, error: e.message };
                            //console.log(d);
                            return [...prevData.filter((s) => s.connectionId !== connectionId || s.schemaId !== schemaId), newStream];
                        });
                    }



                });
            }
        }

        socket.on('connections_changed', (data) => {
            console.log('connections_changed!');
        });

        // Clean up the effect
        return () => {
            const connectionIds = Array.from(new Set(streams.map((s) => s.connectionId)));
            for (const connectionId of connectionIds) {
                socket.off('connection-' + connectionId);
            }
        };
    }, [setStreams, streams]);

    return (
        <DataStreamContext.Provider value={{ 
            getData,
            getLatestData,
            registerStream
            }}>
            {children}
        </DataStreamContext.Provider>
    );
};

