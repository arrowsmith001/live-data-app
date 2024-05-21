import { ChartContainer, ChartsXAxis, ChartsYAxis, LinePlot } from "@mui/x-charts";
import { VerticalHighlight } from "./PosePlot";
import React from "react";


const LineGraph = ({ ...props }: { messages: any[][] }) => {

    const svgRef = React.useRef<SVGSVGElement>(null);
    const { messages } = props;

    return <ChartContainer
        ref={svgRef}
        width={600}
        height={300}
        margin={{ top: 5, right: 30, left: 25, bottom: 5 }}
        xAxis={[
            {
                id: 'time',
                data: messages?.map(m => {
                    return (m[0] as Date).getTime();
                }),
            }
        ]}
        yAxis={
            [
                {
                    id: 'data'
                }
            ]}
        series={
            [
                {
                    type: 'line',
                    data: messages?.map(m => {
                        return m[1];
                    }),
                    yAxisKey: 'data',
                }
            ]
        }
    >
        <LinePlot />
        <ChartsXAxis position="bottom" axisId="time" />
        <ChartsYAxis position="left" axisId="data" />
        <VerticalHighlight svgRef={svgRef} />
    </ChartContainer>;
}

export default LineGraph;