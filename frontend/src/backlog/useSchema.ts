import { useContext } from 'react';
import { DataSchema, DataType } from './DataReader';

export const useSchema = () => {
    return {
        items: [
            { label: 't', type: DataType.TIMESTAMP },
            { label: 'x', type: DataType.NUMBER },
            { label: 'y', type: DataType.NUMBER },
            { label: 'theta', type: DataType.NUMBER },
        ],
        delimeter: ','
    };
};
