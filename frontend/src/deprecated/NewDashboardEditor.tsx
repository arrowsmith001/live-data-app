import { Box } from "@mui/material";
import { CustomDragLayer } from "../dnd/CustomDraggableLayer";
import { DragContainer } from "../dnd/DragContainer";
import React from "react";
import EditGrid from "../dnd-2/EditGrid";


const NewDashboardEditor = () => {
    const ref = React.useRef<HTMLDivElement>(null);
    
    return (
        <Box ref={ref} sx={{overflowY: 'auto', height: '100%'}}>
            
            {/* <DragContainer snapToGrid={true} />
            <CustomDragLayer snapToGrid={true} /> */}

            <EditGrid />
    </Box>
    );
    };

export default NewDashboardEditor;