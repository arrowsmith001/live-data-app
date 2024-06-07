import { useContext } from "react";
import { DashboardContext } from "../data/DashboardContextProvider";
import { Box, Card, Grid, Icon, IconButton, Input, Menu, MenuItem, Select } from "@mui/material";
import { Cancel, Label } from "@mui/icons-material";
import { DataContext } from "../data/DataContextProvider";
import SchemaItem from "./SchemaItem";
import { DataViewTypeInputs } from "../api/model";
import { ConnectionIcon, SchemaIcon } from "./icons";


const EditViewPanel = () => {

    const { connections, schemas } = useContext(DataContext);

    const { dashboard, assignConnectionId, assignSchemaId, setEditingView, editingView, getData, setViewArg } = useContext(DashboardContext);

    const viewIndex = editingView.viewIndex ?? -1;
    const view = dashboard?.dashboardViews[viewIndex];
    const type = view?.type;
    const inputs = type ? DataViewTypeInputs[type] : null;


    return (
        
        <Grid container spacing={1} flexDirection={'column'} display={'flex'} width={'100%'}>
            <IconButton onClick={() => setEditingView((prev) => { return {...prev, isEditing: false}})}>
                <Cancel/>
            </IconButton>
            <Grid item flexDirection={'row'} display={'flex'}  alignItems={'center'}>
            <Input name="Name" onChange={(e) => console.log(e)} />
            </Grid> 
            
            <Grid item flexDirection={'row'} display={'flex'}  alignItems={'center'}>
                <ConnectionIcon />
            <Select  sx={{width: '100%'}} label='Connection' onChange={(e) => {assignConnectionId(viewIndex, parseInt(e.target.value?.toString() ?? ''))}} value={view?.connectionId ?? -1}>
                
                {
                    Array.from(connections.values()).map((c) => {
                        return <MenuItem value={c.id}>{c.name}</MenuItem>
                    })

                }
            </Select>
            </Grid> 

            <Grid item flexDirection={'row'} display={'flex'} alignItems={'center'}>
                <SchemaIcon/>
        
                <Select sx={{width: '100%'}} label='Schema' onChange={(e) => {assignSchemaId(viewIndex, parseInt(e.target.value?.toString() ?? ''))}} value={view?.schemaId ?? -1}>
                {
                    Array.from(schemas.values()).map((c) => {
                        return <MenuItem value={c.id}>{c.name}</MenuItem>
                    })

                }
            </Select>
            </Grid>


            { inputs &&
                inputs.map((inp, inputIndex) => {
                    return <Box sx={{flexDirection: 'row', display: 'flex'}}>
                        <Card sx={{ p: 1, pl: 2, pr: 2, m: 1, width: '50%' }}>
                        <h4 style={{ margin: 0 }}>{inp.label}</h4>
                        <h5 style={{ margin: 0 }}>{inp.type}</h5>
                    </Card>
                    <Select onChange={(e) => setViewArg(viewIndex, inputIndex, (e.target.value as number) ?? null)} sx={{width: '50%'}}>

                    {
                            view?.schemaId &&
                            Array.from(Array(schemas.get(view.schemaId)?.count).keys()).map((i) => {
                                const schema = schemas.get(view.schemaId);
                                return <MenuItem value={i}>
                                    <SchemaItem key={i} schema={schema!} index={i}></SchemaItem>
                                </MenuItem>
                            })
                        }

                    </Select>
                    </Box>
                })
            }


        </Grid>
    );
}

export default EditViewPanel;