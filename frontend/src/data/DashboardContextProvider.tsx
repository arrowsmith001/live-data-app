import React, { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { socket } from '../network/socket';
import { DashboardInfo, DashboardParams } from '../pages/Dashboards';
import { SchemaParser } from './SchemaParser';
import { getSchemas } from '../api/ApiFunctions';

interface DashboardContextProviderProps {
    children: ReactNode;
    dashboard: DashboardInfo;
}

interface DashboardContextType {
    getData: (connectionId: number, schemaId: number) => any[];
    setDashboardParams: React.Dispatch<React.SetStateAction<DashboardParams>>;
    dashboard: DashboardInfo | null;
}

export const DashboardContext: React.Context<DashboardContextType> = createContext<DashboardContextType>({
    getData: (connectionId: number, schemaId: number) => [],
    setDashboardParams: () => {},
    dashboard: null
});

export const DashboardContextProvider: React.FC<DashboardContextProviderProps> = ({ children, dashboard }) => {

    const [dashboardParams, setDashboardParams] = useState<DashboardParams>({});
    const [data, setData] = useState<{ [key: string]: any[] }>({});

    const getData = (connectionId: number, schemaId: number) => {
        return data[connectionId + '-' + schemaId] || [];
    };


    const dataCombos = useMemo(() => {
        if(dashboard === null) return new Map<number, number[]>([]);
        let dataCombos = new Map<number, number[]>();
        for (const view of dashboard.dashboardViews) {
            if (dataCombos.has(view.connectionId)) {
                if (!dataCombos.get(view.connectionId)?.includes(view.schemaId)) {
                    dataCombos.get(view.connectionId)?.push(view.schemaId);
                }
            } else {
                dataCombos.set(view.connectionId, [view.schemaId]);
            }
        }
        return dataCombos;
    }, [dashboard]);

    const sp: SchemaParser = new SchemaParser();

    useEffect(() => {
        console.log('dataCombos: ' + dataCombos.size);

        // fetch schemas
        // for each schema, create a parser
        getSchemas().then((schemas) => {
            for (const schema of schemas) {
                SchemaParser.addSchema(schema);
            }
        });

        // iterate through keys and subscribe to connectionIds
        for (const connectionId of Array.from(dataCombos.keys())) {
            for (const schemaId of dataCombos.get(connectionId)!) {
                console.log('subscribing to connection-' + connectionId + ' schema-' + schemaId);
                socket.on('connection-' + connectionId, (data) => {
                    const decoded = SchemaParser.parse(data, schemaId);

                    console.log(connectionId + ' - ' + schemaId + ' - ' + decoded);

                    setData((prevData) => {
                        // append data at key
                        const key = connectionId + '-' + schemaId;
                        const prevDataArray = prevData[key] || [];
                        const newData = [...prevDataArray, decoded];
                        const d = { ...prevData, [key]: newData };
                        //console.log(d);
                        return d;
                    });
                });
            }
        }

        socket.on('connections_changed', (data) => {
            console.log('connections_changed!');
            // handle connections changed event
        });

        // Clean up the effect
        return () => {
            for (const connectionId of Array.from(dataCombos.keys())) {
                    socket.off('connection-' + connectionId);
                
            }
        };
    }, [dashboard, dashboardParams, dataCombos]);

    return (
        <DashboardContext.Provider value={{ getData, setDashboardParams, dashboard }}>
            {children}
        </DashboardContext.Provider>
    );
};




// Create a hook to access the decoded data
const useDecodedData = () => useContext(DashboardContext);

export { useDecodedData };