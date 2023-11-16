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

export const useJacdacStore = create<{
  bus: JDBus;
  brain: DeviceSpec;
  brainAvatar: string
  deviceAvatar: string[];
  devsService: JDService;

  connectJDBus: () => Promise<void>;
  refresh: () => void;

}>((set, get) => ({
  bus: null,
  brain: null,
  devsService: null,
  brainAvatar: null,
  deviceAvatar: [],

  refresh: () => {
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
        const spec = bus.deviceCatalog.specificationFromProductIdentifier(device.productIdentifier)
        console.log("spec", device.productIdentifier, spec)
        const img = deviceCatalogImage(spec, "list")
        _nextDeviceAvatar.push(img)
      }
    }
    set(state => ({ deviceAvatar: _nextDeviceAvatar }))
  },

  connectJDBus: async () => {
    const transports = [createWebSerialTransport()];
    const bus: JDBus = new JDBus(transports, {
      client: false,
      disableRoleManager: true,
    });
    bus.on(DEVICE_CHANGE, () => {
      setTimeout(() => {
        get().refresh()
      }, 100)
    })

    bus.on(CONNECTION_STATE, (transport: Transport) => {
      console.log("transport", transport.connectionState);
    });

    await bus.connect();
    (window as any).bus = bus
    
    set(state => ({ bus }));
    
  }

}))