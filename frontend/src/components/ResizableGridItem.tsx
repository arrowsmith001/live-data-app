import { Box } from "@mui/material";

export const ResizableGridItem = ({ children, onResize }: { children: React.ReactNode; onResize: (w?: number, h?: number) => void; }) => {

    const handleDiagonalResize = (event: React.MouseEvent<HTMLDivElement>) => {
        const startX = event.clientX;
        const startY = event.clientY;
        const startWidth = event.currentTarget.parentElement?.clientWidth || 0;
        const startHeight = event.currentTarget.parentElement?.clientHeight || 0;

        const handleMouseMove = (event: MouseEvent) => {
            const newWidth = startWidth + event.clientX - startX;
            const newHeight = startHeight + event.clientY - startY;
            onResize(newWidth, newHeight);
        };

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleHorizontalResize = (event: React.MouseEvent<HTMLDivElement>) => {
        const startX = event.clientX;
        const startWidth = event.currentTarget.parentElement?.clientWidth || 0;

        const handleMouseMove = (event: MouseEvent) => {
            const newWidth = startWidth + event.clientX - startX;
            onResize(newWidth, undefined);
        };

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleVerticalResize = (event: React.MouseEvent<HTMLDivElement>) => {
        const startY = event.clientY;
        const startHeight = event.currentTarget.parentElement?.clientHeight || 0;

        const handleMouseMove = (event: MouseEvent) => {
            const newHeight = startHeight + event.clientY - startY;
            onResize(undefined, newHeight);
        };

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.clientX - event.currentTarget.getBoundingClientRect().left <= 10) {
            handleHorizontalResize(event);
        } else if (event.clientY - event.currentTarget.getBoundingClientRect().top <= 10) {
            handleVerticalResize(event);
        } else {
            handleDiagonalResize(event);
        }
    };

    return (
        <Box
            sx={{
                userSelect: 'none',
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
            }}
        >
            <Box
                onMouseDown={handleHorizontalResize}
                sx={{
                    userSelect: 'none',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: '10px',
                    cursor: 'ew-resize',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    zIndex: 1,
                }} />
            <Box
                onMouseDown={handleVerticalResize}
                sx={{
                    userSelect: 'none',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '10px',
                    cursor: 'ns-resize',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    zIndex: 1,
                }} />
            <Box
                onMouseDown={handleDiagonalResize}
                sx={{
                    userSelect: 'none',
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '10px',
                    height: '10px',
                    cursor: 'nwse-resize',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    zIndex: 1,
                }} />
            {children}
        </Box>
    );
};
