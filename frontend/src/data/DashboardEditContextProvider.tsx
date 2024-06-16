import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { Layout } from "react-grid-layout";
import { DataViewInput, DataViewType } from "../api/model";
import { DataStreamConfig } from "../deprecated/DataStreamMenuItem";
import { DataContext } from "./DataContextProvider";
import { DataStreamContext, DataStreamContextProvider } from "./DataStreamContext";
import { Stream } from "./model";


export type EditingView = {
    id?: number;
    isEditing: boolean;
}

export type DataViewConfig = {
    type: DataViewType;
    connectionId: number;
    schemaId: number;
    inputMapping: {
        [key: number]: number;
    };
}

export type Dashboard = {
    views: {
        [key : string]: DashboardView
    }
}

export type DashboardView = {
    config: DataViewConfig;
    layout: Layout;
}

interface DashboardEditContextProviderProps {
    children: ReactNode;
}


interface DashboardEditContextType {
    selectedView: EditingView;
    setSelectedView: React.Dispatch<React.SetStateAction<EditingView>>;
    getLayouts: () => {lg: Layout[], md: Layout[], sm: Layout[], xs: Layout[], xxs: Layout[]};
    setLayouts: (layout: Layout[]) => void;
    workingDashboard: Dashboard;
    setWorkingDashboard: React.Dispatch<React.SetStateAction<Dashboard>>;
    getViewPinned: (id: string) => boolean;
    setViewPinned: (id: string, isPinned: boolean) => void;
    isSelected: (id: string) => boolean;
}

export const DashboardEditContextProvider = ({children} : DashboardEditContextProviderProps) => {


    const [workingDashboard, setWorkingDashboard] = useState<Dashboard>({
        views: {
            '0': {
                config: {type: 'line', connectionId: -1, schemaId: -1, inputMapping: {}},
                layout: { i: '0', x: 0, y: 0, w: 1, h: 1}
            },
            '1':  {
                config: {type: 'display', connectionId: -1, schemaId: -1, inputMapping: {}},
                layout: { i: '1', x: 1, y: 0, w: 3, h: 2},
            }
            // '2': {
            //     config: {type: 'pose', connectionId: -1, schemaId: -1, inputMapping: {}},
            //     layout: { i: '2', x: 4, y: 0, w: 3, h: 2
            // },
    }
    });



    const setLayouts = (layouts: Layout[]) => {
        setWorkingDashboard((prev) => {
            // set each dashboard view layout, assigned according to layout.i mapped to view id
            const views = Object.entries(prev.views).map(([id, view]) => {
                return {
                    config: view.config,
                    layout: layouts.find((layout) => layout.i === id) || view.layout
                };
            });

            return {
                views: Object.fromEntries(views.map((view, index) => [index.toString(), view]))
            } as Dashboard;
            
            
        });
    }


    const getLayouts = () => {
        const layouts = Object.entries(workingDashboard.views).map(([id, view]) => {
            return view.layout;
        } );    
        const out = {
            lg: layouts,
            md: layouts,
            sm: layouts,
            xs: layouts,
            xxs: layouts,
        }
        console.log("GET LAYOUTS: " + JSON.stringify(out));
        return out;
    }
    
    const getViewPinned = (id: string) => {
        return workingDashboard.views[id].layout.static ?? false;
    }

    const setViewPinned = (id: string, isPinned: boolean) => {
        setWorkingDashboard((prev) => {
            const views = Object.entries(prev.views).map(([viewId, view]) => {
                return {
                    config: view.config,
                    layout: {...view.layout, static: viewId === id ? isPinned : view.layout.static}
                };
            });

            return {
                views: Object.fromEntries(views.map((view, index) => [index.toString(), view]))
            } as Dashboard;
            
            
        });
    }

    const isSelected = (id: string) => {
        return selectedView.isEditing &&  selectedView.id === parseInt(id);
    }

    const [selectedView, setSelectedView] = useState<EditingView>({isEditing: false});
    
    const [streams , setStreams] = useState<Stream[]>([]);

    useEffect(() => {

        const newStreams = Object.entries(workingDashboard.views).map(([id, view]) => {
            const {connectionId, schemaId} = view.config;
            return { connectionId, schemaId, data: [] };
        });
        console.log('US 1: ' + JSON.stringify(newStreams));
        setStreams(newStreams);

    }, [workingDashboard]);

    console.log('US 2: ' + JSON.stringify(streams));

    return (<DataStreamContextProvider streams={streams}>

<DashboardEditContext.Provider value={{ 
                selectedView, setSelectedView, 
                workingDashboard, setWorkingDashboard,
                getLayouts, setLayouts,
                getViewPinned, setViewPinned,
                isSelected
                }}>
                {children}
            </DashboardEditContext.Provider>
    </DataStreamContextProvider>
    );
    }


export const DashboardEditContext: React.Context<DashboardEditContextType> = createContext<DashboardEditContextType>({
    selectedView: {isEditing: false},
    setSelectedView: (viewIndex) => {},
    getLayouts: () => {
        return {
            lg: [],
            md: [],
            sm: [],
            xs: [],
            xxs: []
        }
    },
    setLayouts: (_) => {},
    workingDashboard: {views: {}},
    setWorkingDashboard: () => {},
    setViewPinned: (id, isPinned) => {},
    getViewPinned: (id) => false,
    isSelected: (id) => false
});