import { IconButton, Box, Typography, CircularProgress, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TextField, Button, Grid, Card } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { socket } from '../network/socket';
import { addConnection, deleteConnection, getConnections } from "../api/ApiFunctions";
import { ConnectionInfo } from "../api/model";
import ConnectionStatusDot from "../components/ConnectionStatusDot";


const Connections = () => {
    const [connections, setConnections] = useState<ConnectionInfo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [newConnection, setNewConnection] = useState({
        name: "",
        ip: "",
        port: "",
        endpoint: ""
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setNewConnection(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    async function handleAddConnection() {
        setError(null);
        try {
            await addConnection({
                name: newConnection.name,
                ip: newConnection.ip,
                port: parseInt(newConnection.port),
                endpoint: newConnection.endpoint
            });
        }
        catch (error: any) {
            setError(error.message);
        }
    };

    async function handleDeleteConnection(id: any) {
        setError(null);
        try {
            await deleteConnection(id);
        }
        catch (error: any) {
            setError(error.message);
        }
    };

    useEffect(() => {
        const fetchConnections = async () => {
            try {
                let connections = await getConnections();
                setConnections(connections);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchConnections();

        socket.on('connections_changed', (data) => {
            setConnections(JSON.parse(data));
        });

    }, []);




    return (
        <Box  p={8} sx={{overflowY : 'auto', height: '100%' }}>

            <Typography variant="h1">Connections</Typography>
            {loading && <CircularProgress />}
            <Grid p={2} pt={3} pb={3} container spacing={4}>
               <Grid item>
               <TextField
                    name="name"
                    label="Name"
                    value={newConnection.name}
                    onChange={handleInputChange}
                />
               </Grid>
               <Grid item>
                
                <TextField
                    name="ip"
                    label="IP Address"
                    value={newConnection.ip}
                    onChange={handleInputChange}
                />
               </Grid>
               <Grid item>
                
                <TextField
                    name="port"
                    label="Port"
                    value={newConnection.port}
                    onChange={handleInputChange}
                />
               </Grid>
               <Grid item>
                
                <TextField
                    name="endpoint"
                    label="Endpoint"
                    value={newConnection.endpoint}
                    onChange={handleInputChange}
                />
               </Grid>
               <Grid item>
                
               <Button color="secondary" sx={{height: '100%'}} variant="contained" onClick={handleAddConnection}>Add Connection</Button>
               </Grid>
               {error && <Grid item>
                <Typography color="error">{error}</Typography>
               </Grid>}
            </Grid>
            <Box fontSize={'26px'} p={2}>
                <TableContainer component={Card}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>IP Address</TableCell>
                                <TableCell>Port</TableCell>
                                <TableCell>Endpoint</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {connections.map((connection: ConnectionInfo) => (
                                <TableRow key={connection.id}>
                                    <TableCell width={'80px'} >
                                        <ConnectionStatusDot id={connection.id} />
                                    </TableCell>
                                    <TableCell>{connection.name}</TableCell>
                                    <TableCell>{connection.ip}</TableCell>
                                    <TableCell>{connection.port}</TableCell>
                                    <TableCell>{connection.endpoint}</TableCell>
                                    <TableCell><IconButton onClick={(e: any) => handleDeleteConnection(connection.id)}><Delete /></IconButton></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

        </Box>
    );
}

export default Connections;