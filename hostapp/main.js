const {app, ipcMain, BrowserWindow} = require('electron')
const path = require('path')

app.on('ready', () => {
    const win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('index.html')
})

app.on('window-all-closed', () => {
    app.quit()
})
