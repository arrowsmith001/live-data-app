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

            <Box
                sx={{
                    height: '100%',
                    width: '100%',
                    padding: 1,
                    justifyContent:'center',
                    display:'flex',
                    alignItems:'end'
                }}>

            <Box
                position={'fixed'}
                right={0}
                bottom={100}
                zIndex={1}
                sx={{
                    backgroundColor: colors.primary[400],
                    opacity: 0.5,
                    height: 'calc(100% - 200px)'
                } }>         
                <Transition in={!editingView.isEditing} timeout={100} mountOnEnter unmountOnExit>
                       {(state) => {
                           console.log('STATE: ' + state);
                           return (
                               <Box
                                   position={'fixed'}
                                   right={0}
                                   bottom={100}
                                   zIndex={1}
                                   sx={{
                                       backgroundColor: colors.primary[400],
                                       opacity: 0.5,
                                       height: 'calc(100% - 200px)',
                                       transition: 'transform 0.3s ease-in-out',
                                       transform: state === 'entered' ? 'translateX(0)' : 'translateX(100%)',
                                   }}
                               >
                                   {<AddDataViewPanel/>}
                               </Box>
                           );
                       }}
                   </Transition>    
                     <Transition in={editingView.isEditing} timeout={100} mountOnEnter unmountOnExit>
                            {(state) => {
                                console.log('STATE: ' + state);
                                const isEditPanel = state === 'entered' || state === 'exiting';

                                const isAddPanel = state === 'exited' || state === 'entering';

                                const panelTransform = isAddPanel ? 'translateX(0)' : 'translateX(100%)';

                                return (
                                    <Box
                                        position={'fixed'}
                                        right={0}
                                        bottom={100}
                                        zIndex={1}
                                        sx={{
                                            backgroundColor: colors.primary[400],
                                            opacity: 0.5,
                                            height: 'calc(100% - 200px)',
                                            transition: 'transform 0.3s ease-in-out',
                                            transform: state === 'entered' ? 'translateX(0)' : 'translateX(100%)',
                                        }}
                                    >
                                        {<EditViewPanel index={editingView.viewIndex!}/>}
                                    </Box>
                                );
                            }}
                        </Transition>          
            </Box>

            <Box
                ref={drop}
                position={'fixed'}
                sx={{
                    // backgroundColor: colors.primary[300],
                    height: '90%',
                    width: '70%'
                }}>
                <DashboardGrid setDashboard={setDashboard} />
            </Box>

            <Box
                sx={{
                    backgroundColor: colors.primary[400],
                    opacity: 0.5,
                    width: '75%',
                    height: '10%'
                
                } }>
                <DataSelector />
            </Box>

                    

            </Box>
        </DashboardContextProvider > 
    );

};

export default AddDashboard;