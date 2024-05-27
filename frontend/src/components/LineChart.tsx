import { Line, ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../styles/theme";
import { useDataArray } from "../data/useServer";
import { ServerDataItem } from "../data/WebSocketContext";

const LineChart = ({ xSelect, dataSelect }: { xSelect: (sdi: ServerDataItem) => number, dataSelect: ((s: string) => number)[] }) => {


    const isDashboard = true;


    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const data = useDataArray();

    // limit data to 100 items

    // console.log(indices);

    //if (data.length > 0) console.log(data[data.length - 1].server_timestamp);


    const plotData = dataSelect.map((sd) => ({
        id: "Robot " + sd.toString(),
        color: tokens("dark").greenAccent[500],
        data: data.map((d) => {
            return {
                x: xSelect(d),
                y: sd(d.data)
            };
        })
    }));

    const renderTick = (props: any) => {
        const { x, y, format, value } = props;

        if (props.tickIndex === 0 || props.tickIndex >= data.length - 1) return (
            <g style={{ width: '500px' }}>
                <g transform={`translate(${x},${y})`}>
                    <text
                        x={0}
                        y={0}
                        dy={16}
                        textAnchor="center"
                        fill={colors.grey[100]}
                        fontSize={12}
                    >
                        {format!(data[0].server_timestamp)}
                    </text>
                </g>
            </g>
        );
        return <></>;
    };

    return (
        <ResponsiveLine
            animate={false}
            data={plotData}
            theme={{
                axis: {
                    domain: {
                        line: {
                            stroke: colors.grey[100],
                        },
                    },
                    legend: {
                        text: {
                            fill: colors.grey[100],
                        },
                    },
                    ticks: {
                        line: {
                            stroke: colors.grey[100],
                            strokeWidth: 1,
                        },
                        text: {
                            fill: colors.grey[100],
                        },
                    },
                },
                legends: {
                    text: {
                        fill: colors.grey[100],
                    },
                },
                tooltip: {
                    container: {
                        color: colors.primary[500],
                    },
                },
            }}

            colors={{ scheme: "nivo" }} // { datum: "color" }
            margin={{ top: 15, right: 15, bottom: 15, left: 30 }}
            xScale={{ type: "point" }}
            yScale={{
                type: "linear",
                min: "auto",
                max: "auto",
                stacked: true,
                reverse: false,
            }}
            yFormat=" >-.2f"
            axisTop={null}
            axisRight={null}
            axisBottom={{
                format: (value) => new Date(value * 1000).toLocaleTimeString(),
                tickSize: 5,
                tickPadding: 0,
                renderTick: (props) => <></>,

                tickRotation: 0,
                legend: isDashboard ? undefined : "transportation", // added
                legendOffset: 36,
                legendPosition: "middle",
            }}
            axisLeft={{
                tickValues: 5, // added
                tickSize: 3,
                tickPadding: 5,
                tickRotation: 0,
                legend: isDashboard ? undefined : "count", // added
                legendOffset: -40,
                legendPosition: "middle",
            }}
            enableGridX={false}
            enableGridY={false}
            pointSize={3}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
        // legends={[
        //     {
        //         anchor: "bottom-right",
        //         direction: "column",
        //         justify: false,
        //         translateX: 100,
        //         translateY: 0,
        //         itemsSpacing: 0,
        //         itemDirection: "left-to-right",
        //         itemWidth: 80,
        //         itemHeight: 20,
        //         itemOpacity: 0.75,
        //         symbolSize: 12,
        //         symbolShape: "circle",
        //         symbolBorderColor: "rgba(0, 0, 0, .5)",
        //         effects: [
        //             {
        //                 on: "hover",
        //                 style: {
        //                     itemBackground: "rgba(0, 0, 0, .03)",
        //                     itemOpacity: 1,
        //                 },
        //             },
        //         ],
        //     },
        // ]}
        />
    );
};

export default LineChart;