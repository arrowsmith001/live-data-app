import { WebSocketConfig } from '../network/WebSocketListener';
import { DataStreamConfig } from './DataStreamMenuItem';
import { Drawer, IconButton, ListItem, List, ListItemText, Divider } from '@mui/material';
import React from 'react';
import { Add, ChevronLeft, NetworkCheck, Refresh, Settings } from '@material-ui/icons';
import ConnectionStatusDot from './ConnectionStatusDot';
import { subscribe } from '../api/ApiFunctions';
import { useStyles } from './useStyles';

class MainDrawerProps {
    open!: boolean;
    handleDrawerClose!: () => void;
    onAddConnection!: () => Promise<void>;
    onRefreshConnections!: () => Promise<void>;
    dataStreams!: DataStreamConfig[];
}

export const drawerWidth = 400;

export function MainDrawer({ ...props }: MainDrawerProps) {

    const styles = useStyles();

    const { open, handleDrawerClose, onAddConnection, onRefreshConnections, dataStreams } = props;

    return <Drawer
        className={styles.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
            paper: styles.drawerPaper,
        }}
    >
        <div className={styles.drawerHeader}>
            <IconButton onClick={handleDrawerClose}>
                <ChevronLeft />
            </IconButton>
        </div>
        <List>
            <ListItem>
                <ListItemText primary="Connections" primaryTypographyProps={{ fontWeight: 'bold' }} />
                <Add onClick={async (event) => {
                    event.stopPropagation();
                    onAddConnection();
                }}></Add>
                <Refresh onClick={async (event) => {
                    event.stopPropagation();
                    onRefreshConnections();
                }}></Refresh>
            </ListItem>
        </List>
        <Divider />
        <List>
            {dataStreams.map((dataStream, index) => {

                return (
                    <ListItem button onClick={() => subscribe(new WebSocketConfig(dataStream.url))} key={index}>
                        <ConnectionStatusDot />
                        <ListItemText primary={dataStream.name} secondary={dataStream.url} />
                        <Settings></Settings>
                        {/* connect icon button */}
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

    </Drawer>;
}
