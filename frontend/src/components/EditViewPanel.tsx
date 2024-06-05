import { useContext } from "react";
import { DashboardContext } from "../data/DashboardContextProvider";
import { Box, Icon, IconButton, Input, Menu, MenuItem, Select } from "@mui/material";
import { Cancel, Label } from "@mui/icons-material";
import { DataContext } from "../data/DataContextProvider";


const EditViewPanel = ({index} : {index: number}) => {

    const { connections, schemas } = useContext(DataContext);

    const { dashboard, assignConnectionId, assignSchemaId, setEditingView } = useContext(DashboardContext);

    return (
        <Box width={'250px'}>
            <IconButton onClick={() => setEditingView((prev) => { return {...prev, isEditing: false}})}>
                <Cancel/>
            </IconButton>
            <Input name="Name" onChange={(e) => console.log(e)} />
            <Select label='Connection' onChange={(e) => {assignConnectionId(index, parseInt(e.target.value?.toString() ?? ''))}} value={dashboard?.dashboardViews[index].connectionId}>
                
                {
                    Array.from(connections.values()).map((c) => {
                        return <MenuItem value={c.id}>{c.name}</MenuItem>
                    })

                }
            </Select>
            <Select label='Schema' onChange={(e) => {assignSchemaId(index, parseInt(e.target.value?.toString() ?? ''))}} value={dashboard?.dashboardViews[index].schemaId}>
                {
                    Array.from(schemas.values()).map((c) => {
                        return <MenuItem value={c.id}>{c.name}</MenuItem>
                    })

                }
            </Select>


        </Box>
    );
}

export default EditViewPanel;