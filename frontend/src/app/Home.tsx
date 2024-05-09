import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import WebSocketListener, { WebSocketConfig } from '../network/WebSocketListener';
import DataStreamMenuItem, { DataStreamConfig } from './DataStreamMenuItem';
import { Container, Drawer, AppBar, Toolbar, Typography, IconButton, ListItem, List, ListItemText, Icon, Divider, ListItemIcon, Theme, Button } from '@mui/material';
import { LineChart } from '@mui/x-charts';
import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Add, ChevronLeft, NetworkCheck, Settings, Title } from '@material-ui/icons';
import ConnectionStatusDot from './ConnectionStatusDot';
import { useAppStyles } from '../styles/AppStyles';
import MainTop from './MainTop';
import { useWebSocketHook } from '../network/WebSocketHook';
import { config } from 'process';


const drawerWidth = 400;

const useStyles = makeStyles((theme) => ({

    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: -drawerWidth,
    }
}));


const API_BASE_URL = 'http://localhost:5000';
const WS_URL = 'ws://localhost:5000/ws';

function Home() {

    const [dataStreams, setDataStreams] = useState<DataStreamConfig[]>([
        {
            name: 'Robot 1',
            webSocketConfig: new WebSocketConfig({
                ip: '192.168.0.89',
                port: 8080,
                endpoint: 'ws1'
            })
        },
        {
            name: 'Robot 2',
            webSocketConfig: new WebSocketConfig({
                ip: '192.168.0.89',
                port: 8080,
                endpoint: 'ws2'
            })
        }
    ]);

    const [wsConfig, setWsConfig] = useState<WebSocketConfig | null>(null);

    const { messages, readyState, error } = useWebSocketHook(new WebSocketConfig({ ip: 'localhost', port: 5000, endpoint: 'ws/connect' }), (message) => { console.log(message); });

    async function update(wsConfig: WebSocketConfig): Promise<void> {
        const wsUrl = `http://localhost:5000/update`;
        await axios.post(`${wsUrl}`,
            {
                ...wsConfig,

            }, {
            headers: {}
        });
    }

    async function connect(wsConfig: WebSocketConfig): Promise<void> {
        const wsUrl = `http://localhost:5000/connect`;
        await axios.post(`${wsUrl}`,
            {
                ...wsConfig

            }, {
            headers: {
            }
        });
    }

    // console.log(`Connecting to ${wsUrl}`);

    // setWsConfig(new WebSocketConfig({
    //     ipAddress,
    //     port,
    //     endpoint
    // }));

    //setWsConfig([...wsConfig, { ipAddress, port, endpoint }]);


    function disconnect(index: number): void {
        // const newWsConfig = [...wsConfig];
        // newWsConfig.splice(index, 1);
        // setWsConfig(newWsConfig);
    }

    const [open, setOpen] = React.useState(true);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };


    const classes = useStyles();
    const appStyles = useAppStyles();
    const theme = useTheme();

    return (
        <div className={appStyles.root}>
            <MainTop open={open} handleDrawerOpen={handleDrawerOpen} left={drawerWidth} />
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronLeft />}
                    </IconButton>
                </div>
                <List>
                    <ListItem>
                        <ListItemText primary="Connections" primaryTypographyProps={{ fontWeight: 'bold' }} />
                        <Add></Add>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    {dataStreams.map((dataStream, index) => {
                        const wsConfig = dataStream.webSocketConfig;

                        return (
                            <ListItem button onClick={() => update(wsConfig)} key={index}>
                                <ConnectionStatusDot wsConfig={wsConfig} />
                                <ListItemText primary={dataStream.name} secondary={dataStream.webSocketConfig.toDisplayString()} />
                                <Settings></Settings>
                                {/* connect icon button */}
                                <Button onClick={(event) => {
                                    event.stopPropagation();
                                    connect(wsConfig);
                                }}>CONNECT</Button>
                                <NetworkCheck></NetworkCheck>
                            </ListItem>
                        );
                    })}
                </List>
                {/* divider */}
                <Divider />
                <List>
                    {/* {['All mail', 'Trash', 'Spam'].map((text, index) => (
                        <ListItem button key={text}>
                            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))} */}
                </List>

            </Drawer>
            <main
                className={clsx(appStyles.content, {
                    [classes.contentShift]: open,
                })}
            >
                <Toolbar />
                <Typography paragraph>
                    ${messages?.length ?? '...'}
                </Typography>
                {/* {wsConfig && <WebSocketListener wsConfig={wsConfig} />} */}
                {messages && <div>{messages.length}</div>}
                {error && <div>Error: {error}</div>}
                <LineChart
                    width={600}
                    height={300}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    xAxis={[{
                        data: messages?.map(m => {
                            return Number.parseFloat(m.split(' ')[0]);
                        })
                    }]}
                    series={[{
                        data: messages?.map(m => {
                            return Number.parseFloat(m.split(' ')[1]);
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
                            return Number.parseFloat(m.split(' ')[0]);
                        })
                    }]}
                    series={[{
                        data: messages?.map(m => {
                            return Number.parseFloat(m.split(' ')[2]);
                        })
                    }]} // placeholder data
                >
                </LineChart>
            </main >
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
