import { IconButton, Box, Typography, CircularProgress, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TextField, Button, Grid } from "@mui/material";
import { Delete } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useState, useEffect } from "react";
import { WebSocketConfig } from "../backlog/WebSocketListener";
import { socket } from '../network/socket';
import { getUrlFromConnectionInfo } from "../utils/utils";
import { addConnection, deleteConnection, getConnections } from "../api/ApiFunctions";
import { ConnectionInfo } from "../api/model";


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
        <Box p={8}>

            <Typography variant="h1">Connections</Typography>
            {loading && <CircularProgress />}
            <Box mt={2}>
                <Typography p={2} variant="h2">Add New Connection</Typography>
                <TextField
                    name="name"
                    label="Name"
                    value={newConnection.name}
                    onChange={handleInputChange}
                />
                <TextField
                    name="ip"
                    label="IP Address"
                    value={newConnection.ip}
                    onChange={handleInputChange}
                />
                <TextField
                    name="port"
                    label="Port"
                    value={newConnection.port}
                    onChange={handleInputChange}
                />
                <TextField
                    name="endpoint"
                    label="Endpoint"
                    value={newConnection.endpoint}
                    onChange={handleInputChange}
                />
                <Button variant="contained" onClick={handleAddConnection}>Add Connection</Button>
                {error && <Typography color="error">{error}</Typography>}
            </Box>
            <Box p={2}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
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