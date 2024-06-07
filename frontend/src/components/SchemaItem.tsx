import { Card } from "@mui/material";
import { SchemaInfo, DataType } from "../api/model";
import { useContext } from "react";
import { DashboardContext } from "../data/DashboardContextProvider";


const SchemaItem = ({ schema, index, withConnection} : {schema : SchemaInfo, index: number, withConnection?: number}) => {

const { getLatestData } = useContext(DashboardContext);

const data = getLatestData(schema.id, withConnection);

    return (
        <Card sx={{ p: 1, pl: 2, pr: 2, m: 1 }}>
            <h4 style={{ margin: 0 }}>{schema.labels[index]}</h4>
            <h5 style={{ margin: 0 }}>{schema.types[index]}</h5>
            {data && <p>{data[index]}</p>}
        </Card>
    )

}

export default SchemaItem;