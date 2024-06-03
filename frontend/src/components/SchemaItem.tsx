import { Card } from "@mui/material";
import { SchemaFormat, SchemaType } from "../api/ApiFunctions";


const SchemaItem = ({ label, type }: { label: string, type: SchemaType }) => {

    return (
        <Card sx={{ p: 1, pl: 2, pr: 2, m: 1 }}>
            <h4 style={{ margin: 0 }}>{label}</h4>
            <h5 style={{ margin: 0 }}>{type}</h5>
        </Card>
    )

}

export default SchemaItem;