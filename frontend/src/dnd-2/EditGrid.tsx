import React, { useContext, useEffect, useRef } from 'react';
import { WidthProvider, Responsive, Layout } from 'react-grid-layout';
import { Box } from '@mui/material';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { useColors } from '../styles/styles';
import { Dashboard, DashboardEditContext, DashboardView } from '../data/DashboardEditContextProvider';
import { DataView } from '../components/dataview/DataView';
import { DataViewContextProvider } from '../data/DataViewContext';

const ResponsiveGridLayout = WidthProvider(Responsive);

const adaptive = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };


const EditGrid = () => {


    const colors = useColors();

    const { 
        setSelectedView, selectedView, 
        setLayouts, getLayouts, 
        setWorkingDashboard, workingDashboard
    } = useContext(DashboardEditContext);


    const onDrop = (layout: any, layoutItem: any, e: any) => {
        const type = e.dataTransfer.getData('text');
        // console.log('Type: ' + type);
        // console.log('onDrop Layout: ' + JSON.stringify(layout));
        // console.log('onDrop LayoutItem: ' + JSON.stringify(layoutItem));

        setWorkingDashboard((prev) => { 
            // setSelectedView(prev.length);
            return {views: {...prev.views, 
                [layoutItem.i]: {
                config: {type, connectionId: undefined, schemaId: undefined, inputMapping: {}},
                layout: {...layoutItem, isDraggable: undefined} as Layout
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
            rowHeight={90}
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
                // console.log('onLayoutChange: ' + JSON.stringify(layout));
                // console.log('onLayout(s)Change: ' + JSON.stringify(layouts));
                setLayouts(layout);
            }}
            preventCollision={false}
            // verticalCompact={false} //?
            //autoSize={false} //?
        >
            {Object.entries(workingDashboard.views).map(([id, view] : [string, DashboardView]) => {

                if(!view.layout) return <></>;

                return <Box key={id} >
                    <DataViewContextProvider view={view}>

                   <DataView
                    />
                    </DataViewContextProvider>
                   
                </Box >;
            })}
        </ResponsiveGridLayout>
        </div>
    );
}


export default EditGrid;