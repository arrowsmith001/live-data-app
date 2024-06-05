import React, { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { socket } from '../network/socket';
import { SchemaParser } from './SchemaParser';
import { getSchemas } from '../api/ApiFunctions';
import { DashboardInfo } from '../api/model';
import { DashboardParams } from '../pages/Dashboards';
import { DataViewType } from '../components/AddDataViewPanel';
import { set } from 'date-fns';

export type EditingView = {
    viewIndex?: number;
    isEditing: boolean;
}

interface DashboardContextProviderProps {
    children: ReactNode;
    dashboard: DashboardInfo;
    setDashboard: React.Dispatch<React.SetStateAction<DashboardInfo>>;
    isEditable: boolean;
    editingView: EditingView;
    setEditingView: React.Dispatch<React.SetStateAction<EditingView>>;
}

interface DashboardContextType {
    getData: (connectionId?: number, schemaId?: number) => any[];
    dashboard: DashboardInfo | null;
    setDashboardParams: React.Dispatch<React.SetStateAction<DashboardParams>>;
    appendView: (vi: DataViewType) => void,
    assignConnectionId: (index: number, connectionId?: number) => void,
    assignSchemaId: (index: number, schemaId?: number) => void,
    isEditable: boolean;
    selectedConnectionId?: number,
    selectedSchemaId?: number,
    setConnectionId: React.Dispatch<React.SetStateAction<number | undefined>>;
    setSchemaId: React.Dispatch<React.SetStateAction<number | undefined>>;
    setEditingView: React.Dispatch<React.SetStateAction<EditingView>>;
}

export const DashboardContext: React.Context<DashboardContextType> = createContext<DashboardContextType>({
    getData: (connectionId?: number, schemaId?: number) => [],
    setDashboardParams: () => {},
    dashboard: null,
    appendView: (vi) => {},
    isEditable: false,
    assignConnectionId: (index, connectionId) => {},
    assignSchemaId: (index, schemaId) => {},
    selectedConnectionId: undefined,
    selectedSchemaId: undefined,
    setConnectionId: (cid) => {},
    setSchemaId: (sid) => {},
    setEditingView: (ev) => {}
});

export const DashboardContextProvider: React.FC<DashboardContextProviderProps> = ({ children, dashboard, setDashboard, editingView, setEditingView, isEditable }) => {

    const [dashboardParams, setDashboardParams] = useState<DashboardParams>({});
    const [data, setData] = useState<{ [key: string]: any[] }>({});

    const [selectedConnectionId, setConnectionId] = useState<number | undefined>(undefined);
    const [selectedSchemaId, setSchemaId] = useState<number | undefined>(undefined);

    const getData = (connectionId?: number, schemaId?: number) => {
        console.log(connectionId + ' ' + schemaId);
        if(connectionId === undefined || schemaId === undefined) return [];
        return data[connectionId + '-' + schemaId] || [];
    };

    // TODO: Make indeterminate cid and sid for editing purposes
    const appendView = (type: DataViewType) => {
        setDashboard(
            {
                ...dashboard,
                dashboardViews: [
                    ...dashboard.dashboardViews,
                    {
                        type: type,
                        connectionId: selectedConnectionId,
                        schemaId: selectedSchemaId,
                        w: 4,
                        h: 200,
                        name: 'New ' + type,
                        args: []
                    }
                ]
            }
        )
    }

    const assignConnectionId = (index: number, connectionId?: number) => {

            setDashboard({
                ...dashboard,
                dashboardViews: dashboard.dashboardViews.map((view, i) => {
                    if (i === index) {
                        return { ...view, connectionId: connectionId };
                    }
                    return view;
                })
            });
    }

    const assignSchemaId = (index: number, schemaId?: number) => {
        setDashboard({
            ...dashboard,
            dashboardViews: dashboard.dashboardViews.map((view, i) => {
                if (i === index) {
                    return { ...view, schemaId: schemaId };
                }
                return view;
            })
        });
    }

    const dataCombos = useMemo(() => {
        let dataCombos = new Map<number, number[]>();
        if(dashboard !== null) {
            for (const view of dashboard.dashboardViews) {
                const cid = view.connectionId;
                const sid = view.schemaId;

                if (cid && sid) {
                    if (dataCombos.has(cid)) {
                        dataCombos.set(cid, [...dataCombos.get(cid)!, sid]);
                    } else {
                        dataCombos.set(cid, [sid]);
                    }
                }
            }
        }
        console.log('dataCombos: ' + JSON.stringify(dataCombos))
        return dataCombos;
    }, [dashboard]);



    useEffect(() => {

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

                    console.log('DATA: ' + connectionId + ' - ' + schemaId);
                    const decoded = SchemaParser.parse(data, schemaId);



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
        <DashboardContext.Provider value={{ 
            getData, setDashboardParams, dashboard, appendView, isEditable, 
            assignConnectionId, assignSchemaId,
            selectedConnectionId, selectedSchemaId,
            setConnectionId, setSchemaId,
            setEditingView
            }}>
            {children}
        </DashboardContext.Provider>
    );
};




// Create a hook to access the decoded data
const useDecodedData = () => useContext(DashboardContext);

export { useDecodedData };