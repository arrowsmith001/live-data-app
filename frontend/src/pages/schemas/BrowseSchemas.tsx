import React, { useEffect, useState } from "react";
import {useTheme,
    Box,
    Card,
    CircularProgress,
    IconButton,
    Typography,
} from "@mui/material";
import { socket } from "../../network/socket";
import { Add, Delete } from "@mui/icons-material";
import SchemaItem from "../../components/SchemaItem";
import { getSchemas, deleteSchema } from "../../api/ApiFunctions";
import { SchemaInfo } from "../../api/model";
import { useNavigate } from "react-router-dom";
import { tokens } from '../../styles/theme';


const BrowseSchemas = () => {

    const [schemas, setSchemas] = useState<SchemaInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const colors = tokens(useTheme().palette.mode);

    useEffect(() => {
        const fetchSchemas = async () => {
            try {
                let schemas = await getSchemas();
                setSchemas(schemas);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSchemas();

        socket.on('schemas_changed', (data) => {
            setSchemas(JSON.parse(data));
        });

    }, []);

   

    const handleDeleteSchema = async (id: any) => {

        setError(null);
        try {
            await deleteSchema(id);
        }
        catch (error: any) {
            setError(error.message);
        }

    }

    return (
        <Box mt={2} width={'100%'} p={8} display={'flex'} flexDirection={'column'}>

            <Box width={'100%'} sx={{flexDirection: 'row', display: 'flex'}}>
            <Typography variant="h1">Schemas</Typography>
            <IconButton sx={{padding: 2}} onClick={(e) => {
                navigate('/schemas/add');}}>
                    <Add/>

                </IconButton>
            </Box>


            {loading && <CircularProgress />}
            

            <Box>
                {schemas.map((schema) => (
                    <Card sx={{backgroundColor: colors.primary[500],  p: 2, pl: 4, m: 3 }}>
                        <Box key={schema.id} width={'100%'}  sx={{flexDirection: 'row', display: 'flex', alignContent: 'space-around', alignItems:'center'}}>
                        <SchemaTitle schema={schema}></SchemaTitle>
                        <Box width={'100%'} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                            {Array.from({ length: schema.count }).map((_, i) => (
                                <SchemaItem key={i} schema={schema} index={i}></SchemaItem>
                            ))}
                        </Box>
                        <IconButton onClick={(e) => handleDeleteSchema(schema.id)}>
                            <Delete />
                        </IconButton>
                    </Box>
                    </Card>
                ))}
            </Box>

        </Box>

    );
};

const SchemaTitle = ({schema} : {schema: SchemaInfo}) => {
    return (
    
    <Box width={'25%'} sx={{flexDirection: 'column', display: 'flex'}}>
    <Typography variant="h3">{schema.name}</Typography>
        <Box sx={{flexDirection: 'row', display: 'flex'}} >
    <Typography variant="subtitle1">{schema.format.toUpperCase()}</Typography>
    {/* {
        schema.format.toString() === 'delimited' && 
            <Box sx={{flexDirection: 'row', display: 'flex'}} >
            <Typography pl={1} variant="subtitle1">{'('}</Typography>
            <Card sx={{width: '20px', height: '20px', textAlign: 'center'}}>{schema.delimiter}</Card>
            <Typography variant="subtitle1">{')'}</Typography>
            </Box>
    } */}
</Box>
    </Box>
)
}

export default BrowseSchemas;