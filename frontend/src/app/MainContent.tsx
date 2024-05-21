import { ChartContainer, ChartsXAxis, ChartsYAxis, LineChart, LinePlot, ScatterChart, ScatterPlot, ZAxisContextProvider } from "@mui/x-charts";
import { PosePlot, VerticalHighlight } from "./PosePlot";
import React from "react";
import { min } from "date-fns";
import { AxisOptions, Chart } from "react-charts";
import PoseVisualizer from "./PoseVisualizer";
import LineGraph from "./LineGraph";


type MainContentProps = {
    messages: string[];
    error: any;
};

const MainContent = ({ ...props }: MainContentProps) => {

    const svgRef = React.useRef<SVGSVGElement>(null);
    const poseSvgRef = React.useRef<SVGSVGElement>(null);

    const { messages, error } = props;

    return (
        <div>
            {/* <Typography paragraph>
                ${messages?.length ?? '...'}
            </Typography> */}
            {messages && <div>{messages.length}</div>}
            {error && <div>Error: {error.toString()}</div>}

            {/* <LineGraph messages={messages} /> */}

            {/* {messages.length > 0 &&
                <ChartContainer
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
                                    return m[2];
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
                </ChartContainer>
            } */}
            {/* {messages.length > 0 &&
                <PoseVisualizer
                    pose={{ x: messages[messages.length - 1][1], y: messages[messages.length - 1][2], theta: messages[messages.length - 1][1] + messages[messages.length - 1][2] }}
                    minX={-1} minY={-1} maxX={1} maxY={1}
                />
            } */}
        </div >
    );

}


export default MainContent;