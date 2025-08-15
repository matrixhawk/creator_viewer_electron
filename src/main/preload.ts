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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13.8273 1.69L22.3126 10.1753L20.8984 11.5895L20.1913 10.8824L15.9486 15.125L15.2415 18.6606L13.8273 20.0748L9.58466 15.8321L4.63492 20.7819L3.2207 19.3677L8.17045 14.4179L3.92781 10.1753L5.34202 8.76107L8.87756 8.05396L13.1202 3.81132L12.4131 3.10422L13.8273 1.69ZM14.5344 5.22554L9.86358 9.89637L7.0417 10.4607L13.5418 16.9609L14.1062 14.139L18.7771 9.46818L14.5344 5.22554Z"></path></svg>
    `;

    let isOnTop = true;
    const pinOffSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20.9701 17.1716 19.5559 18.5858 16.0214 15.0513 15.9476 15.1251 15.2405 18.6606 13.8263 20.0748 9.58369 15.8322 4.63394 20.7819 3.21973 19.3677 8.16947 14.418 3.92683 10.1753 5.34105 8.7611 8.87658 8.05399 8.95029 7.98028 5.41373 4.44371 6.82794 3.0295 20.9701 17.1716ZM10.3645 9.39449 9.86261 9.8964 7.04072 10.4608 13.5409 16.9609 14.1052 14.139 14.6071 13.6371 10.3645 9.39449ZM18.7761 9.46821 17.4356 10.8087 18.8498 12.2229 20.1903 10.8824 20.8974 11.5895 22.3116 10.1753 13.8263 1.69003 12.4121 3.10425 13.1192 3.81135 11.7787 5.15185 13.1929 6.56607 14.5334 5.22557 18.7761 9.46821Z"></path></svg>
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