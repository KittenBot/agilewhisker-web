import React, { useMemo, useState } from "react";
import { Alert, Button, Card, Flex, Progress, Divider, Form } from 'antd';
import { Skill } from "@/remark/render-skill";

import {
  Host,
  compileWithHost,
  resolveBuildConfig,
} from "@devicescript/compiler";
import { DeviceScriptManagerCmd, OutPipe } from 'jacdac-ts';

import { useJacdacStore } from "../../store/jacdacStore";
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

const DevsDownloadCard = ({config}) => {

  const {connected} = useJacdacStore()

  const skill: Skill = useMemo(() => {
    return JSON.parse(config);
  }, [config]);

  return (
    <Card hoverable style={{ width: '50vw', margin: 10 }} bodyStyle={{padding: 0, overflow: 'hidden'}}>
      { connected ? <ConnectedState skill={skill}/>
       : <DisconnectState />
      }
    </Card>
  );
};

const ConnectedState = ({skill}) => {
  const { brainAvatar, devsService, deviceAvatar } = useJacdacStore()

  const [ downloadErr, setDownloadErr ] = useState('')
  const [ downloadProgress, setDownloadProgress ] = useState(0)

  const handleDownload = async () => {
    
    console.log("download", skill);
    const host = new DevsHost({
      hwInfo: {
        // progName: "DeviceScript-workspace devs/hello",
        // progVersion: "6.0.0",
      },
      files: {
        "src/main.ts": skill.code,
      },
    });
    const result = compileWithHost("src/main.ts", host);
    console.log(result);
    if (result.success){
      let bytecode = result.binary
      try {
        await OutPipe.sendBytes(devsService, DeviceScriptManagerCmd.DeployBytecode, bytecode, p => {
          setDownloadProgress(p*100)
        })
        setTimeout(() => {
          setDownloadProgress(0)
        }, 1000)
        
      } catch (error) {
        setDownloadProgress(0)
        setDownloadErr(error.toString())
      }
      
    } else {
      setDownloadErr(result.diagnostics[0].messageText.toString())
    }
  };


  return (<div style={{flex: 1, flexDirection: 'column'}}><Flex justify="space-between">
    { brainAvatar ? <img src={brainAvatar} style={{width: 96, height: 96}} /> : null }
    <Flex vertical align="flex-end" justify="space-between" style={{ padding: 12, width: '100%' }}>
      <div style={{ width: '100%'}}>
        {deviceAvatar.map((img, i) => <img key={i} src={img} style={{width: 32, height: 32, margin: 2}} />)}
      </div>
      <Button
        type="primary"
        onClick={handleDownload}
      >Download</Button>

    </Flex>
    </Flex>
    { skill.params && (
      <ParamsInput params={skill.params} />
    )}
    { downloadErr && (
      <Alert message={downloadErr} type="error" closable afterClose={() => setDownloadErr('')} />
    )}
    { downloadProgress > 0 && (
      <Progress percent={downloadProgress} size="small" />
    )}
  </div>)
}

const DisconnectState = () => {

  const {connectJDBus} = useJacdacStore()

  const handleConnect = async () => {
    connectJDBus()
  }

  return <Flex justify="center" align="middle" style={{height: 50}}>
    No Jacdac bus connected
    <Button style={{margin: 8}} type="primary" onClick={handleConnect}>Connect</Button>
  </Flex>
}

const ParamsInput = ({params}: {params: Record<string, string>}) => {
  console.log("params", params)
  return <div style={{padding: 12}}>
    <Divider>Parameters</Divider>
    <Form
      labelCol={{ span: 4 }}
      layout="horizontal"
      style={{maxWidth: 600}}
    >
      {Object.keys(params).map((key, i) => {
        const param = params[key]
        return <Form.Item key={i} label={key}>
          <input type="text" defaultValue={param} />
        </Form.Item>
      })}
    </Form>
  </div>
}

export default DevsDownloadCard;
