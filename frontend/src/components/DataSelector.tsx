import { useState, useEffect, useContext } from "react";
import { getConnections, getSchemas } from "../api/ApiFunctions";
import { ConnectionInfo, SchemaInfo } from "../api/model";
import { Box, MenuItem, Select } from "@mui/material";
import { DashboardContext } from "../data/DashboardContextProvider";
import { DbContext } from "../data/DbContextProvider";


const DataSelector = () => {

    const {connections, schemas } = useContext(DbContext);

    const { getData, selectedConnectionId, selectedSchemaId, setConnectionId, setSchemaId } = useContext(DashboardContext);
    
    // const data = JSON.stringify(getData(selectedConnectionid, selectedSchemaId));
    // console.log(data);

    return (
        <Box>
            {/* <p>{JSON.stringify(data[data.length])}</p> */}
            <Select
        
                sx={{ width: '50%' }}
                value={selectedConnectionId}
                onChange={(e) => {
                    const val = Array.from(connections.values()).find((c) => c.id === parseInt(e.target.value?.toString() ?? ''));
                    setConnectionId(val?.id);
                }}
                MenuProps={{
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center',
                    },
                    transformOrigin: {
                        vertical: 'top',
                        horizontal: 'center',
                    }
                }}
            >
                {
                    Array.from(connections.values()).map((c) => {
                        return <MenuItem value={c.id}>{c.name}</MenuItem>
                    })
                }
            </Select>
            <Select
                sx={{ width: '50%' }}
                value={selectedSchemaId}
                onChange={(e) => {
                    console.log(JSON.stringify(schemas));
                    const val = Array.from(schemas.values()).find((c) => c.id === parseInt(e.target.value?.toString() ?? ''));
                    console.log(val);
                    setSchemaId(val?.id);
                }}
                MenuProps={{
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center',
                    },
                    transformOrigin: {
                        vertical: 'top',
                        horizontal: 'center',
                    }
                }}
            >
                {
                    Array.from(schemas.values()).map((s) => {
                        return <MenuItem value={s.id}>{s.name}</MenuItem>
                    })
                }
            </Select>
        </Box>
    );
};

export default DataSelector;
