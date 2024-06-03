import { socket } from "../network/socket";
import { SchemaParser } from "./SchemaParser";

type Callback = (data: any) => void;

class DataService {


    private static instance: DataService | null = null;

    private constructor() { }

    public static getInstance(): DataService {
        if (!DataService.instance) {
            DataService.instance = new DataService();
        }
        return DataService.instance;
    }

    private subs = new Map<number, number[]>();

    public subscribe(connectionId: number, schemaId: number) {

        if (!this.subs.has(connectionId)) {
            this.subs.set(connectionId, []);

            socket.on('connection-' + connectionId, (data: any) => {
                for (const schemaId of this.subs.get(connectionId) ?? []) {
                    //    const parsed = SchemaParser.parse(schemaId, data);
                }
            });
        }
        this.subs.get(connectionId)?.push(schemaId);

    }

    public unsubscribe(connectionId: number) {
        socket.off('connection-' + connectionId);
    }

}

export default DataService.getInstance();
