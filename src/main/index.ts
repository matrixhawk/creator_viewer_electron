import { attachTitlebarToWindow, setupTitlebar } from 'custom-electron-titlebar/main';
import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import path from 'path';
import WSChannel from "./WSChannel";

// setup the titlebar main process
setupTitlebar();

function createWindow() {
    const win = new BrowserWindow({
        width: 400,
        height: 850,
        hiddenInMissionControl : true,
        frame: false, // needed if process.versions.electron < 14
        titleBarStyle: 'hidden',
        /* You can use *titleBarOverlay: true* to use the original Windows controls */
        titleBarOverlay: false,
        webPreferences: {
            sandbox: false,
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    })


    Menu.setApplicationMenu(Menu.buildFromTemplate([]));

    // 开发模式加载本地Vite服务
    if (process.env.NODE_ENV === 'DEV') {
        win.loadURL('http://localhost:5173/')
    } else {
        // 生产模式加载打包后的html
        win.loadFile(path.join(__dirname, '../renderer/index.html'))
    }
    win.webContents.openDevTools()
    win.setAlwaysOnTop(true)
    attachTitlebarToWindow(win);

    const channel = new WSChannel(win);

    ipcMain.on('start-listener', async (_event, value) => {
        const result = await channel.tryStartListener();
        win.webContents.send('on-listener-started', result);
    })

    ipcMain.on('send-data', (_event, data) => {
        channel.send(data);
    })

    ipcMain.on('toggle-always-on-top', (_event, isOnTop)=>{
        win.setAlwaysOnTop(isOnTop)
    })
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})