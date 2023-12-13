const {app, ipcMain, BrowserWindow, Tray} = require('electron')
const path = require('path')

let tray = null
let mainwin = null

app.on('ready', () => {
    mainwin = new BrowserWindow({
        width: 320,
        height: 240,
        show: false,
        // framed: false,
        fullscreenable: false,
        resizable: false,
        useContentSize: true,
        // transparent: true,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            backgroundThrottling: false,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    mainwin.setMenu(null)

    mainwin.loadFile('index.html')

    tray = new Tray('./assets/icon-16x16.png')

    tray.on('click', () => {
        mainwin.isVisible() ? mainwin.hide() : mainwin.show()
    })

    mainwin.on('close', (event) => {
        event.preventDefault()
        mainwin.hide()
    })

    // mainwin.hide()
})

app.on('window-all-closed', () => {
    app.quit()
})
