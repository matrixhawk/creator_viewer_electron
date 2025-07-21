export {}

declare global {
    interface Window {
        electronAPI : {
            startListener : ()=>void;
            sendData : (data : string)=>void;

            onListenerStarted : (callback: (data: [boolean, number]) => void)=>void;
            onReceiveMessage: (callback: (data: any) => void) => void;
            onClientDisconnect: (callback: () => void) => void;
        }
    }
}