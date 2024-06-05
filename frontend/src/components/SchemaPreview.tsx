import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { SchemaInfo } from "../api/model";



const SchemaPreview = ({ schema }: { schema: SchemaInfo }) => {

    const [preview, setPreview] = useState('');

    function previewFloat() {
        return Math.random() * 100;
    }

    function previewInt() {
        return Math.floor(Math.random() * 100);
    }

    function previewString() {
        return 'hello';
    }
    function previewBoolean() {
        return Math.random() > 0.5 ? true : false;
    }
    function previewTimestamp() {
        return Date.now().valueOf();
    }

    function previewSchema(): string {

        if (schema.format === 'delimited') {
            let preview = '';
            const delimiter = schema.delimiter;

            for (let i = 0; i < schema.count; i++) {
                switch (schema.types[i]) {
                    case 'float':
                        preview += previewFloat();
                        break;
                    case 'integer':
                        preview += previewInt();
                        break;
                    case 'string':
                        preview += previewString();
                        break;
                    case 'timestamp':
                        preview += Date.now().valueOf();
                        break;
                    case 'boolean':
                        preview += previewBoolean();
                        break;
                    default:
                        preview += '?';
                }
                if (i < schema.count - 1) {
                    preview += delimiter;
                }
            }

            return preview;



        } else if (schema.format === 'json') {
            const obj: { [key: string]: any } = {};

            for (let i = 0; i < schema.count; i++) {

                switch (schema.types[i]) {

                    case 'float':
                        obj[schema.labels[i]] = previewFloat();
                        break;
                    case 'integer':
                        obj[schema.labels[i]] = previewInt();
                        break;
                    case 'string':
                        obj[schema.labels[i]] = previewString();
                        break;
                    case 'timestamp':
                        obj[schema.labels[i]] = previewTimestamp();
                        break;
                    case 'boolean':
                        obj[schema.labels[i]] = previewBoolean();
                        break;
                    default:
                }

            }
            return JSON.stringify(obj);

        }

        return '';
    }


    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            {previewSchema()}
        </Box>
    );
}



export default SchemaPreview;