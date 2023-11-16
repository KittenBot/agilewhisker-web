import React, { useMemo, useState } from "react";
import {
  Host,
  compileWithHost,
  resolveBuildConfig,
} from "@devicescript/compiler";
import {
  JDBus,
  JDDevice,
  createWebBus,
  DeviceCatalog,
  DEVICE_ANNOUNCE,
  createWebSerialTransport,
  CONNECTION_STATE,
  ConnectionState,
  Transport,
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
      console.log("device", device);
      const spec = bus.deviceCatalog.specificationFromProductIdentifier(
        device.productIdentifier
      );
      console.log("spec", spec);
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
    <div className="Devs-download-card">
      <h3>{DevsName}</h3>
      <button onClick={handleConnect}>Connect</button>
      <button onClick={handleDownload} disabled={isDownloading}>
        {isDownloading ? "Downloading..." : "Download Script"}
      </button>
      {isDownloading && <p>Progress: {downloadProgress}%</p>}
    </div>
  );
};

export default DevsDownloadCard;
