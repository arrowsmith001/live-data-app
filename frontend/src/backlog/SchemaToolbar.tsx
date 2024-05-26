import { Card, Grid } from "@mui/material";
import { DataSchema, DataType } from "./DataReader";
import { DataEvent } from "./DataEvent";



type SchemaViewProps = {
    schema: DataSchema,
    lastEvent: DataEvent
};


const SchemaToolbar = ({ ...props }: SchemaViewProps) => {
    const { schema, lastEvent } = props;

    return (
        <div>
            <Card sx={{ padding: '12px', width: '100%' }}>
                <Grid>
                    <Grid>
                        {new Date(lastEvent?.server_timestamp * 1000).toLocaleString()}
                    </Grid>
                    <Grid>
                        {lastEvent?.data}
                    </Grid>
                    <Grid>
                        {schema.items.map((i) => i.label).join(', ')}
                    </Grid>
                </Grid>
            </Card>
        </div>
    );

    // return (
    //     <div>
    //         <div>{schema.items.map((i) => i.label).join(', ')}</div>
    //         {lastMessage && <div>{lastMessage.map(m => {
    //             if (m instanceof Date) {
    //                 // stringify date, adjusted for timezone, but with no timezone info displayed
    //                 const d = new Date(m.getTime() - m.getTimezoneOffset() * 60 * 1000);
    //                 const tzOffset = m.getTimezoneOffset() / 60;
    //                 const tzOffsetStr = ' (' + tzOffset + ')';
    //                 return d.toISOString().slice(0, 19).replace('T', ' ') + tzOffsetStr;
    //             }
    //             return m;
    //         }).join(', ')}</div>}
    //     </div>
    // );
}

export default SchemaToolbar;