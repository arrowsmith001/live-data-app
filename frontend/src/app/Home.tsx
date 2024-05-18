import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import WebSocketListener, { WebSocketConfig } from '../network/WebSocketListener';
import DataStreamMenuItem, { DataStreamConfig } from './DataStreamMenuItem';
import { Container, AppBar, Toolbar, Typography, Icon, ListItemIcon, Theme, Button } from '@mui/material';
import { LineChart } from '@mui/x-charts';
import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Title } from '@material-ui/icons';
import MainTop from './MainTop';
import { useWebSocketHook } from '../network/WebSocketHook';
import { config } from 'process';
import { addConnection, getConnections } from '../api/ApiFunctions';
import { MainDrawer } from './MainDrawer';
import { useStyles } from './useStyles';


const WS_CONNECT_URL = 'ws://localhost:5000/ws/connect';

function Home() {

    const [dataStreams, setDataStreams] = useState<DataStreamConfig[]>([]);

    const { messages, readyState, error } = useWebSocketHook(new WebSocketConfig(WS_CONNECT_URL), (message) => { console.log(message); });

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



    const styles = useStyles();
    const theme = useTheme();

    return (
        <div className={styles.root}>
            <MainTop open={open} handleDrawerOpen={handleDrawerOpen} />
            <MainDrawer open={open}
                handleDrawerClose={handleDrawerClose}
                onAddConnection={onAddConnection}
                onRefreshConnections={onRefreshConnections}
                dataStreams={dataStreams} />
            <Toolbar />
            <Typography paragraph>
                ${messages?.length ?? '...'}
            </Typography>
            {messages && <div>{messages.length}</div>}
            {error && <div>Error: {error.toString()}</div>}
            <LineChart
                width={600}
                height={300}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                xAxis={[{
                    data: messages?.map(m => {
                        return (m[0] as Date).getTime();
                    })
                }]}
                series={[{
                    data: messages?.map(m => {
                        return m[1];
                    })
                }]} // placeholder data
            >
            </LineChart>
            <LineChart
                width={600}
                height={300}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                xAxis={[{
                    data: messages?.map(m => {
                        return (m[0] as Date).getTime();
                    })
                }]}
                series={[{
                    data: messages?.map(m => {
                        return m[1];
                    })
                }]} // placeholder data
            >
            </LineChart>
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


