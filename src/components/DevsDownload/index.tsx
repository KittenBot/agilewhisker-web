import React, { useMemo, useState } from "react";
import { Button, Card, Flex, Typography } from 'antd';
import { Skill } from "@/remark/render-skill";

import {
  Host,
  compileWithHost,
  resolveBuildConfig,
} from "@devicescript/compiler";
import { DeviceScriptManagerCmd, OutPipe } from 'jacdac-ts';

import { useJacdacStore } from "../../store/jacdacStore";

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

const DevsDownloadCard = ({config}) => {

  const { bus, brainAvatar, devsService, deviceAvatar, connectJDBus } = useJacdacStore()
  const skill: Skill = useMemo(() => {
    return JSON.parse(config);
  }, [config]);

  const handleConnect = async () => {
    connectJDBus()
  }

  const handleDownload = async () => {
    
    console.log("download", skill);
    const host = new DevsHost({
      hwInfo: {
        progName: "DeviceScript-workspace devs/hello",
        progVersion: "6.0.0",
      },
      files: {
        "src/main.ts": skill.code,
      },
    });
    const result = compileWithHost("src/main.ts", host);
    console.log(result);
    if (result.success){
      let bytecode = result.binary
      await OutPipe.sendBytes(devsService, DeviceScriptManagerCmd.DeployBytecode, bytecode, p => {
        console.log("sending bytecode", p)
      })
    }
  };

  return (
    <Card hoverable style={{ width: 240, margin: 10 }} bodyStyle={{padding: 0, overflow: 'hidden'}}>
      { bus ? <Flex justify="space-between">
        { brainAvatar ? <img src={brainAvatar} style={{width: 96, height: 96}} /> : null }
        <Flex vertical align="flex-end" justify="space-between" style={{ padding: 32 }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            {deviceAvatar.map((img, i) => <img key={i} src={img} style={{width: 32, height: 32, margin: 4}} />)}
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
