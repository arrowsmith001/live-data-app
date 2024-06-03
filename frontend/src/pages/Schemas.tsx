import { Schema } from "inspector";
import React, { useEffect, useState } from "react";
import { types } from "util";
import { format } from "path";
import { SchemaFormat, SchemaInfo, SchemaType, addSchema, deleteSchema, getSchemas } from "../api/ApiFunctions";
import {
    Box,
    Button,
    Card,
    CircularProgress,
    Container,
    FormControl,
    IconButton,
    InputLabel,
    ListItem,
    MenuItem,
    Select,
    SelectChangeEvent,
    TableContainer,
    TextField,
    Typography,
} from "@mui/material";
import { socket } from "../network/socket";
import { Delete } from "@mui/icons-material";
import SchemaPreview from "../components/SchemaPreview";
import SchemaItem from "../components/SchemaItem";


const Schemas = () => {

    const [schemas, setSchemas] = useState<SchemaInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [newSchema, setNewSchema] = useState<SchemaInfo>({
        labels: [],
        types: [],
        format: "delimited",
        delimiter: ",",
        name: "",
        count: 0
    });


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

    const handleInputChange = ({ name, value }: { name: string, value: string }) => {
        setNewSchema((prevSchema) => ({
            ...prevSchema,
            [name]: value,
        }));
    };

    const handleLabelsChange = ({ value, index }: { value: string, index: number }) => {
        setNewSchema((prevSchema) => ({
            ...prevSchema,
            labels: prevSchema.labels.map((label, i) => i === index ? value : label)
        }));
    };

    const handleTypesChange = ({ value, index }: { value: SchemaType, index: number }) => {
        setNewSchema((prevSchema) => ({
            ...prevSchema,
            types: prevSchema.types.map((type, i) => i === index ? value : type)
        }));
    };

    const addField = () => {
        setNewSchema((prevSchema) => ({
            ...prevSchema,
            count: prevSchema.count + 1,
            labels: [...prevSchema.labels, ""],
            types: [...prevSchema.types, 'float']
        }));
    };

    const removeField = (index: number) => {
        setNewSchema((prevSchema) => ({
            ...prevSchema,
            count: prevSchema.count - 1,
            labels: prevSchema.labels.filter((_, i) => i !== index),
            types: prevSchema.types.filter((_, i) => i !== index)
        }));
    }

    const handleAddSchema = async () => {
        setError(null);
        try {
            await addSchema({
                name: newSchema.name,
                labels: newSchema.labels,
                types: newSchema.types,
                format: newSchema.format,
                delimiter: newSchema.delimiter,
                count: newSchema.count
            });
        }
        catch (error: any) {
            setError(error.message);
        }
    };

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
        <Box p={8}>

            <Typography variant="h1">Schemas</Typography>
            {loading && <CircularProgress />}
            <Box mt={2}>
                <Typography p={2} variant="h2">Add New Schema</Typography>


                <Typography p={4} variant="h3">Name & Format</Typography>
                <TextField
                    name="name"
                    label="Name"
                    value={newSchema.name}
                    onChange={(e) => handleInputChange({ name: "name", value: e.target.value })}
                />



                <Select
                    name="format"
                    label="Select Format"
                    value={newSchema.format}
                    onChange={(e) => handleInputChange({ name: "format", value: e.target.value })}
                >
                    <MenuItem value="delimited">Delimited</MenuItem>
                    <MenuItem value="json">JSON</MenuItem>
                </Select>
                {newSchema.format === "delimited" && (<TextField
                    inputProps={{ maxLength: 1 }}
                    name="delimiter"
                    label="Delimiter"
                    value={newSchema.delimiter}
                    onChange={(e) => handleInputChange(e.target)}
                />)}

                <Typography p={4} variant="h3">Fields</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                    {Array.from({ length: newSchema.count }).map((_, i) => (
                        <Card sx={{ alignItems: 'center', padding: 2, margin: 1, display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }} key={i}>
                            <Typography p={1} variant="h4">{i + 1}</Typography>
                            <TextField
                                name="labels"
                                label="Label"
                                value={newSchema.labels[i]}
                                onChange={(e) => handleLabelsChange({ value: e.target.value, index: i })}
                            />
                            <Select
                                name="types"
                                label="Select Type"
                                value={newSchema.types[i]}
                                onChange={(e) => handleTypesChange({ value: e.target.value as SchemaType, index: i })}
                            >
                                <MenuItem value="float">Number (float)</MenuItem>
                                <MenuItem value="integer">Number (integer)</MenuItem>
                                <MenuItem value="timestamp">Timestamp</MenuItem>
                                <MenuItem value="string">String</MenuItem>
                                <MenuItem value="boolean">Boolean</MenuItem>
                            </Select>
                            <IconButton onClick={() => removeField(i)}>
                                <Delete />
                            </IconButton>
                        </Card>
                    ))}
                    <Button variant="contained" onClick={() => addField()}>
                        Add Field
                    </Button>
                </Box>

                <SchemaPreview schema={newSchema} />


                <Button variant="contained" onClick={handleAddSchema}>
                    Add Schema
                </Button>
                {error && <Typography color="error">{error}</Typography>}
            </Box>

            <Box>
                {schemas.map((schema) => (
                    <div key={schema.id}>
                        <Typography variant="h2">{schema.name}</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                            {Array.from({ length: schema.count }).map((_, i) => (
                                <SchemaItem key={i} label={schema.labels[i]} type={schema.types[i]}></SchemaItem>
                            ))}
                        </Box>
                        <IconButton onClick={(e) => handleDeleteSchema(schema.id)}>
                            <Delete />
                        </IconButton>
                    </div>
                ))}
            </Box>

        </Box>

    );
};

export default Schemas;