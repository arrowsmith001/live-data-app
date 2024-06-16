import { DataArray, Settings } from "@mui/icons-material";
import { Box, Typography, IconButton } from "@mui/material";
import { centeredStyle, columnStyle, rowStyle } from "../../styles/styles";
import { DataViewType, Error } from "../../api/model";
import { ConnectionIcon, SchemaIcon } from "../icons";

export const DataViewError = ({ error, type }: { error: Error, type: DataViewType }) => {

    
    return (
        <Box sx={columnStyle}>


            <Typography textAlign={'center'}>
                {type.toUpperCase()}
            </Typography>

                <Typography textAlign={'center'}>
                    {error.message.toString()}
                </Typography>
                <IconButton size='small'>
                    {error.errorType === 'connection' && <ConnectionIcon/>}
                    {error.errorType === 'schema' && <SchemaIcon/>}
                    {error.errorType === 'input' && <DataArray/>}
                </IconButton>
            </Box>

    );
}