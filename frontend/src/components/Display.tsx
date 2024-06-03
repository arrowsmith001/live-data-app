import { useEffect, useState } from "react";
import { socket } from "../network/socket";
import { SchemaInfo, getSchema, getSchemas } from "../api/ApiFunctions";
import { SchemaParser } from "../data/SchemaParser";
import { Box } from "@mui/material";

const Display = ({ connectionId, schemaId, args }: { connectionId: number, schemaId: number, args: any[] }) => {

    const eventName = 'connection-' + connectionId;

    const [schema, setSchema] = useState<SchemaInfo | undefined>();
    const [latestData, setLatestData] = useState<any[]>();

    useEffect(() => {

        getSchema(schemaId).then((schema) => {
            setSchema(schema);

            socket.on(eventName, (data: any) => {

                const parsed = SchemaParser.parseMultiple(schema, data, args);
                setLatestData(parsed);
            });
        }).catch((error) => {
            console.error(error);
        });


        return () => {
            socket.off('connection-' + connectionId);
        };

    }, []);

    return (
        <Box flex='row' width={'100%'}>
            {
                latestData && latestData.map((data, i) => {
                    return (
                        <Box key={i}>
                            {JSON.stringify(data)}
                        </Box>
                    );
                })
            }
        </Box>
    );
}

export default Display;