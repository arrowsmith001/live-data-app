import { WebSocketConfig } from "./WebSocketListener";

class DataStreamMenuItemProps {
    dataStreamConfig!: DataStreamConfig;
    //onClick: (event: React.MouseEvent<HTMLLIElement>) => void;
}

export class DataStreamConfig {
    name!: string;
    url!: string;
    isPrivate!: boolean;
    //dataConfig!: DataConfig;

}

function DataStreamMenuItem(props: DataStreamMenuItemProps) {
    const { dataStreamConfig } = props;
    const { name } = dataStreamConfig;

    return (
        <div>
            <div>{name}</div>
            <div>{dataStreamConfig.url}</div>
            {/* <div>{dataStreamConfig.webSocketConfig.ip}</div>
            <div>{dataStreamConfig.webSocketConfig.port}</div> */}
        </div>
    );
}

export default DataStreamMenuItem;