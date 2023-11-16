import React, { useMemo, useState } from "react";
import { Button, Card, Flex, Typography } from 'antd';

import {
  Host,
  compileWithHost,
  resolveBuildConfig,
} from "@devicescript/compiler";
import {
  JDBus,
  JDDevice,
  JDService,
  createWebBus,
  DeviceCatalog,
  DEVICE_ANNOUNCE,
  createWebSerialTransport,
  CONNECTION_STATE,
  ConnectionState,
  Transport,
  deviceCatalogImage,
  SRV_DEVICE_SCRIPT_MANAGER,
} from "jacdac-ts";

// Device script implementation for kitten extension
export class DevsHost implements Host {
  private files: {};
  private cfg: any;
  bytecode: Uint8Array;

  constructor(opt: any = {}) {
    this.files = opt.files || {};
    this.cfg = resolveBuildConfig();
    this.cfg.hwInfo = opt.hwInfo || {
      progName: "hello",
      progVersion: "0.0.1",
    };
  }

  write(filename: string, contents: string | Uint8Array): void {
    this.files[filename] = contents;
  }
  read(filename: string): string {
    // console.log("read", filename)
    if (this.files.hasOwnProperty(filename)) {
      return this.files[filename] as string;
    }
    throw new Error("No such file: " + filename);
  }
  resolvePath(p: string) {
    return p;
  }

  log(msg: string): void {
    console.log(msg);
  }

  verifyBytecode(buf: Uint8Array): void {
    // TODO: vm to verify bytecode??
    this.bytecode = buf;
    return;
  }

  getConfig() {
    return this.cfg;
  }
}

const DevsDownloadCard = ({ DevsName, code }) => {
  const [jdbus, setJdbus] = useState<JDBus>();
  const [brainImg, setBrainImg] = useState<string>();
  const [devicesImg, setDevicesImg] = useState<string[]>([]);
  const [devsService, setDevsService] = useState<JDService>();
  const [transport, setTransport] = useState<Transport>();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const createJDBus = async function () {
    const transports = [createWebSerialTransport()];
    const bus: JDBus = new JDBus(transports, {
      client: false,
      disableRoleManager: true,
    });
    bus.on(DEVICE_ANNOUNCE, async (device: JDDevice) => {
      if (device.deviceId === bus.selfDeviceId)
        return
      console.log("device", device, device.productIdentifier);
      // TODO: we need some scheduling here
      setTimeout(() => {
        if (device.hasService(SRV_DEVICE_SCRIPT_MANAGER)){
          const devsService = device.services({serviceClass: SRV_DEVICE_SCRIPT_MANAGER})[0]
          const spec = bus.deviceCatalog.specificationFromProductIdentifier(
            // device.productIdentifier
            952937357
          );
          const img = deviceCatalogImage(spec, "list")
          setDevsService(devsService);
          setBrainImg(img);
        } else {
            const spec = bus.deviceCatalog.specificationFromProductIdentifier(device.productIdentifier)
            console.log("spec", device.productIdentifier, spec)
            devicesImg.push(deviceCatalogImage(spec, "avatar"));
            setDevicesImg([...devicesImg]);
        }
      }, 100)
      
    });

    bus.on(CONNECTION_STATE, (transport: Transport) => {
      console.log("transport", transport.connectionState);
      if (transport.connectionState === ConnectionState.Disconnected) {
        setTransport(null);
      } else if (transport.connectionState === ConnectionState.Connected) {
        setTransport(transport);
      }
    });

    await bus.connect();
    (window as any).bus = bus

    return bus;
  };

  const handleConnect = async () => {
    if (!jdbus) {
      const bus = await createJDBus();
      setJdbus(bus);
    }
  }

  const handleDownload = async () => {
    
    console.log("download", code);
    const host = new DevsHost({
      hwInfo: {
        progName: "DeviceScript-workspace devs/hello",
        progVersion: "6.0.0",
      },
      files: {
        "src/main.ts": code,
      },
    });
    const result = compileWithHost("src/main.ts", host);
    console.log(result);

    setIsDownloading(true);
    // simulate progress
    const interval = setInterval(() => {
      setDownloadProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(interval);
          setIsDownloading(false);
          return 100;
        }
        return Math.min(oldProgress + 10, 100);
      });
    }, 1000);
  };

  return (
    <Card hoverable style={{ width: 240, margin: 10 }} bodyStyle={{padding: 0, overflow: 'hidden'}}>
      { jdbus ? <Flex justify="space-between">
        { brainImg ? <img src={brainImg} style={{width: 96, height: 96}} /> : null }
        <Flex vertical align="flex-end" justify="space-between" style={{ padding: 32 }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            {devicesImg.map((img, i) => <img key={i} src={img} style={{width: 32, height: 32, margin: 4}} />)}
          </Typography.Title>
          <Button
            type="primary"
            onClick={handleDownload}
          >Download</Button>

        </Flex>
      </Flex> : <Flex justify="center" align="middle" style={{height: 50}}>
        No Jacdac bus connected
        <Button style={{margin: 8}} type="primary" onClick={handleConnect}>Connect</Button>
      </Flex>}
    </Card>
  );
};

export default DevsDownloadCard;
