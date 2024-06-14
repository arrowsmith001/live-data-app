import React, { useContext, useEffect, useRef, useState } from 'react';
import { WidthProvider, Responsive, Layout } from 'react-grid-layout';
import { DraggableBox } from '../dnd/DraggableBox';
import { Box, Card, Fab, IconButton, Paper, Typography, colors } from '@mui/material';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import Display from '../components/Display';
import PoseView from '../components/PoseView';
import LineChart from '../components/LineChart';
import { useColors } from '../styles/styles';
import { DragHandle, SchemaOutlined, Settings } from '@mui/icons-material';
import { Dashboard, DashboardEditContext } from '../data/DashboardEditContextProvider';
import { set } from 'date-fns';
import { DataStreamContextProvider } from '../data/DataStreamContext';
import { Stream } from '../data/model';
import { SingleStreamContextProvider } from '../data/SingleStreamContext';
import PositionView from '../components/PositionView';

const ResponsiveGridLayout = WidthProvider(Responsive);

const adaptive = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };


const EditGrid = () => {


    const colors = useColors();

    const { 
        setSelectedView, selectedView, 
        setLayout, getLayouts, 
        setWorkingDashboard, workingDashboard 
    } = useContext(DashboardEditContext);


    const onDrop = (layout: any, layoutItem: any, e: any) => {
        const type = e.dataTransfer.getData('text');
        console.log('Type: ' + type);
        console.log('onDrop Layout: ' + JSON.stringify(layout));
        console.log('onDrop LayoutItem: ' + JSON.stringify(layoutItem));

        setWorkingDashboard((prev) => { 
            // setSelectedView(prev.length);
            return {views: {...prev.views, 
                [layoutItem.i]: {
                config: {type, connectionId: undefined, schemaId: undefined, inputMapping: {}},
                layout: {...layoutItem} as Layout
            }}} as Dashboard;
         });
    };


    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            console.log(event.target);

            if (containerRef.current) {

                if (event.target instanceof Element) {
                    if (event.target.classList.contains('react-grid-layout') || event.target.classList.contains('grid-container')) {
                        setSelectedView((prev) => ({...prev, isEditing: false}));
                    }
                }

            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // TODO: Have views not go back to their original positions

    const br = '4px';
    return (
        <div className="grid-container" ref={containerRef} style={{ height: '100%', width: '100%' }}>
            <ResponsiveGridLayout
            className="layout"
                layouts={getLayouts()}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
            isDraggable={true}
            isResizable={true}
            droppingItem={{ i: Object.keys(workingDashboard.views).length.toString(), w: 2, h: 2 }}
            draggableHandle=".dragHandle"
            resizeHandles={['s', 'w', 'e', 'sw', 'se']}
            useCSSTransforms={true}
            isDroppable={true} 
            onDrop={onDrop}
            onLayoutChange={(layout, layouts) => {
                console.log('onLayoutChange: ' + JSON.stringify(layout));
                console.log('onLayout(s)Change: ' + JSON.stringify(layouts));
                const i = layout[layout.length - 1].i;
                console.log('i: ' + i);
                // setLayout(i, layout[0]);
            }}
            preventCollision={false}
            // verticalCompact={false} //?
            //autoSize={false} //?
        >
            {Object.entries(workingDashboard.views).map(([id, viewConfig]) => {

                const {config : view, layout} = viewConfig;
                const isSelected = selectedView.isEditing &&  selectedView.id === parseInt(id);
                if(!layout) return <></>;
                return <Paper onClick={(e) => setSelectedView((prev) => {
                    return {isEditing: !prev.isEditing, id: parseInt(id)}
                })} key={id} sx={{ backgroundColor: colors.primary[isSelected ? 500 : 400], borderRadius: br,
                color: colors.grey[100], padding: 2, height: '100%' }}>
                    <IconButton className='dragHandle' 
                    sx={{position: 'absolute', 
                    borderTopLeftRadius: br, borderTopRightRadius: br, 
                    borderBottomLeftRadius: 0, borderBottomRightRadius: 0, 
                    top: 0, right: 0, width: '100%', height: '18px', backgroundColor: colors.primary[400], color: colors.primary[200]}}>
                        <DragHandle/>
                    </IconButton>
                    {/* <IconButton onClick={(e) => setSelectedView(parseInt(item.i))}>
                        <Settings/>
                    </IconButton> */}
                    {/* <Paper className='dragHandle' sx={{position: 'absolute', top: 0, height: '16px', width: '100%', color: colors.primary[200]}}></Paper> */}
                    <SingleStreamContextProvider connectionId={view.connectionId} schemaId={view.schemaId} inputMapping={view.inputMapping} >
                        {view.type === 'line' && <LineChart />}
                        {view.type === 'display' && <Display />}
                        {view.type === 'position' && <PositionView />}
                        {view.type === 'pose' && <PoseView />}
                    </SingleStreamContextProvider>
                </Paper>;
            })}
        </ResponsiveGridLayout>
        </div>
    );
}


export default EditGrid;