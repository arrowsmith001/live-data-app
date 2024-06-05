import { useContext, useEffect, useState } from "react";
import { socket } from "../network/socket";
import { SchemaParser } from "../data/SchemaParser";
import { Box } from "@mui/material";
import { DashboardContext } from "../data/DashboardContextProvider";

export type DataViewProps = {
    connectionId?: number,
    schemaId?: number,
    args: any[][]
}

const Display = ({ connectionId, schemaId, args }: DataViewProps ) => {

    const { getData } = useContext(DashboardContext);

    const data = getData(connectionId, schemaId);
    const latest = data.length > 0 ? data[data.length - 1] : null;

    return (
        <Box flex='row' width={'100%'}>
            {
                latest && (
                        <Box >
                            {JSON.stringify(latest)}
                        </Box>
                    )
                
            }
        </Box>
    );
}

export default Display;