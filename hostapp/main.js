const {
  app,
  ipcMain,
  BrowserWindow,
  Tray,
  Menu,
  MenuItem,
} = require("electron");
const http = require("http");
const path = require("path");
const WebSocket = require("faye-websocket")
const isDev = require("electron-is-dev");

const { PCEvent } = require('./jd_pcevent');
const { MQTTServer } = require('./jd_mqtt');
const { PCMonitor } = require('./jd_pcmon');

// for jacdac transport
const {
  // events
  DEVICE_CHANGE,
  CONNECTION_STATE,
  FRAME_PROCESS,
  FRAME_PROCESS_LARGE,
  // transport
  JDBus,
  createNodeWebSerialTransport,
  createNodeSocketTransport,
  // services
  addServer,
  addServiceProvider,
} = require('jacdac-ts')
const { SerialPort } = require('serialport');

const JACDAC_PORT = 8081;

let tray = null;
let mainwin = null;
let server = null;
let jdbus = null;
let wsClients = {};

function hideApp() {
  mainwin.hide();
  if (process.platform === "darwin") {
    app.dock.hide();
  }
}

const jdproxy = '<html lang="en"><title>Jacdac DevTools</title><meta name="viewport"content="width=device-width,initial-scale=1"><link rel="icon"href="https://microsoft.github.io/jacdac-docs/favicon.svg"type="image/x-icon"><style>iframe{position:absolute;left:0;top:0;height:100%;width:100%;border:none}</style><iframe id="frame"alt="Jacdac Dashboard"allow="usb;serial;bluetooth;vr;clipboard-write;"allowfullscreen sandbox="allow-scripts allow-downloads allow-same-origin"></iframe><script>!function(){function e(){var n;o||(n=!1,(o=new WebSocket(a)).binaryType="arraybuffer",console.debug("devtools: connecting ".concat(a,"...")),o.addEventListener("open",function(){console.debug("devtools: connected ".concat(o.url)),n=!0,d.contentWindow.postMessage({type:"devtoolsconnected",sender:s},"*")}),o.addEventListener("message",function(e){"string"==typeof e.data?d.contentWindow.postMessage(e.data,"*"):(e=new Uint8Array(e.data),d.contentWindow.postMessage({type:"messagepacket",channel:"jacdac",data:e,sender:s},"*"))}),o.addEventListener("close",function(){console.debug("devtools: connection closed"),o=void 0}),o.addEventListener("error",function(e){n&&console.debug("devtools: error",e),null!=o&&o.close()}))}var o,n=window.location,t="https:"===n.protocol,n=n.hostname,c=t?443:8081,a="".concat(t?"wss:":"ws:","//").concat(n,":").concat(c,"/"),d=document.getElementById("frame"),t=window.location.search||"",s=(t+=(0<t.length?"&":"?")+"devtools="+encodeURIComponent(a),Math.random()+""),n="https://microsoft.github.io/jacdac-docs/dashboard/"+t+"#"+s;window.addEventListener("message",function(e){e=e.data;e&&("messagepacket"===e.type&&"jacdac"===e.channel||"devicescript"===e.channel)&&(null==o?void 0:o.readyState)===WebSocket.OPEN&&o.send(e.data)});setInterval(e,5e3),e(),d.src=n}()</script>';

async function startJacdacBus() {
  const transports = [
    // await createNodeWebSerialTransport(SerialPort),
    createNodeSocketTransport()
  ]
  const bus = new JDBus(transports, {
    // client: true,
    // disableRoleManager: true,
    // proxy: true
  })

  bus.passive = false;
  bus.on('error', error => {
    console.error("JDBUS", error);
  })

  bus.on(DEVICE_CHANGE, async () => {
    const devices = bus.devices();
    console.log("update devices", devices.length)
    for (const device of devices) {
      console.log("device", device.shortId)
    }
  })

  bus.on(CONNECTION_STATE, async (transport) => {
    console.log("connection state", transport.type, transport.connectionState)
  })

  bus.on(FRAME_PROCESS, async (frame) => {
    for (const client_id in wsClients) {
      if (client_id === frame._jacdac_sender || !frame._jacdac_sender){
        continue;
      }
      const client = wsClients[client_id];
      if (client) {
        client.send(Buffer.from(frame));
      }
    }
  })

  bus.on(FRAME_PROCESS_LARGE, async (frame) => {
    for (const client_id in wsClients) {
      if (client_id === frame._jacdac_sender || !frame._jacdac_sender){
        continue;
      }
      const client = wsClients[client_id];
      if (client) {
        client.send(Buffer.from(frame));
      }
    }
  })

  bus.autoConnect = true;
  bus.start()
  await bus.connect()
  
  jdbus = bus;

  // TODO: bind all services to one host device
  // local services
  // addServiceProvider(bus, {
  //   name: "hostapp",
  //   serviceClasses: [],
  //   services: () => {
  //     return []
  //   }
  // });
}

function startHttpServer(){
  if (server) {
    server.close();
  }
  try {
    const http_server = http.createServer((req, res) => {
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Content-Type', 'text/html');
      res.end(jdproxy);
    });

    http_server.on('error', (err) => {
      if (/EADDRINUSE/.test(err.message)){
        console.log("Port in use, closing server");
        setTimeout(() => {
          http_server.close();
        }, 1000); 
      } else {
        console.error(err);
      }
    })

    http_server.on('upgrade', (req, socket, body) => {
      if (WebSocket.isWebSocket(req)) {
        const remoteAddress = socket.remoteAddress

        const client = new WebSocket(req, socket, body)
        const client_id = Math.random().toString(36).substring(2, 15)
        wsClients[client_id] = client;
        console.log("Websocket connection", req.url, remoteAddress, client_id)

        client.on('message', (event) => {
          const { data } = event;
          if (typeof data === 'string') {
            console.log("Websocket message", data)
          } else {
            // forward to jacdac
            const buffer = new Uint8Array(data);
            buffer._jacdac_sender = client_id;
            jdbus.sendFrameAsync(buffer);
          }
        })

        client.on('close', () => {
          console.log("Websocket close", req.url, remoteAddress, client_id)
          delete wsClients[client_id];
        })
      }
    })

    http_server.listen(JACDAC_PORT, '127.0.0.1')
    server = http_server;
    // wait for server to start
    setTimeout(() => {
      if (server.listening) {
        console.log("Server listening on port", JACDAC_PORT);
        startJacdacBus();
      } else {
        // TODO: start jacdac bus without server
        startJacdacBus();
      }
    }, 1000);
  } catch (e) {
    console.error(e);
  }
}

app.on("ready", () => {
  mainwin = new BrowserWindow({
    // width: 320,
    // height: 240,
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

  if (isDev) {
    mainwin.loadURL('http://localhost:3000/hostapp');
    mainwin.openDevTools();
  } else {
    mainwin.loadFile(path.join(__dirname, "../build/hostapp/index.html"));
  }

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

  startHttpServer();
});

app.on("window-all-closed", () => {
  app.quit();
});

ipcMain.on("jd-control", (event, args) => {
  console.log("message", args);
  const { command, data } = args;
  switch (command) {
    case 'start-service':
      if (jdbus) {
        const mqtt = new MQTTServer();
        addServer(jdbus, 'hostapp', mqtt);
      }
      break;
    
    default:
      console.warn("Unknown command", command);
      break;
  }
})


