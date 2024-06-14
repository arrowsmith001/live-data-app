import React, { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { socket } from '../network/socket';
import { SchemaParser } from './SchemaParser';
import { getSchemas } from '../api/ApiFunctions';
import { DataContext } from './DataContextProvider';
import { Stream } from './model';


interface DataStreamContextProviderProps {
    children: ReactNode;
    streams: Stream[];
    setStreams: React.Dispatch<React.SetStateAction<Stream[]>>;
}

interface DataStreamContextType {
    getData: (connectionId?: number, schemaId?: number) => any[];
    getLatestData: (connectionId?: number, schemaId?: number) => string | null;
}

export const DataStreamContext: React.Context<DataStreamContextType> = createContext<DataStreamContextType>({
    getData: (connectionId?: number, schemaId?: number) => [],
    getLatestData: (connectionId?: number, schemaId?: number) => null
});

export const DataStreamContextProvider: React.FC<DataStreamContextProviderProps> = ({ children, streams, setStreams }) => {

    const { schemas } = useContext(DataContext);


    const dataStreamMap = useMemo(() => {

        const out = new Map<number, Map<number, any[]>>();

        const cids = Array.from(new Set(streams.map((s) => s.connectionId)));
        for(const cid of cids) {
            const sids = Array.from(new Set(streams.filter((s) => s.connectionId === cid).map((s) => s.schemaId)));
            for(const sid of sids) {
                const stream = streams.filter((s) => s.connectionId === cid && s.schemaId === sid)[0];
                if(out.has(cid)) {
                    const data = out.get(cid);
                    data?.set(sid, stream.data);
                }
                else out.set(cid, new Map([[sid, []]]));
            }
        }

        return out;
      }, [streams]);


      useEffect(() => {

        //   if(!dataStreamMap) return;
          
        //     for(const cid of Object.keys(dataStreamMap).map((s) => parseInt(s))) {
        //         const sids = dataStreamMap!.get(cid).map((s) => parseInt(s));   
        //         for(const sid of sids) {
        //             const data = dataStreamMap[cid][sid];
        //             const stream = streams.filter((s) => s.connectionId === cid && s.schemaId === sid)[0];
        //             if(stream) {
        //                 setStreams((prevData) => {
        //                     const newStream = { ...stream, data: data };
        //                     return [...prevData.filter((s) => s.connectionId !== cid || s.schemaId !== sid), newStream];
        //                 });
        //             }
        //         }
        //     }

        // return () => {
        //   // Unsubscribe from each connection ID
        //   for (const ws of webSocketMap.values()) {
        //     ws.close();
        //   }
        // };
      }, [dataStreamMap]); 


    const getData = (connectionId?: number, schemaId?: number) => {
        if(connectionId === undefined || schemaId === undefined) return [];
        return streams.filter((s) => s.connectionId === connectionId && s.schemaId === schemaId)[0]?.data || [];
    };

    const getLatestData = (connectionId?: number, schemaId?: number) => {
        const data = getData(connectionId, schemaId);
        if(data.length === 0) return null;
        return data[data.length - 1];
    };

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
            getLatestData
            }}>
            {children}
        </DataStreamContext.Provider>
    );
};

