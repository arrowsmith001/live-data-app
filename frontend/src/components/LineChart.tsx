
import { useTheme } from "@mui/material";
import { tokens } from "../styles/theme";
import { useContext, useEffect, useState } from "react";
import { DashboardContext } from "../data/DashboardContextProvider";
import { DataViewTypeInputs, SchemaInfo } from "../api/model";
import { LineChart as LC, Line, ResponsiveContainer, XAxis } from "recharts";
import { Chart} from 'chart.js';


const LineChart = ({ connectionId, schemaId, args }: { connectionId?: number, schemaId?: number, args: any[] }) => {

    const colors = tokens(useTheme().palette.mode);
    const { getData } = useContext(DashboardContext);
    const data = getData(connectionId, schemaId).map((d, i) => ({ 'x': d[args[0]], 'y': d[args[1]]})) || [];

    const validateArgs = () => {
        let err = '';
        DataViewTypeInputs.line.forEach((input, i) => {
            if (args[i] === undefined || null) {
                if (err === '') err = `Missing input(s): ` + input.label;
                else err += `, ` + input.label;
            }
        });
        return err === '' ? null : err;
    }

    const error = validateArgs();


    return (
        error ? <div>{error}</div> :

      <ResponsiveContainer width="100%" height="100%">
      <LC data={data}>

        <XAxis dataKey="x" />
      <Line  type="step" dataKey="y" stroke="#8884d8" />
    </LC>
        </ResponsiveContainer>
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

export default LineChart;