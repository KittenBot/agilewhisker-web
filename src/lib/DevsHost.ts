import {
    Host,
    resolveBuildConfig,
  } from "@kittenbot/devs_compiler";

import extrea_services from './services.json'

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
      this.cfg.addServices = extrea_services
      this.cfg.services = [...this.cfg.services, ...extrea_services]
    }
  
    write(filename: string, contents: string | Uint8Array): void {
      console.log("write", filename)
      this.files[filename] = contents;
    }
    read(filename: string): string {
      console.log("read", filename)
      if (this.files.hasOwnProperty(filename)) {
        return this.files[filename] as string;
      }
      throw new Error("No such file: " + filename);
    }
    resolvePath(p: string) {
      console.log("resolve", p)
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