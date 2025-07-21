
export default class ElectronChannel implements IViewerChannel<number> {
    protected _messageHandler : (messageData : C2S_CreatorViewerMessage)=>void;
    protected _disconnectCallBack : ()=>void;

    protected _startResolver : (value : [boolean, number])=>void;

    constructor() {
        window.electronAPI.onReceiveMessage((data)=>this.onReceiveIPCMessage(data));
        window.electronAPI.onListenerStarted((data)=>this.onListenerStarted(data));
        window.electronAPI.onClientDisconnect(()=>this._disconnectCallBack?.());
    }

    protected onReceiveIPCMessage(data : string) {
        this._messageHandler?.(JSON.parse(data) as C2S_CreatorViewerMessage);
    }

    protected onListenerStarted(result) {
        this._startResolver(result);
    }

    tryStartListener(): Promise<[boolean, number]> {
        return new Promise(resolve=>{
            this._startResolver = resolve;
            window.electronAPI.startListener();
        })
        // throw new Error("Method not implemented.");
    }
    setMessageHandler(handler: (messageData: C2S_CreatorViewerMessage) => void, disconnectCallBack: () => void): void {
        this._messageHandler = handler;
        this._disconnectCallBack = disconnectCallBack;
    }
    closeChannel(): void {
        // throw new Error("Method not implemented.");
    }
    send(messageData: S2C_CreatorViewerMessage): void {
        window.electronAPI.sendData(JSON.stringify(messageData));
    }

}