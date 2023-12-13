const {
  app,
  ipcMain,
  BrowserWindow,
  Tray,
  Menu,
  MenuItem,
} = require("electron");
const path = require("path");

let tray = null;
let mainwin = null;

function hideApp() {
  mainwin.hide();
  if (process.platform === "darwin") {
    app.dock.hide();
  }
}

app.on("ready", () => {
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
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainwin.setMenu(null);

  mainwin.loadFile("index.html");

  tray = new Tray("./assets/icon-16x16.png");

  // tray menu
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open', click: () => mainWindow.show() },
    { label: 'Exit', click: () => app.quit() }
  ]);

  tray.on("click", () => {
    if (mainwin.isVisible()) {
      // show context menu
      tray.popUpContextMenu(contextMenu);
    } else {
      mainwin.isVisible() ? mainwin.hide() : mainwin.show();
    }
  });

  
    
  mainwin.on("close", (event) => {
    event.preventDefault();
    hideApp();
  });

  hideApp();
});

app.on("window-all-closed", () => {
  app.quit();
});
