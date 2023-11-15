import React, { useState } from 'react';
import { 
    Host,
    compileWithHost,
    resolveBuildConfig,
} from '@devicescript/compiler'
import { DeviceScriptManagerCmd, OutPipe } from 'jacdac-ts';


// Device script implementation for kitten extension
export class DevsHost implements Host {
    private files: {};
    private cfg: any;
    bytecode: Uint8Array;
  
    constructor(opt: any = {}){
      this.files = opt.files || {}
      this.cfg = resolveBuildConfig()
      this.cfg.hwInfo = opt.hwInfo ||{
        progName: "hello",
        progVersion: "0.0.1",
      }
    }
  
    write(filename: string, contents: string | Uint8Array): void {
      this.files[filename] = contents;
    }
    read(filename: string): string {
      console.log("read", filename)
      if (this.files.hasOwnProperty(filename)) {
        return this.files[filename] as string;
      }
      throw new Error('No such file: ' + filename);
    }
    resolvePath(p: string) {
      return p;
    };
  
    log(msg: string): void {
      console.log(msg)
    }
  
    verifyBytecode(buf: Uint8Array): void {
      // TODO: vm to verify bytecode??
      this.bytecode = buf
      return
    }
  
    getConfig() {
      return this.cfg
    }
    
  }
  

const DevsDownloadCard = ({ DevsName, code }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const handleDownload = () => {
    console.log("download", code)
    const host = new DevsHost({
        hwInfo:{
            progName: 'DeviceScript-workspace devs/hello',
            progVersion: '6.0.0'
        },
        files: {
            'src/main.ts': code,
        },
    })
    const result = compileWithHost('src/main.ts', host)
    console.log(result)

    setIsDownloading(true);
    // simulate progress
    const interval = setInterval(() => {
      setDownloadProgress(oldProgress => {
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
      <button onClick={handleDownload} disabled={isDownloading}>
        {isDownloading ? 'Downloading...' : 'Download Script'}
      </button>
      {isDownloading && <p>Progress: {downloadProgress}%</p>}
    </div>
  );
};

export default DevsDownloadCard;
