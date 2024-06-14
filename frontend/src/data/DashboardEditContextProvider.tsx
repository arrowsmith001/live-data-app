import { ReactNode, createContext, useState } from "react";
import { Layout } from "react-grid-layout";
import { DataViewInput, DataViewType } from "../api/model";


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
    setLayout: (id: string, layout: Layout) => void;
    workingDashboard: Dashboard;
    setWorkingDashboard: React.Dispatch<React.SetStateAction<Dashboard>>;
}

export const DashboardEditContextProvider = ({children} : DashboardEditContextProviderProps) => {


    const [workingDashboard, setWorkingDashboard] = useState<Dashboard>({
        views: {
            '0': {
                config: {type: 'line', connectionId: -1, schemaId: -1, inputMapping: {}},
                layout: { i: '0', x: 0, y: 0, w: 1, h: 2 }
            },
            '1':  {
                config: {type: 'display', connectionId: -1, schemaId: -1, inputMapping: {}},
                layout: { i: '1', x: 1, y: 0, w: 3, h: 2 },
            },
            '2': {
                config: {type: 'pose', connectionId: -1, schemaId: -1, inputMapping: {}},
                layout: { i: '2', x: 4, y: 0, w: 3, h: 2
            },
        }
    }
    });

    const setLayouts = (layouts: Layout[]) => {
        setWorkingDashboard((prev) => {
            return {
                views: Object.entries(prev.views).reduce((acc, [key, value]) => {
                    return {
                        ...acc,
                        [key]: {
                            ...value,
                            layout: layouts[parseInt(key)]
                        }
                    };
                }, {})
            } as Dashboard;
        });
    }

    const setLayout = (id : string, layout: Layout) => {
        setWorkingDashboard((prev) => {
            return {
                views: {
                    ...prev.views,
                    [id]: {
                        config: { ...prev.views[id]?.config },
                        layout: layout
                    }
                }
            } as Dashboard;
        });
    }

    const getLayouts = () => {
        const layouts = Object.entries(workingDashboard.views).map(([id, view]) => {
            return view.layout;
        } );    
        return {
            lg: layouts,
            md: layouts,
            sm: layouts,
            xs: layouts,
            xxs: layouts,
        }
    }


    const [selectedView, setSelectedView] = useState<EditingView>({isEditing: false});
    
    return (
        <DashboardEditContext.Provider value={{ 
            selectedView, setSelectedView, 
            workingDashboard, setWorkingDashboard,
            getLayouts, setLayout }}>
            {children}
        </DashboardEditContext.Provider>
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
    setLayout: () => {},
    workingDashboard: {views: {}},
    setWorkingDashboard: () => {}
});