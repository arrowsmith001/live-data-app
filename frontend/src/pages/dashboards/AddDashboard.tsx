import { Box, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { DashboardContextProvider } from '../../data/DashboardContextProvider';
import { DashboardInfo } from '../../api/model';
import { useDrop } from 'react-dnd';
import ViewConfigurationSidebar from '../../components/ViewConfigurationSidebar';
import { columnStyle, rowStyle } from '../../styles/styles';
import { tokens } from '../../styles/theme';
import NewDashboardEditor from '../../deprecated/NewDashboardEditor';
import EditGrid from '../../dnd-2/EditGrid';
import { DashboardEditContextProvider } from '../../data/DashboardEditContextProvider';

const AddDashboard = () => {


    const gridRef = React.createRef<HTMLDivElement>();

    const colors = tokens(useTheme().palette.mode);

    const [dashboard, setDashboard] = useState<DashboardInfo>({
        id: undefined,
        name: 'New Dashboard',
        streams: [],
        dashboardViews: []
    });


    return (
    
            <Box sx={{...rowStyle}}>

        <DashboardEditContextProvider>
                {/* <Box sx={{...columnStyle}}>

                </Box> */}

                   
                <Box
                        // ref={drop}
                        sx={{
                            height: '100%',
                            width: '100%'
                        }}>
                        <EditGrid/>
                    </Box>
                <ViewConfigurationSidebar 
                    width={200}/>
        </DashboardEditContextProvider > 
            </Box>

    );

};

export default AddDashboard;