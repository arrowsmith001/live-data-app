import React, { useState } from 'react';
import { WidthProvider, Responsive } from 'react-grid-layout';
import { DraggableBox } from '../dnd/DraggableBox';
import { Box, Card, Fab, IconButton, Paper, Typography, colors } from '@mui/material';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { DataView } from '../app/DataView';
import Display from '../components/Display';
import PoseView from '../components/PoseView';
import LineChart from '../components/LineChart';
import { useColors } from '../styles/styles';
import { DragHandle } from '@mui/icons-material';

const ResponsiveGridLayout = WidthProvider(Responsive);

const adaptive = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };


const EditGrid = () => {

    const colors = useColors();


    const [layout, setLayout] = React.useState([
        { i: '0', x: 0, y: 0, w: 1, h: 2 },
        { i: '1', x: 1, y: 0, w: 3, h: 2 },
        { i: '2', x: 4, y: 0, w: 1, h: 2 }
    ]);

    // const [views, setViews] = useState<{ [key: string]: any }>({
    //     '0': { type: 'line', connectionId: '1', schemaId: '1', args: [] },
    //     '1': { type: 'display', connectionId: '1', schemaId: '1', args: [] },
    //     '2': { type: 'pose', connectionId: '1', schemaId: '1', args: [] }
    // });

    const [views, setViews] = useState([
        { type: 'line', connectionId: 1, schemaId: 1, args: [] },
        { type: 'display', connectionId: 1, schemaId: 1, args: [] },
        { type: 'pose', connectionId: 1, schemaId: 1, args: [] }
    ]
    );


    const onDrop = (layout: any, layoutItem: any, e: any) => {
        const type = e.dataTransfer.getData('text');
        console.log('Type: ' + type);
        console.log('onDrop Layout: ' + JSON.stringify(layout));
        console.log('onDrop LayoutItem: ' + JSON.stringify(layoutItem));
        setViews((prev) => { 
            const key = layout.length.toString();
            return [...prev, { type, connectionId: 1, schemaId: 1, args: [] }];
         });
        setLayout(layout);
    };

    const br = '4px';
    return (
        <ResponsiveGridLayout
            className="layout"
            layouts={{
                lg: layout,
                md: layout,
                sm: layout,
                xs: layout,
                xxs: layout
            }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
            isDraggable={true}
            isResizable={true}
            droppingItem={{ i: layout.length.toString(), w: 2, h: 2 }}
            draggableHandle=".dragHandle"
            resizeHandles={['s', 'w', 'e', 'sw', 'se']}
            useCSSTransforms={true}
            isDroppable={true} 
            onDrop={onDrop}
            onLayoutChange={(layout, layouts) => {
                console.log('onLayoutChange: ' + JSON.stringify(layout));
                setLayout(layout);
            }}
            preventCollision={false}
            // verticalCompact={true} //?
            //autoSize={false} //?
        >
            {layout.map((item) => {
                const view = views[parseInt(item.i)];
                if(!view) return <></>;
                return <Paper key={item.i} sx={{ backgroundColor: colors.primary[400], borderRadius: br,
                color: colors.grey[100], padding: 2, height: '100%' }}>
                    <IconButton className='dragHandle' 
                    sx={{position: 'absolute', 
                    borderTopLeftRadius: br, borderTopRightRadius: br, 
                    borderBottomLeftRadius: 0, borderBottomRightRadius: 0, 
                    top: 0, right: 0, width: '100%', height: '18px', backgroundColor: colors.primary[400], color: colors.primary[200]}}>
                        <DragHandle/>
                    </IconButton>
                    {/* <Paper className='dragHandle' sx={{position: 'absolute', top: 0, height: '16px', width: '100%', color: colors.primary[200]}}></Paper> */}
                {view.type === 'line' && <LineChart connectionId={view.connectionId} schemaId={view.schemaId} args={view.args} />}
                {view.type === 'display' && <Display connectionId={view.connectionId} schemaId={view.schemaId} args={view.args} />}
                {view.type === 'pose' && <PoseView connectionId={view.connectionId} schemaId={view.schemaId} args={view.args} />}
                </Paper>;
            })}
        </ResponsiveGridLayout>
    );
}


export default EditGrid;