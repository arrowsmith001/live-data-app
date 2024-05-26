import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../styles/theme";
import { useDataArray } from "../data/useServer";

const LineChart = ({ isCustomLineColors = false, isDashboard = false }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const data = useDataArray();

    // limit data to 100 items

    // console.log(indices);

    if (data.length > 0) console.log(data[data.length - 1].server_timestamp);

    const plotData = [{
        id: "Robot 1",
        color: tokens("dark").greenAccent[500],
        data: data.map((d) => {
            return {
                x: d.server_timestamp,
                y: parseFloat(d.data.split(" ")[1]),
            };
        }),
    }];

    const renderTick = (props: any) => {
        const { x, y, format, value } = props;

        if (props.tickIndex === 0) return (
            <g style={{ width: '500px' }}>
                <g transform={`translate(${x},${y})`}>
                    <text
                        x={0}
                        y={0}
                        dy={16}
                        textAnchor="start"
                        fill={colors.grey[100]}
                        fontSize={12}
                    >
                        {format!(data[0].server_timestamp)}
                    </text>
                </g>
                <g>
                    <text
                        x={0}
                        y={0}
                        dy={16}
                        textAnchor="end"
                        fill={colors.grey[100]}
                        fontSize={12}
                    >

                        {format!(data[data.length - 1].server_timestamp)}
                    </text>
                </g>
            </g>
        );
        return <></>;
    };
    return (
        <ResponsiveLine

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
            colors={isDashboard ? { datum: "color" } : { scheme: "nivo" }} // added
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
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
                format: (value) => value == data[0].server_timestamp || value == data[data.length - 1].server_timestamp ? new Date(value * 1000).toLocaleTimeString() : "",
                tickSize: 10,
                tickPadding: 5,
                // renderTick: renderTick,

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
            pointSize={0}
            // pointColor={{ theme: "background" }}
            // pointBorderWidth={2}
            // pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
                {
                    anchor: "bottom-right",
                    direction: "column",
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: "left-to-right",
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: "circle",
                    symbolBorderColor: "rgba(0, 0, 0, .5)",
                    effects: [
                        {
                            on: "hover",
                            style: {
                                itemBackground: "rgba(0, 0, 0, .03)",
                                itemOpacity: 1,
                            },
                        },
                    ],
                },
            ]}
        />
    );
};

export default LineChart;