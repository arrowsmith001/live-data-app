import { Add, Delete } from "@mui/icons-material";
import { Box, Typography, TextField, Select, Card, IconButton, Button, MenuItem, Grid } from "@mui/material";
import { error } from "console";
import { DataType, SchemaInfo } from "../../api/model";
import SchemaPreview from "../../components/SchemaPreview";
import { useState } from "react";
import { addSchema } from "../../api/ApiFunctions";
import { useColors } from "../../styles/styles";

const AddSchema = () => {

    const [newSchema, setNewSchema] = useState<SchemaInfo>({
        labels: [],
        types: [],
        format: "delimited",
        delimiter: ",",
        name: "",
        count: 0
    });

    const colors = useColors();

    const [error, setError] = useState<string | null>(null);

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

    const handleTypesChange = ({ value, index }: { value: DataType, index: number }) => {
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


    return (
        <Box p={8} display={'flex'} flexDirection={'column'}>

            <Typography variant="h2">Add New Schema</Typography>

            <Box p={4}>
                <Typography variant="h3">Name & Format</Typography>

                <Grid p={2} pt={3} pb={3} container spacing={4}>
                    <Grid item>
                        <TextField
                            name="name"
                            label="Name"
                            value={newSchema.name}
                            onChange={(e) => handleInputChange({ name: "name", value: e.target.value })}
                        />
                    </Grid>
                    <Grid item>
                        <Select
                            name="format"
                            label="Select Format"
                            value={newSchema.format}
                            onChange={(e) => handleInputChange({ name: "format", value: e.target.value })}
                        >
                            <MenuItem value="delimited">Delimited</MenuItem>
                            <MenuItem value="json">JSON</MenuItem>
                        </Select></Grid>
                    <Grid item>
                        {newSchema.format === "delimited" && (
                            <TextField
                                sx={{ width: '80px', textAlign: 'center' }}

                                inputProps={{ maxLength: 1 }}
                                name="delimiter"
                                label="Delimiter"
                                value={newSchema.delimiter}
                                onChange={(e) => handleInputChange(e.target)}
                            />)}
                    </Grid>
                </Grid>
            </Box>

            <Box pl={4} pr={4}>

                <Typography variant="h3">Fields</Typography>

                <Box p={2} pt={3} pb={3} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
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
                                onChange={(e) => handleTypesChange({ value: e.target.value as DataType, index: i })}
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
                    <Card sx={{
                        backgroundColor: 'transparent', color: colors.primary['100'],
                        borderRadius: '16px',
                        padding: 2, height: '75px', width: '200px', alignItems: 'center', justifyItems: 'center', display: 'flex', flexDirection: 'row', justifyContent: 'center',
                        cursor: 'pointer', '&:hover': { backgroundColor: colors.primary['400'] }
                    }}
                        elevation={6} onClick={() => addField()}>
                        <Typography>Add Field</Typography>
                        <Add sx={{ height: '30px', width: '30px' }} />
                    </Card>
                </Box>

            </Box>

            {/* <SchemaPreview schema={newSchema} /> */}


            <Box sx={{width: '100%', justifyContent: 'center', display: 'flex'}}>
                <Button sx={{maxWidth: '200px'}} variant="contained" color="secondary" onClick={handleAddSchema}>
                    Add Schema
                </Button>
            </Box>
            {error && <Typography color="error">{error}</Typography>}
        </Box>
    );
}


export default AddSchema;