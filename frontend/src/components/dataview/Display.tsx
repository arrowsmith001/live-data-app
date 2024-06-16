import { useContext, useEffect, useState } from "react";
import { socket } from "../../network/socket";
import { SchemaParser } from "../../data/SchemaParser";
import { Box, Card, IconButton, Paper, Typography, colors } from "@mui/material";
import { DashboardContext } from "../../data/DashboardContextProvider";
import { SingleStreamContext } from "../../data/SingleStreamContext";
import { getDataConfigError, validateArgMapping } from "../../utils/utils";
import { Settings } from "@mui/icons-material";
import { DataViewError } from "./DataViewError";
import { DataViewProps } from "./DataView";
import { DataViewTypeInputs } from "../../api/model";
import { centeredStyle, columnStyle, rowStyle, useColors } from "../../styles/styles";
import { DataContext } from "../../data/DataContextProvider";
import { DataStreamContext } from "../../data/DataStreamContext";
import { DataViewContext } from "../../data/DataViewContext";


const input = DataViewTypeInputs.display[0];

const Display = () => {

    const colors = useColors();

    const { schemas } = useContext(DataContext);


    const { getData, getLatestData } = useContext(DataStreamContext);
    const { view } = useContext(DataViewContext);

    const inputMapping = view?.config.inputMapping ?? {};
    const connectionId = view?.config.connectionId ?? -1;
    const schemaId = view?.config.schemaId ?? -1;


    const data = getLatestData(connectionId, schemaId);
    const datum = data ? data[inputMapping[0]] : null;

    const schema = schemas.get(schemaId);
    const label = schema ? schema.labels[inputMapping[0]] : 'No schema';

    return (
        <Box p={2} width={'100%'} height={'90%'} sx={{ ...centeredStyle, flexDirection: 'column' }}>



            <Box sx={rowStyle}>
            <Paper sx={{ backgroundColor: colors.primary[600], margin: 1}} elevation={2}>

            <Typography pl={2} pr={2} pt={1} pb={1}  textAlign={'start'}
                variant='h3' color='textPrimary'>
                {label}
            </Typography>
                </Paper>
            <Paper sx={{ backgroundColor: colors.primary[500], width: '100%', pl: 1, pr: 1, pt: 2, pb: 2}} elevation={2}>

                <Box width={'100%'} sx={centeredStyle}>


                    <Typography noWrap sx={{ textAlign: 'center', pl: 2, pr: 2 }} width={'100%'}  variant='h4' color='textPrimary'>
                        {datum ?? '-'}
                    </Typography>
                </Box>

            </Paper>
            </Box>
        </Box>
    );
}

export default Display;