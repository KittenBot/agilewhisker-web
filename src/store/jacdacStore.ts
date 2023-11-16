import { create } from 'zustand'
import {
  createWebSerialTransport,
  deviceCatalogImage,
  JDBus,
  JDDevice,
  JDService,

  DeviceSpec,
  Transport,

  DEVICE_ANNOUNCE, DEVICE_CHANGE, CONNECTION_STATE, SRV_DEVICE_SCRIPT_MANAGER
} from 'jacdac-ts'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const useJacdacStore = create<{
  bus: JDBus;
  connected: boolean;
  brain: DeviceSpec;
  brainAvatar: string
  deviceAvatar: string[];
  devsService: JDService;

  connectJDBus: () => Promise<void>;
  refresh: () => Promise<void>;

}>((set, get) => ({
  bus: null,
  connected: false,
  brain: null,
  devsService: null,
  brainAvatar: null,
  deviceAvatar: [],

  refresh: async () => {
    const bus = get().bus
    const devices: JDDevice[] = bus.devices({
      ignoreInfrastructure: true,
      announced: true,
    })
    const _nextDeviceAvatar = []
    for (const device of devices){
      if (device.hasService(SRV_DEVICE_SCRIPT_MANAGER)){
        const devsService = device.services({serviceClass: SRV_DEVICE_SCRIPT_MANAGER})[0]
        const spec = bus.deviceCatalog.specificationFromProductIdentifier(
          // device.productIdentifier
          952937357
        );
        const img = deviceCatalogImage(spec, "list")
        set(state => ({ brain: spec, devsService, brainAvatar: img }));
      } else {
        let productIdentifier = device.productIdentifier
        while(!productIdentifier){
          await sleep(100)
          productIdentifier = device.productIdentifier
        }
        const spec = bus.deviceCatalog.specificationFromProductIdentifier(device.productIdentifier)
        console.log("spec", device.productIdentifier, spec)
        const img = deviceCatalogImage(spec, "list")
        _nextDeviceAvatar.push(img)
      }
    }
    set(state => ({ deviceAvatar: _nextDeviceAvatar }))
  },

  connectJDBus: async () => {
    let bus: JDBus = get().bus
    if (!bus) {
      const transports = [createWebSerialTransport()];
      bus = new JDBus(transports, {
        client: false,
        disableRoleManager: true,
      });
      bus.on(DEVICE_CHANGE, async () => {
        await sleep(100)
        get().refresh()
      })

      bus.on(CONNECTION_STATE, (transport: Transport) => {
        console.log("transport", transport.connectionState);
        if (transport.connectionState === "connected") {
          set(state => ({ connected: true }));
        } else if (transport.connectionState === 'disconnected'){
          set(state => ({ connected: false }));
        }
      });
      (window as any).bus = bus
    }

    await bus.connect();
    
    set(state => ({ bus }));
    
  }

}))