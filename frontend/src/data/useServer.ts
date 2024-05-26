import { useContext } from 'react';
import { WebSocketContext } from './WebSocketContext';

export const useLatestData = () => {
    const context = useContext(WebSocketContext);

    if (context === undefined || context === null) {
        throw new Error('useLatestData must be used within a WebSocketProvider');
    }

    return context.latestData;
};


export const useDataArray = () => {
    const context = useContext(WebSocketContext);

    if (context === undefined || context === null) {
        throw new Error('useDataArray must be used within a WebSocketProvider');
    }

    return context.dataArray;
};

