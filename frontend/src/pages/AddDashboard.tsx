import { Box, Button, Card, Container, IconButton, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { tokens } from '../styles/theme';
import DataSelector from '../components/DataSelector';
import { DashboardContextProvider, EditingView } from '../data/DashboardContextProvider';
import DashboardGrid from '../app/DashboardGrid';
import { DashboardInfo } from '../api/model';
import { Add } from '@mui/icons-material';
import AddViewButton from '../components/AddViewButton';
import AddDataViewPanel from '../components/AddDataViewPanel';
import { useDrop } from 'react-dnd';
import EditViewPanel from '../components/EditViewPanel';
import { Transition } from 'react-transition-group';
import { rgba } from 'polished';
import Sidebar from '../app/Sidebar';
import ViewConfigurationSidebar from '../components/ViewConfgurationSidebar';
import { columnStyle, rowStyle } from '../styles/styles';

const AddDashboard = () => {


    const gridRef = React.createRef<HTMLDivElement>();

    const [collectedProps, drop] = useDrop(() => ({
        accept: 'ADD_DATA_VIEW',
        drop: (item: any) => {
            console.log('Dropped', item);
        },
        hover: (item: any) => {
            console.log('Hovering', item);
            //determine if gridRef.current is hovered
            if(gridRef.current === null) return;
            const rect = gridRef.current.getBoundingClientRect();

            console.log(rect);

        }
      }));

    const colors = tokens(useTheme().palette.mode);

    const [dashboard, setDashboard] = useState<DashboardInfo>({
        id: undefined,
        name: 'New Dashboard',
        streams: [],
        dashboardViews: []
    });

    const [isEditable, setIsEditable] = useState(true);
    const [editingView, setEditingView] = useState<EditingView>({viewIndex: undefined, isEditing: false});

    return (
        <DashboardContextProvider 
        dashboard={dashboard} setDashboard={setDashboard} 
        isEditable={isEditable} 
        editingView={editingView} setEditingView={setEditingView} >

            <Box sx={{...rowStyle}}>

                {/* <Box
                    zIndex={1}
                    sx={{
                        height: 'calc(100% - 200px)'
                    } }>         

                    <Transition in={!editingView.isEditing} timeout={100} mountOnEnter unmountOnExit>
                        {(state) => {

                            return (
                                <Box
                                    position={'fixed'}
                                    right={0}
                                    bottom={100}
                                    zIndex={1}
                                    sx={{
                                        backgroundColor: rgba(colors.primary[400], 0.5),
                                        height: 'calc(100% - 200px)',
                                        transition: 'transform 0.1s ease-in-out',
                                        transform: state === 'entered' ? 'translateX(0)' : 'translateX(100%)',
                                    }}
                                >
                                    {<AddDataViewPanel orientation='vertical'/>}
                                </Box>
                            );
                        }}

                    </Transition>    
                        <Transition in={editingView.isEditing} timeout={100} mountOnEnter unmountOnExit>
                                {(state) => {

                                    return (
                                        <Box
                                            position={'fixed'}
                                            right={0}
                                            bottom={100}
                                            zIndex={1}
                                            sx={{
                                                backgroundColor: rgba(colors.primary[400], 0.5),
                                                height: 'calc(100% - 200px)',
                                                transition: 'transform 0.1s ease-in-out',
                                                transform: state === 'entered' ? 'translateX(0)' : 'translateX(100%)',
                                            }}
                                        >
                                            {<EditViewPanel />}
                                        </Box>
                                    );
                                }}
                            </Transition>          
                </Box> */}

                <Box sx={{...columnStyle}}>

                    <Box
                        ref={drop}
                        sx={{
                            height: '100%',
                            width: '100%'
                        }}>
                        <DashboardGrid setDashboard={setDashboard} />
                    </Box>
{/* 
                    <Box
                        sx={{
                            backgroundColor: colors.primary[400],
                            opacity: 0.5,
                            height: '10%',
                            bottom: 5,
                            width: '100%'
                        } }>

                        <AddDataViewPanel orientation={'horizontal'} />
                    </Box> */}
                </Box>

                <ViewConfigurationSidebar 
                    isCollapsed={!editingView.isEditing}
                    width={350}/>
            </Box>



        </DashboardContextProvider > 
    );

};

export default AddDashboard;