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

  DEVICE_ANNOUNCE, DEVICE_CHANGE, CONNECTION_STATE, SRV_DEVICE_SCRIPT_MANAGER,SRV_ROLE_MANAGER,
  SRV_SETTINGS, Packet
} from 'jacdac-ts'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const useJacdacStore = create<{
  bus: JDBus;
  connected: boolean;
  device: JDDevice;
  spec: DeviceSpec;
  brainAvatar: string
  deviceAvatar: string[];
  devsService: JDService;

  connectJDBus: (usbConnect?:boolean) => Promise<void>;
  refresh: () => Promise<void>;

}>((set, get) => ({
  bus: null,
  connected: false,
  spec: null,
  device: null,
  devsService: null,
  brainAvatar: null,
  deviceAvatar: [],

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
        console.log("transport", transport);
        if (transport.connectionState === "connected") {
          set(state => ({ connected: true }));
        } else if (transport.connectionState === 'disconnected'){
          set(state => ({ connected: false }));
        }
      });
      // for debug only
      (window as any).bus = bus
    }

    await bus.connect();
    
    set(state => ({ bus }));
    
  }

}))