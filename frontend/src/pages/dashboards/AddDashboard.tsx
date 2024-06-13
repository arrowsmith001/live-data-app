import { Box, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { DashboardContextProvider, EditingView } from '../../data/DashboardContextProvider';
import { DashboardInfo } from '../../api/model';
import { useDrop } from 'react-dnd';
import ViewConfigurationSidebar from '../../components/ViewConfgurationSidebar';
import { columnStyle, rowStyle } from '../../styles/styles';
import { tokens } from '../../styles/theme';
import NewDashboardEditor from '../../deprecated/NewDashboardEditor';
import EditGrid from '../../dnd-2/EditGrid';

const AddDashboard = () => {


    const gridRef = React.createRef<HTMLDivElement>();

    const colors = tokens(useTheme().palette.mode);

    const [dashboard, setDashboard] = useState<DashboardInfo>({
        id: undefined,
        name: 'New Dashboard',
        streams: [],
        dashboardViews: []
    });

    const [editingView, setEditingView] = useState<EditingView>({viewIndex: undefined, isEditing: false});

    return (
        <DashboardContextProvider 
        dashboard={dashboard} setDashboard={setDashboard} 
        isEditable={true} 
        editingView={editingView} setEditingView={setEditingView} >

            <Box sx={{...rowStyle}}>

                <Box sx={{...columnStyle}}>

                    <Box
                        // ref={drop}
                        sx={{
                            height: '100%',
                            width: '100%'
                        }}>
                        <EditGrid/>
                    </Box>
                </Box>

                <ViewConfigurationSidebar 
                    isCollapsed={!editingView.isEditing}
                    width={200}/>
            </Box>



        </DashboardContextProvider > 
    );

};

export default AddDashboard;