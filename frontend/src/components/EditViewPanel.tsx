import { useContext, useEffect, useMemo, useState } from "react";
import { DashboardContext } from "../data/DashboardContextProvider";
import { Box, Card, Grid, Icon, IconButton, Input, Menu, MenuItem, Select } from "@mui/material";
import { Cancel, Label } from "@mui/icons-material";
import { DataContext } from "../data/DataContextProvider";
import SchemaItem from "./SchemaItem";
import { DataViewTypeInputs } from "../api/model";
import { ConnectionIcon, SchemaIcon } from "./icons";
import { DashboardEditContext } from "../data/DashboardEditContextProvider";
import { set } from "date-fns";


const EditViewPanel = () => {

    const { connections, schemas } = useContext(DataContext);

    const { selectedView, setSelectedView, workingDashboard, setWorkingDashboard } = useContext(DashboardEditContext);

    if (!selectedView || selectedView.id === undefined) return null;

    const view = workingDashboard.views[selectedView.id.toString()];
  
    if (!view) return null;
  
    const { connectionId, schemaId } = view.config;
  
    const schema = schemas.get(schemaId);
  
    const inputs = DataViewTypeInputs[view.config.type];

    const mapping = view.config.inputMapping ?? {};


    function setSelectedConnectionId(connectionId: number) {
        setWorkingDashboard(
            (prev : any) => {
                const newDashboard = {...prev};
                newDashboard.views[selectedView!.id!.toString()].config.connectionId = connectionId;
                console.log('newDashboard', newDashboard);
                return newDashboard;
            }
        )
    }

    function setSelectedSchemaId(schemaId: number) {
        setWorkingDashboard(
            (prev : any) => {
                const newDashboard = {...prev};
                newDashboard.views[selectedView!.id!.toString()].config.schemaId = schemaId;
                console.log('newDashboard', newDashboard);
                return newDashboard;
            }
        )
    }

    function mapInput(inputIndex: number, value: any) {
        setWorkingDashboard(
            (prev : any) => {
                const newDashboard = {...prev};
                newDashboard.views[selectedView!.id!.toString()].config.inputMapping[inputIndex] = value;
                console.log('newDashboard', newDashboard);
                return newDashboard;
            }
        )
    }

    return (
        
        <Grid container spacing={1} flexDirection={'column'} display={'flex'} width={'100%'}>
            <IconButton onClick={() => setSelectedView((prev) => { return {...prev, isEditing: false}})}>
                <Cancel/>
            </IconButton>
            <Grid item flexDirection={'row'} display={'flex'}  alignItems={'center'}>
            <Input name="Name" onChange={(e) => console.log(e)} />
            </Grid> 
            
            <Grid item flexDirection={'row'} display={'flex'}  alignItems={'center'}>
                <ConnectionIcon />
            <Select value={connectionId}  sx={{width: '100%'}} label='Connection' onChange={(e) => { setSelectedConnectionId(e.target.value as number) }}>
                
                {
                    Array.from(connections.values()).map((c) => {
                        return <MenuItem value={c.id}>{c.name}</MenuItem>
                    })

                }
            </Select>
            </Grid> 

            <Grid item flexDirection={'row'} display={'flex'} alignItems={'center'}>
                <SchemaIcon/>
        
                <Select value={schemaId}  sx={{width: '100%'}} label='Schema' onChange={(e) => { setSelectedSchemaId(e.target.value as number)
            }}>
                {
                    Array.from(schemas.values()).map((s) => {
                        return <MenuItem value={s.id}>{s.name}</MenuItem>
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
                    <Select value={mapping[inputIndex]} onChange={(e) => mapInput(inputIndex, (e.target.value as number) ?? null)} sx={{width: '50%'}}>

                    {
                            schema &&
                            Array.from(Array(schema.count).keys()).map((i) => {
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