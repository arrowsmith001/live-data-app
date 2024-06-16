import { ReactNode, createContext } from "react"
import { Dashboard, DashboardEditContext, DashboardView } from './DashboardEditContextProvider';


type DataViewContextType = {
    view : DashboardView | undefined
}


export const DataViewContextProvider = ({ view, children } : DataViewContextType & {children: ReactNode} ) => {
    
    return <DataViewContext.Provider value={{ view }}>
        {children}
    </DataViewContext.Provider>
}

export const DataViewContext : React.Context<DataViewContextType> = createContext<DataViewContextType>({
    view : undefined
})
