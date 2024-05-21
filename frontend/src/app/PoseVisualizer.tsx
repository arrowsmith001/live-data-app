import { Box, Paper } from "@mui/material";
import { useDrawingArea } from "@mui/x-charts";
import { useEffect, useState } from "react";


export type Pose = {
    x: number;
    y: number;
    theta: number;
}

// TODO: Pose vis

function PoseVisualizer(props: { pose: Pose | null, minX: number, minY: number, maxX: number, maxY: number }) {
    const { pose } = props;

    const { } = useDrawingArea();

    // use MUI to draw a visualization of the position and heading

    return (
        <Box>
            <Paper>
                <div>
                    {pose && <svg width={200} height={200}>
                        <circle cx={100 + 100 * pose.x} cy={100 - 100 * pose.y} r={5} fill="red" />
                        <line x1={100 + 100 * pose.x} y1={100 - 100 * pose.y} x2={100 + 100 * pose.x + 20 * Math.cos(pose.theta)} y2={100 - 100 * pose.y - 20 * Math.sin(pose.theta)} stroke="black" />
                    </svg>}
                </div>
            </Paper>
        </Box>
    );
}

export default PoseVisualizer;