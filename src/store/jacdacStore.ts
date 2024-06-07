import { create } from 'zustand'
import {
  createWebSerialTransport,
  createUSBTransport,
  createWebSocketTransport,
  deviceCatalogImage,
  JDBus,
  JDDevice,
  JDService,
  DeviceSpec,
  Transport,
  DeviceScriptManagerCmd,OutPipe,
  DEVICE_ANNOUNCE, DEVICE_CHANGE, CONNECTION_STATE, SRV_DEVICE_SCRIPT_MANAGER,SRV_ROLE_MANAGER,
  SRV_SETTINGS, Packet
} from 'jacdac-ts'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const useJacdacStore = create<{
  bus: JDBus;
  webSerialConnected: boolean;
  webSocketConnected: boolean;
  device: JDDevice;
  spec: DeviceSpec;
  brainAvatar: string
  deviceAvatar: string[];
  devsService: JDService;
  downloadProgress: number;
  downloadErr: string;

  connectJDBus: (usbConnect?:boolean) => Promise<void>;
  refresh: () => Promise<void>;
  downloadDevs: (bytecode: any) => Promise<string>;

}>((set, get) => ({
  bus: null,
  webSerialConnected: false,
  webSocketConnected: false,
  spec: null,
  device: null,
  devsService: null,
  brainAvatar: null,
  deviceAvatar: [],
  downloadProgress: -1,
  downloadErr: '',

  refresh: async () => {
    const bus = get().bus
    if (!bus) return
    const devices: JDDevice[] = bus.devices({
      ignoreInfrastructure: true,
      announced: true,
    })
    const _nextDeviceAvatar = []
    for (const device of devices){
      if (device.hasService(SRV_DEVICE_SCRIPT_MANAGER)){
        const devsService = device.services({serviceClass: SRV_DEVICE_SCRIPT_MANAGER})[0]
        const spec = bus.deviceCatalog.specificationFromProductIdentifier(
          device.productIdentifier
        );
        const img = deviceCatalogImage(spec, "list")
        set(state => ({ spec, devsService, brainAvatar: img, device }));
      } else {
        let productIdentifier = device.productIdentifier
        while(!productIdentifier){
          await sleep(100)
          productIdentifier = device.productIdentifier
        }
        const spec = bus.deviceCatalog.specificationFromProductIdentifier(device.productIdentifier)
        console.log("spec", device.productIdentifier, spec)
        if (!spec) continue
        const img = deviceCatalogImage(spec, "list")
        _nextDeviceAvatar.push({img,name:spec.name})
      }
    }
    set(state => ({ deviceAvatar: _nextDeviceAvatar }))
  },

  connectJDBus: async (usbConnect?:boolean) => {
    let bus: JDBus = get().bus
    if (!bus || (usbConnect && bus._transports[0].type === "serial") || (!usbConnect && bus._transports[0].type === 'usb')) {
      const transports = [
        usbConnect ?  createUSBTransport() :createWebSerialTransport(),
        createWebSocketTransport('ws://localhost:8081')
      ];
        bus = new JDBus(transports, {
          client: false,
          disableRoleManager: true,
        });
      bus.on(DEVICE_CHANGE, async () => {
        await sleep(100)
        get().refresh()
      })

      bus.on(CONNECTION_STATE, (transport: Transport) => {
        if (transport.type === "web") {
          set(state => ({ webSocketConnected: transport.connectionState === 'connected' }));
        } else if (transport.type === "serial") {
          set(state => ({ webSerialConnected: transport.connectionState === 'connected' }));
        } 
      });
      // for debug only
      (window as any).bus = bus
    }

    await bus.connect();
    
    set(state => ({ bus }));
    
  },

  downloadDevs: async (bytecode: any) => {
    const devsService = get().devsService
    if (!devsService) return 'No device script manager service found'
    try {
      await OutPipe.sendBytes(devsService, DeviceScriptManagerCmd.DeployBytecode, bytecode, p => {
        set(state => ({ downloadProgress: p*100 }))
      })
    } catch (error) {
      set(state => ({ downloadErr: error.toString() }))
      return error.toString()
    } finally {
      set(state => ({ downloadProgress: -1 }))
    }
    return ''
  }


}))