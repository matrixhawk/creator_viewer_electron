import { CustomTitlebar, Titlebar, TitlebarColor } from "custom-electron-titlebar";
import { contextBridge, ipcRenderer } from "electron";

window.addEventListener('DOMContentLoaded', () => {
    // Title bar implementation
    new CustomTitlebar({
        backgroundColor: TitlebarColor.fromHex('#1e1e1e'),
        titleHorizontalAlignment: 'left'
    });

    createAlwaysOnTopButton();
});

/** 置顶开关 */
function createAlwaysOnTopButton() {
    // 创建 style 标签
    const style = document.createElement('style');
    style.textContent = `
        /* 自定义 SVG 尺寸 */
        .custom-icon-size svg {
            width: 14px !important;
        }
    `;
    document.head.appendChild(style);
    document.documentElement.classList.add('dark');
    const controls = document.querySelector('.cet-window-controls') as HTMLElement;

    // 图钉SVG（置顶 / 非置顶两种状态）
    const pinOnSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22.3126 10.1753L20.8984 11.5895L20.1913 10.8824L15.9486 15.125L15.2415 18.6606L13.8273 20.0748L9.58466 15.8321L4.63492 20.7819L3.2207 19.3677L8.17045 14.4179L3.92781 10.1753L5.34202 8.76107L8.87756 8.05396L13.1202 3.81132L12.4131 3.10422L13.8273 1.69L22.3126 10.1753Z"></path></svg>
    `;

    let isOnTop = true;
    const pinOffSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13.8273 1.69L22.3126 10.1753L20.8984 11.5895L20.1913 10.8824L15.9486 15.125L15.2415 18.6606L13.8273 20.0748L9.58466 15.8321L4.63492 20.7819L3.2207 19.3677L8.17045 14.4179L3.92781 10.1753L5.34202 8.76107L8.87756 8.05396L13.1202 3.81132L12.4131 3.10422L13.8273 1.69ZM14.5344 5.22554L9.86358 9.89637L7.0417 10.4607L13.5418 16.9609L14.1062 14.139L18.7771 9.46818L14.5344 5.22554Z"></path></svg>
    `;

    const button = document.createElement('div');
    button.textContent = '新按钮';

    button.innerHTML = isOnTop ? pinOnSvg : pinOffSvg;
    button.classList.add('cet-control-icon', 'custom-icon-size')

    // 点击切换置顶状态
    button.addEventListener('click', () => {
        isOnTop = !isOnTop;
        button.innerHTML = isOnTop ? pinOnSvg : pinOffSvg;
        ipcRenderer.send('toggle-always-on-top', isOnTop);
    });

    controls.insertBefore(button, controls.firstChild);
}

contextBridge.exposeInMainWorld('electronAPI', {
    startListener: () => { ipcRenderer.send('start-listener'); },
    sendData: (data: string) => { ipcRenderer.send('send-data', data); },

    onListenerStarted: (callback: (data: [boolean, number]) => void) => { ipcRenderer.on('on-listener-started', (_event, data) => callback(data)) },
    onReceiveMessage: (callback: (data: any) => void) => {
        ipcRenderer.on('receive-message', (_event, data) => callback(data));
    },
    onClientDisconnect: (callback: () => void) => { ipcRenderer.on('on-client-disconnect', (_event) => callback()) }
})