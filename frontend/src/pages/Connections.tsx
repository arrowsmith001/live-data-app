import { Box, Typography, CircularProgress, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import { WebSocketConfig } from "../backlog/WebSocketListener";


const Connections = () => {
    const [connections, setConnections] = useState<WebSocketConfig[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchConnections = async () => {
            try {
                const response = await axios.get("/api/connections");
                setConnections(response.data);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchConnections();
    }, []);

    return (
        <Box>
            <Typography variant="h1">Connections</Typography>
            {loading && <CircularProgress />}
            {error && <Typography color="error">{error}</Typography>}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Host</TableCell>
                            <TableCell>Port</TableCell>
                            <TableCell>Database</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Password</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {connections.map((connection: any) => (
                            <TableRow key={connection.id}>
                                <TableCell>{connection.name}</TableCell>
                                <TableCell>{connection.host}</TableCell>
                                <TableCell>{connection.port}</TableCell>
                                <TableCell>{connection.database}</TableCell>
                                <TableCell>{connection.username}</TableCell>
                                <TableCell>{connection.password}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default Connections;