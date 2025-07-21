import { CustomTitlebar, Titlebar, TitlebarColor } from "custom-electron-titlebar";
import { contextBridge, ipcRenderer } from "electron";

window.addEventListener('DOMContentLoaded', () => {
  // Title bar implementation
  new CustomTitlebar({
    backgroundColor: TitlebarColor.fromHex('#1e1e1e'),
    titleHorizontalAlignment :'left'
  });

  document.documentElement.classList.add('dark');
});

contextBridge.exposeInMainWorld('electronAPI', {
  startListener : ()=>{ ipcRenderer.send('start-listener'); },
  sendData : (data : string)=>{ ipcRenderer.send('send-data', data); },

  onListenerStarted : (callback: (data: [boolean, number]) => void)=>{ ipcRenderer.on('on-listener-started', (_event, data) => callback(data)) },
  onReceiveMessage: (callback: (data: any) => void) => {
    ipcRenderer.on('receive-message', (_event, data) => callback(data));
  },
  onClientDisconnect : (callback : ()=>void) =>{ ipcRenderer.on('on-client-disconnect', (_event) => callback()) }
})