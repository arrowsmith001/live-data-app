type Callback = (data: any) => void;



class WebSocketService {


    private static instance: WebSocketService | null = null;
    private socketRef: WebSocket | null = null;
    private callbacks: { [key: string]: Callback } = {};
    private url: string = '';
    private shouldReconnect: boolean = true;
    private reconnectInterval: number = 1000; // 1 second
    private maxReconnectInterval: number = 30000; // 30 seconds
    private reconnectAttempts: number = 0;

    private constructor() { }

    public static getInstance(): WebSocketService {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    public connect(url: string): void {

        if (this.socketRef) {
            return;
        }

        this.url = url;
        this.socketRef = new WebSocket(url);
        this.shouldReconnect = true;

        this.socketRef.onopen = () => {
            console.log("WebSocket open");
            this.reconnectAttempts = 0; // Reset reconnect attempts on successful connection
        };

        this.socketRef.onmessage = (e: MessageEvent) => {
            this.handleNewMessage(JSON.parse(e.data));
        };

        this.socketRef.onclose = () => {
            console.log("WebSocket closed");
            if (this.shouldReconnect) {
                this.reconnect();
            }
        };

        this.socketRef.onerror = (error: Event) => {
            console.error("WebSocket error:", error);
            this.socketRef?.close();
        };
    }

    private handleNewMessage(e: any): void {
        if (e.data) {
            Object.values(this.callbacks).forEach(callback => callback(e.data));
        }
        else if (e.connection) {
            console.log('CONNECTION EVENT: ' + e.connection);
        }
        // append to existing data
    }

    private reconnect(): void {
        this.reconnectAttempts++;
        const timeout = Math.min(this.reconnectInterval * this.reconnectAttempts, this.maxReconnectInterval);
        console.log(`Reconnecting in ${timeout / 1000} seconds...`);
        setTimeout(() => this.connect(this.url), timeout);
    }

    public disconnect(): void {
        this.shouldReconnect = false;
        this.socketRef?.close();
    }

    public addCallback(callback: Callback): string {
        const callbackID = new Date().getTime().toString();
        this.callbacks[callbackID] = callback;
        return callbackID;
    }

    public removeCallback(callbackID: string): void {
        delete this.callbacks[callbackID];
    }
}

export default WebSocketService.getInstance();
