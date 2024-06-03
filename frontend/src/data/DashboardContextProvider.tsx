import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { socket } from '../network/socket';




interface DecodedDataProviderProps {
    children: ReactNode;
}



interface DecodedDataContextType {
    decodedData?: any;
}

// TODO:::::::::

// Create a context to store the decoded data
export const DecodedDataContext: React.Context<DecodedDataContextType> = createContext<DecodedDataContextType>({});


// Create a provider component that listens to the socket streams and decodes the data
export const DecodedDataProvider: React.FC<DecodedDataProviderProps> = ({ children }) => {


    const [decodedData, setDecodedData] = useState(null);
    const [expiryTime, setSecs] = useState<number>(5); // Add state for secs parameter

    useEffect(() => {
        // Subscribe to the socket streams
        socket.on('connections_changed', (data) => {

            // const decoded = decodeData(data);
            // setDecodedData(decoded);

            // // Set a timeout to forget the data after expiryTime milliseconds
            // const timeoutId = setTimeout(() => {
            //     setDecodedData({});
            // }, expiryTime);

            // Clean up the timeout when the component is unmounted or expiryTime changes
            return () => {
                socket.off('connections_changed');
            }
        });

        // Clean up the effect
        return () => { socket.disconnect(); }
    }, [expiryTime]);



    return (
        <DecodedDataContext.Provider value={{ decodedData }}>
            {children}
        </DecodedDataContext.Provider>
    );
};




// Create a hook to access the decoded data
const useDecodedData = () => useContext(DecodedDataContext);

export { useDecodedData };