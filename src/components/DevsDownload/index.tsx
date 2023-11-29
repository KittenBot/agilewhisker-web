import React, { useEffect, useMemo, useState } from "react";
import BrowserOnly from '@docusaurus/BrowserOnly';
import { Alert, Button, Card, Flex, Progress, Divider, Form } from 'antd';
import { Skill } from "@/remark/render-skill";


import { DeviceScriptManagerCmd, OutPipe } from 'jacdac-ts';

import { useJacdacStore } from "../../store/jacdacStore";



const DevsDownloadCard = ({config}) => {

  const {connected} = useJacdacStore()

  const skill: Skill = useMemo(() => {
    if (config)
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

  const [compileWithHost, setCompileWithHost] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@devicescript/compiler').then(module => {
        setCompileWithHost(() => module.compileWithHost);
      });
    }
  }, []);


  const handleDownload = async () => {
    if (!compileWithHost) {
      console.error("Compiler not loaded");
      return;
    }
    
    console.log("download", skill);
    const { DevsHost } = await import('./DevsHost'); // 路径需要根据你的项目结构调整

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
