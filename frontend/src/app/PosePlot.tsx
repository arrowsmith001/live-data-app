import * as React from 'react';
import { ScaleLinear } from 'd3-scale';
import { styled } from '@mui/material/styles';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { LinePlot } from '@mui/x-charts/LineChart';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { useDrawingArea, useYScale } from '@mui/x-charts/hooks';
import { useSeries } from '@mui/x-charts/hooks/useSeries';

const StyledPath = styled('path')(({ theme }) => ({
    fill: 'none',
    stroke: theme.palette.text.primary,
    shapeRendering: 'crispEdges',
    strokeWidth: 1,
    pointerEvents: 'none',
    strokeDasharray: '5 2',
}));

const StyledText = styled('text')(({ theme }) => ({
    stroke: 'none',
    fill: theme.palette.text.primary,
    shapeRendering: 'crispEdges',
}));

export function VerticalHighlight(props: { svgRef: React.RefObject<SVGSVGElement> }) {
    const { svgRef } = props;

    // Get the drawing area bounding box
    const { left, top, width, height } = useDrawingArea();

    // Get the two scale
    const axisScale = useYScale('data') as ScaleLinear<any, any>;

    const [mousePosition, setMousePosition] = React.useState<null | { x: number; y: number }>(null);

    React.useEffect(() => {
        const element = svgRef.current;
        if (element === null) {
            return () => { };
        }

        const handleMouseOut = () => {
            setMousePosition(null);
        };

        const handleMouseMove = (event: MouseEvent) => {
            const x = event.offsetX;
            const y = event.offsetY;

            const isInXBounds = x >= left && x <= left + width;
            const isInYBounds = y >= top && y <= top + height;

            const xClamped = Math.max(Math.min(left + width, x), left);
            const yClamped = Math.max(Math.min(top + height, y), top);

            if (isInXBounds && isInYBounds) {
                setMousePosition({ x: xClamped, y: yClamped });
            } else {
                setMousePosition(null);
            }
        };

        element.addEventListener('mouseout', handleMouseOut);
        element.addEventListener('mousemove', handleMouseMove);
        return () => {
            element.removeEventListener('mouseout', handleMouseOut);
            element.removeEventListener('mousemove', handleMouseMove);
        };
    }, [height, left, top, width, svgRef]);

    if (mousePosition === null) {
        return null;
    }

    const { x: mouseX, y: mouseY } = mousePosition;

    // return <div></div>

    return (
        <React.Fragment>
            <StyledPath d={`M ${mouseX} ${top} ${mouseX} ${top + height} 0`} />
            <StyledText
                x={left + 5}
                y={mouseY}
                textAnchor="start"
                dominantBaseline="text-after-edge"
            >
                {axisScale.invert(mouseY).toFixed(0)}
            </StyledText>

            <StyledText
                x={left + width - 5}
                y={mouseY}
                textAnchor="end"
                dominantBaseline="text-after-edge"
            >
                {axisScale.invert(mouseY).toFixed(0)}
            </StyledText>
        </React.Fragment>
    );
}


export function VectorHighlight(props: { svgRef: React.RefObject<SVGSVGElement> }) {
    const { svgRef } = props;

    // Get the drawing area bounding box
    const { left, top, width, height } = useDrawingArea();

    // Get the two scale
    const axisScale = useYScale('data') as ScaleLinear<any, any>;

    const [mousePosition, setMousePosition] = React.useState<null | { x: number; y: number }>(null);

    React.useEffect(() => {
        const element = svgRef.current;
        if (element === null) {
            return () => { };
        }

        const handleMouseOut = () => {
            setMousePosition(null);
        };

        const handleMouseMove = (event: MouseEvent) => {
            const x = event.offsetX;
            const y = event.offsetY;

            const isInXBounds = x >= left && x <= left + width;
            const isInYBounds = y >= top && y <= top + height;

            const xClamped = Math.max(Math.min(left + width, x), left);
            const yClamped = Math.max(Math.min(top + height, y), top);

            if (isInXBounds && isInYBounds) {
                setMousePosition({ x: xClamped, y: yClamped });
            } else {
                setMousePosition(null);
            }
        };

        element.addEventListener('mouseout', handleMouseOut);
        element.addEventListener('mousemove', handleMouseMove);
        return () => {
            element.removeEventListener('mouseout', handleMouseOut);
            element.removeEventListener('mousemove', handleMouseMove);
        };
    }, [height, left, top, width, svgRef]);

    if (mousePosition === null) {
        return null;
    }

    const { x: mouseX, y: mouseY } = mousePosition;

    // return <div></div>

    return (
        <React.Fragment>
            <StyledPath d={`M ${mouseX} ${top} ${mouseX} ${top + height} 0`} />
            <StyledText
                x={left + 5}
                y={mouseY}
                textAnchor="start"
                dominantBaseline="text-after-edge"
            >
                {axisScale.invert(mouseY).toFixed(0)}
            </StyledText>

            <StyledText
                x={left + width - 5}
                y={mouseY}
                textAnchor="end"
                dominantBaseline="text-after-edge"
            >
                {axisScale.invert(mouseY).toFixed(0)}
            </StyledText>
        </React.Fragment>
    );
}


export function PosePlot(props: { svgRef: React.RefObject<SVGSVGElement> }) {
    const { svgRef } = props;

    const { left, top, width, height } = useDrawingArea();


    // Get the two scale
    const axisScale = useYScale('data') as ScaleLinear<any, any>;


    const [mousePosition, setMousePosition] = React.useState<null | { x: number; y: number }>(null);

    React.useEffect(() => {
        const element = svgRef.current;
        if (element === null) {
            return () => { };
        }

        const handleMouseOut = () => {
            setMousePosition(null);
        };

        const handleMouseMove = (event: MouseEvent) => {
            const x = event.offsetX;
            const y = event.offsetY;

            const isInXBounds = x >= left && x <= left + width;
            const isInYBounds = y >= top && y <= top + height;

            const xClamped = Math.max(Math.min(left + width, x), left);
            const yClamped = Math.max(Math.min(top + height, y), top);

            if (isInXBounds && isInYBounds) {
                setMousePosition({ x: xClamped, y: yClamped });
            } else {
                setMousePosition(null);
            }
        };

        element.addEventListener('mouseout', handleMouseOut);
        element.addEventListener('mousemove', handleMouseMove);
        return () => {
            element.removeEventListener('mouseout', handleMouseOut);
            element.removeEventListener('mousemove', handleMouseMove);
        };
    }, [height, left, top, width, svgRef]);

    if (mousePosition === null) {
        return null;
    }

    const { x: mouseX, y: mouseY } = mousePosition;

    // return <div></div>

    return (
        <React.Fragment>
            <StyledPath d={`M ${mouseX} ${top} ${mouseX} ${top + height} 0`} />
            <StyledText
                x={left + 5}
                y={mouseY}
                textAnchor="start"
                dominantBaseline="text-after-edge"
            >
                {axisScale.invert(mouseY).toFixed(0)}
            </StyledText>

            <StyledText
                x={left + width - 5}
                y={mouseY}
                textAnchor="end"
                dominantBaseline="text-after-edge"
            >
                {axisScale.invert(mouseY).toFixed(0)}
            </StyledText>
        </React.Fragment>
    );

}

function ScaleDemo() {
    const svgRef = React.useRef<SVGSVGElement>(null);
    return (
        <ResponsiveChartContainer
            ref={svgRef}
            margin={{ top: 20, left: 50, right: 50, bottom: 30 }}
            height={300}
            xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], scaleType: 'point' }]}
            yAxis={[
                {
                    id: 'left_axis_id',
                },
                {
                    id: 'right_axis_id',
                },
            ]}
            series={[
                {
                    type: 'line',
                    data: [5, 15, 20, 24, 30, 38, 40, 51, 52, 61],
                    yAxisKey: 'left_axis_id',
                },
                {
                    type: 'line',
                    data: [
                        50134, 48361, 46362, 44826, 42376, 40168, 38264, 36159, 34259, 32168,
                    ],
                    yAxisKey: 'right_axis_id',
                },
            ]}
        >
            <LinePlot />
            <ChartsYAxis position="left" axisId="left_axis_id" />
            <ChartsYAxis position="right" axisId="right_axis_id" />
            <VerticalHighlight svgRef={svgRef} />
        </ResponsiveChartContainer>
    );
}
