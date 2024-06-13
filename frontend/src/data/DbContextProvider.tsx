import React, { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { socket } from '../network/socket';
import { SchemaParser } from './SchemaParser';
import { getConnections, getDashboards, getSchemas, getStatuses } from '../api/ApiFunctions';
import { ConnectionInfo, DashboardInfo, SchemaInfo } from '../api/model';
import { DashboardParams } from '../pages/dashboards/Dashboards';
import { set } from 'date-fns';

interface DbContextProviderProps {
    children: ReactNode;
}

interface DbContextType {
    dashboards: Map<number | undefined, DashboardInfo>;
    connections: Map<number | undefined, ConnectionInfo>;
    schemas: Map<number | undefined, SchemaInfo>;
    getStatus: (id: number) => string;
}

export const DbContext: React.Context<DbContextType> = createContext<DbContextType>({
    dashboards: new Map(),
    connections: new Map(),
    schemas: new Map(),
    getStatus: (id: number) => "unknown"
});

export const DbContextProvider: React.FC<DbContextProviderProps> = ({ children }) => {

    const [dashboards, setDashboards] = useState<Map<number | undefined, DashboardInfo>>(new Map());
    const [connections, setConnections] = useState<Map<number | undefined, ConnectionInfo>>(new Map());
    const [schemas, setSchemas] = useState<Map<number | undefined, SchemaInfo>>(new Map());



    const [statuses, setStatuses] = useState<Map<number, string>>(new Map());

    const getStatus = (id: number) => {
        return statuses.get(id) ?? "unknown";
    }

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

        getStatuses().then((statuses) => {
            setStatuses(statuses);
        });

        socket.on('connection_status_changed', (msg) => {
            const id = msg.id;
            const statuses = msg.data;

            // convert object (with number keys) to map
            const statusMap = new Map(Object.entries(statuses).map(([k, v]) => [parseInt(k), v as string]));
            setStatuses(statusMap);

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
        <DbContext.Provider value={{ connections, dashboards, schemas, getStatus }}>
            {children}
        </DbContext.Provider>
    );
};

