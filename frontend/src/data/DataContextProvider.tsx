import React, { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { socket } from '../network/socket';
import { SchemaParser } from './SchemaParser';
import { getConnections, getDashboards, getSchemas } from '../api/ApiFunctions';
import { ConnectionInfo, DashboardInfo, SchemaInfo } from '../api/model';
import { DashboardParams } from '../pages/Dashboards';
import { set } from 'date-fns';

interface DataContextProviderProps {
    children: ReactNode;
}

interface DataContextType {
    dashboards: Map<number | undefined, DashboardInfo>;
    connections: Map<number | undefined, ConnectionInfo>;
    schemas: Map<number | undefined, SchemaInfo>;
}

export const DataContext: React.Context<DataContextType> = createContext<DataContextType>({
    dashboards: new Map(),
    connections: new Map(),
    schemas: new Map(),
});

export const DataContextProvider: React.FC<DataContextProviderProps> = ({ children }) => {

    const [dashboards, setDashboards] = useState<Map<number | undefined, DashboardInfo>>(new Map());
    const [connections, setConnections] = useState<Map<number | undefined, ConnectionInfo>>(new Map());
    const [schemas, setSchemas] = useState<Map<number | undefined, SchemaInfo>>(new Map());



    useEffect(() => {
        getConnections().then((connections) => {
            setConnections(new Map(connections.map((c) => [c.id, c])));
        });

        getSchemas().then((schemas) => {
            setSchemas(new Map(schemas.map((s) => [s.id, s])));
        });


        getDashboards().then((dashboards) => {
            setDashboards(new Map(dashboards.map((d) => [d.id, d])));
        });


        socket.on('connections_changed', (data) => {
            getConnections().then((items) => {
                setConnections(new Map(items.map((item) => [item.id, item])));
            });
        });

        socket.on('schemas_changed', (data) => {
            getSchemas().then((items) => {
                setSchemas(new Map(items.map((item) => [item.id, item])));
            });
        });


        socket.on('dashboards_changed', (data) => {
            getDashboards().then((items) => {
                setDashboards(new Map(items.map((item) => [item.id, item])));
            });
        });

        // // Clean up the effect
        // return () => {
        //     socket.off('connections_changed');
        // };
    }, []);

    return (
        <DataContext.Provider value={{ connections, dashboards, schemas }}>
            {children}
        </DataContext.Provider>
    );
};

