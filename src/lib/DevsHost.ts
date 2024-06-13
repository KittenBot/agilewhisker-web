import {
    Host,
    resolveBuildConfig,
  } from "@kittenbot/devs_compiler";

import extrea_services from './services.json'


const keyboarUtils = `
import * as ds from "@devicescript/core";
import { throttleTime } from "@devicescript/observables";
import { SSD1306Driver } from "@devicescript/drivers";

const kb = new ds.KeyboardClient()
const settings = new ds.Settings()

const _keyCallbacks: { [key: number]: () => Promise<void> } = {};
const regKey = function(keyCode: number, callback: () => Promise<void>): void {
    _keyCallbacks[keyCode] = callback;
}

const hidEnable = async (en: boolean) => {
  const b = Buffer.alloc(1)
  b[0] = en ? 1 : 0
  await settings.set("hidscan", b)
}

kb.down.pipe(throttleTime(500)).subscribe(async (key) => {
    if (_keyCallbacks[key]) {
        await _keyCallbacks[key]();
    } else {
        console.log(\`Unhandled\`, key);
    }
});

async function startOLED(){
  const oled = new SSD1306Driver({
    width: 128,
    height: 64,
    devAddr: 0x3c as any,
  })
  await oled.start()
  return oled
}

export {
  kb,
  regKey,
  hidEnable,
  startOLED
}

`

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
      this.files["src/keyboarUtils.ts"] = keyboarUtils
    }
  
    write(filename: string, contents: string | Uint8Array): void {
      // console.log("write", filename)
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
      // console.log("resolve", p)
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