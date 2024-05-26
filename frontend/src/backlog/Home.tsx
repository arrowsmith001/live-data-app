import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import WebSocketListener, { WebSocketConfig } from './WebSocketListener';
import DataStreamMenuItem, { DataStreamConfig } from './DataStreamMenuItem';
import { Container, AppBar, Toolbar, Typography, Icon, ListItemIcon, Theme, Button, IconButton, Box, Grid } from '@mui/material';
import { LineChart } from '@mui/x-charts';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import clsx from 'clsx';
import { ChevronLeft, Menu, Title } from '@mui/icons-material';
import MainTop from './MainTop';
import { useServerHook } from './useServerHook';
import { config } from 'process';
import { addConnection, getConnections } from '../api/ApiFunctions';
import { MainDrawer } from './MainDrawer';
import { useStyles } from './useStyles';
import MainContent from './MainContent';
import { DataSchema, DataType, SchemaItem } from './DataReader';
import SchemaToolbar from './SchemaToolbar';
import exp from 'constants';


const WS_CONNECT_URL = 'ws://localhost:5000/ws/connect';

function Home() {

    const [dataStreams, setDataStreams] = useState<DataStreamConfig[]>([]);

    const schema = new DataSchema(
        [
            new SchemaItem('time', DataType.TIMESTAMP),
            new SchemaItem('x', DataType.NUMBER),
            new SchemaItem('y', DataType.NUMBER),
        ],
        ' '
    );

    const { messages, readyState, error, setExpiryTime, getExpiryTime } = useServerHook(
        new WebSocketConfig(WS_CONNECT_URL));

    const [open, setOpen] = React.useState(true);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const onAddConnection = async () => {
        const config = {
            ...new WebSocketConfig({
                ip: '192.168.0.89',
                port: 8080,
                endpoint: 'ws1'
            }),
            name: 'Robot 1',
            isPrivate: false
        }
        await addConnection(config);
        const config2 = {
            ...new WebSocketConfig({
                ip: '192.168.0.89',
                port: 8080,
                endpoint: 'ws2'
            }),
            name: 'Robot 2',
            isPrivate: false
        }
        addConnection(config2);
    }

    const onRefreshConnections = async () => {
        // get all connections
        const dataStreams = await getConnections();
        setDataStreams(dataStreams);
    }



    const styles: any = {};
    const theme = useTheme();


    return (
        <div className={styles.root}>

            <IconButton
                sx={{ position: 'absolute', top: '4px', left: '4px' }}
                onClick={handleDrawerOpen}>
                <Menu />
            </IconButton>

            <Grid container xs={2} spacing={2}>
                <MainDrawer
                    open={open}
                    handleDrawerClose={handleDrawerClose}
                    onAddConnection={onAddConnection}
                    onRefreshConnections={onRefreshConnections}
                    dataStreams={dataStreams} />

                <Grid item xs={8}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '800px' }}>
                        <SchemaToolbar schema={schema} lastEvent={messages[messages.length - 1]} />
                        Main
                        {/* <MainContent messages={messages} error={undefined} /> */}

                    </Box>
                </Grid>
            </Grid>


        </div >
    );

    return <div>

        {dataStreams.map((dataStream, index) => {
            return <DataStreamMenuItem
                dataStreamConfig={dataStream}
            />
        })}
    </div>
}

export default Home;


