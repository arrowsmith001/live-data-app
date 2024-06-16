
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../styles/theme";
import { useContext, useEffect, useState } from "react";
import { DashboardContext } from "../../data/DashboardContextProvider";
import { DataViewTypeInputs, SchemaInfo } from "../../api/model";
import { CartesianGrid, LineChart as LC, Line, ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis, ZAxis } from "recharts";
import { Chart} from 'chart.js';
import { SingleStreamContext } from "../../data/SingleStreamContext";
import { DataViewError } from "./DataViewError";
import { getDashboards } from "../../api/ApiFunctions";
import { getDataConfigError } from "../../utils/utils";
import { DataViewProps } from "./DataView";
import { DataStreamContext } from "../../data/DataStreamContext";
import { DashboardEditContext } from "../../data/DashboardEditContextProvider";
import { DataViewContext } from "../../data/DataViewContext";
import { DataContext } from "../../data/DataContextProvider";


const PoseView = () => {

    const colors = tokens(useTheme().palette.mode);

    const {schemas} = useContext(DataContext);
    const { getLatestData } = useContext(DataStreamContext);
    
    const { view } = useContext(DataViewContext);

    const inputMapping = view?.config.inputMapping ?? {};
    const connectionId = view?.config.connectionId;

    const schemaId = view?.config.schemaId;
    const schema = schemas.get(schemaId);

    const data = getLatestData(connectionId, schemaId);

    const latest = data ? { 'x': data[inputMapping[0]], 'y': data[inputMapping[1]], 'theta': data[inputMapping[2]] } : null;

    const xLabel = schema ? schema.labels[inputMapping[0]] : '-';
    const yLabel = schema ? schema.labels[inputMapping[1]] : '-';
    const zLabel = schema ? schema.labels[inputMapping[2]] : '-';
// const testData = [
//     { 'x': 0, 'y': d[args[1]], 'theta': d[args[2]] } ]



    return (
        <Box p={2} width="100%" height="100%">
        <Typography maxWidth={'100%'} p={1} sx={{backgroundColor: undefined}} variant="h5" fontWeight={800} color="textPrimary">{xLabel}-{yLabel}-{zLabel} plot</Typography>
      <ResponsiveContainer width="100%" height="100%">
      <ScatterChart >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis label={xLabel} name={xLabel} dataKey="x" type="number" domain={[-1, 1]}   />
        <YAxis  label={yLabel} name={yLabel} dataKey="y" type="number" domain={[-1, 1]}  />
        <ZAxis dataKey="theta" range={[0, 200]} type='number' name="theta" />
        <Scatter data={[latest]}  fill="white" />
  
    </ScatterChart>
        </ResponsiveContainer>
        </Box>
    );



    // const nivoChart = (
    //     <ResponsiveLineCanvas
    //     isInteractive={false}
    //         data={[
    //             {
    //                 id: '1',
    //                 data: getData(connectionId, schemaId).map((d, i) => ({ x: d[args[0]], y: d[args[1]] })) || []
    //             }
    //         ]}
    //         theme={{
    //             axis: {
    //                 domain: {
    //                     line: {
    //                         stroke: colors.grey[100],
    //                     },
    //                 },
    //                 legend: {
    //                     text: {
    //                         fill: colors.grey[100],
    //                     },
    //                 },
    //                 ticks: {
    //                     line: {
    //                         stroke: colors.grey[100],
    //                         strokeWidth: 1,
    //                     },
    //                     text: {
    //                         fill: colors.grey[100],
    //                     },
    //                 },
    //             },
    //             legends: {
    //                 text: {
    //                     fill: colors.grey[100],
    //                 },
    //             },
    //             tooltip: {
    //                 container: {
    //                     color: colors.primary[500],
    //                 },
    //             },
    //         }}

    //         colors={{ scheme: "nivo" }} // { datum: "color" }
    //         margin={{ top: 15, right: 15, bottom: 15, left: 30 }}
    //         xScale={{ type: "point" }}
    //         yScale={{
    //             type: "linear",
    //             min: "auto",
    //             max: "auto",
    //             stacked: true,
    //             reverse: false,
    //         }}
    //         yFormat=" >-.2f"
    //         axisTop={null}
    //         axisRight={null}
    //         // axisBottom={{
    //         //     format: (value) => new Date(value * 1000).toLocaleTimeString(),
    //         //     tickSize: 5,
    //         //     tickPadding: 0,
    //         //     renderTick: (props) => <></>,

    //         //     tickRotation: 0,
    //         //     legend: undefined, // added
    //         //     legendOffset: 36,
    //         //     legendPosition: "middle",
    //         // }}
    //         // axisLeft={{
    //         //     tickValues: 5, // added
    //         //     tickSize: 3,
    //         //     tickPadding: 5,
    //         //     tickRotation: 0,
    //         //     legend: undefined, // added
    //         //     legendOffset: -40,
    //         //     legendPosition: "middle",
    //         // }}
    //         enableGridX={false}
    //         enableGridY={false}
    //         pointSize={0}
    //         pointColor={{ theme: "background" }}
    //         pointBorderWidth={2}
    //         pointBorderColor={{ from: "serieColor" }}
    //         // pointLabelYOffset={-12}
    //         // useMesh={true}
    //     // legends={[
    //     //     {
    //     //         anchor: "bottom-right",
    //     //         direction: "column",
    //     //         justify: false,
    //     //         translateX: 100,
    //     //         translateY: 0,
    //     //         itemsSpacing: 0,
    //     //         itemDirection: "left-to-right",
    //     //         itemWidth: 80,
    //     //         itemHeight: 20,
    //     //         itemOpacity: 0.75,
    //     //         symbolSize: 12,
    //     //         symbolShape: "circle",
    //     //         symbolBorderColor: "rgba(0, 0, 0, .5)",
    //     //         effects: [
    //     //             {
    //     //                 on: "hover",
    //     //                 style: {
    //     //                     itemBackground: "rgba(0, 0, 0, .03)",
    //     //                     itemOpacity: 1,
    //     //                 },
    //     //             },
    //     //         ],
    //     //     },
    //     // ]}
    //     />
    // );
};

export default PoseView;