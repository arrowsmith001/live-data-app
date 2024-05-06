import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import WebSocketListener, { WebSocketConfig } from '../network/WebSocketListener';
import DataStreamMenuItem, { DataStreamConfig } from './DataStreamMenuItem';

const API_BASE_URL = 'http://localhost:5000';
const WS_URL = 'ws://localhost:5000/ws';

function Home() {

    const [dataStreams, setDataStreams] = useState<DataStreamConfig[]>([
        {
            name: 'Robot 1',
            webSocketConfig: {
                ipAddress: '192.168.0.89',
                port: 8080,
                endpoint: 'ws',
            }
        }
    ]);


    function connect(ipAddress: string, port: number, endpoint: string): void {
        const wsUrl = `ws://${ipAddress}:${port}/${endpoint}`;
        console.log(`Connecting to ${wsUrl}`);

        //setWsConfig([...wsConfig, { ipAddress, port, endpoint }]);
    }

    function disconnect(index: number): void {
        // const newWsConfig = [...wsConfig];
        // newWsConfig.splice(index, 1);
        // setWsConfig(newWsConfig);
    }

    return (
        <div>
            <button onClick={() => connect("192.168.0.89", 8080, "ws")}>ADD</button>
            {dataStreams.map((config, index) => (
                <DataStreamMenuItem key={index}
                    dataStreamConfig={config} />))}
        </div>
    );
}

export default Home;
