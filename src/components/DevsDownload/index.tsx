import React, { useEffect, useMemo, useState } from "react";
import BrowserOnly from '@docusaurus/BrowserOnly';
import { Alert, Button, Card, Flex, Progress, Divider, Form, Input } from 'antd';
import { Skill } from "@/remark/render-skill";


import { DeviceScriptManagerCmd, OutPipe } from 'jacdac-ts';

import { useJacdacStore } from "../../store/jacdacStore";
import CodeEditor from "../codeEditor";
import { useDevsStore } from "../../store/devsStore";

import styles from './devs.module.css'

// only use this in remark skill render
const DevsDownloadCard = ({config}) => {
  const {
    code, params, setCode, setParams
  } = useDevsStore()

  useEffect(() => {
    try {
      const conf = JSON.parse(config)
      if (conf.code)
        setCode(conf.code)
      if (conf.params){
        setParams(conf.params)
      } else {
        setParams({})
      }
    } catch (error) {
      console.warn("Failed to parse config", error, config)
    }
  }, [config]);

  return (
    <>
      <Card hoverable style={{ width: '50vw', margin: 10 ,border: 'none'}} bodyStyle={{padding: 0, overflow: 'hidden',backgroundColor: 'var(--ifm-background-color)',border: '1px solid var(--ifm-color-emphasis-300)',borderRadius: '8px'}}>
        <JDConnection />
      </Card>
      <CodeEditor />
    </>
  );
};

export const JDConnection = () => {
  const { code, params, setParams } = useDevsStore()
  const {webSerialConnected, webSocketConnected} = useJacdacStore()

  const isConnected = webSerialConnected || webSocketConnected
  const { brainAvatar, devsService, deviceAvatar, spec, bus} = useJacdacStore()

  const [ downloadErr, setDownloadErr ] = useState('')
  const [ downloadProgress, setDownloadProgress ] = useState(0)

  const [compileWithHost, setCompileWithHost] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import("@kittenbot/devs_compiler").then(module => {
        setCompileWithHost(() => module.compileWithHost);
      });
    }
  }, []);

  const handleDownload = async () => {
    if (!compileWithHost) {
      console.error("Compiler not loaded");
      return;
    }
    
    const { DevsHost } = await import('./DevsHost'); // 路径需要根据你的项目结构调整
    let _code = code
    for (const key in params) {
      const value = params[key]
      _code = code.replace(new RegExp(`\\$${key}`, 'g'), value)
    }
    
    console.log("download", _code);

    const host = new DevsHost({
      hwInfo: {
        // progName: "DeviceScript-workspace devs/hello",
        // progVersion: "6.0.0",
      },
      files: {
        "src/main.ts": _code,
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

  if (!isConnected) return <DisconnectState />

return (<div style={{backgroundColor: 'var(--ifm-background-color)'}}>
    <Flex justify="space-between" style={{padding:'0 16px 16px',color: 'var(--ifm-color-content)'}}>
      <div style={{ width: '100%', display: 'flex'}}>
        {deviceAvatar.map((img:any, i) => (
            <div key={i} style={{height:147,width:'118px',display:'flex',flexDirection:'column',backgroundColor:'#fff',borderRadius:'10px',justifyContent:'space-between', margin: 5}}>
              <img src={img.img} style={{width: 118, height: '100px',borderRadius:'10px'}} />
              <span style={{padding:'10px'}}>{img?.name}</span> 
            </div>
          ))
        }
      </div>
      { brainAvatar ?
          <div style={{height:147,width:250,display:'flex',flexDirection:'column',backgroundColor:'#fff',borderRadius:'10px',justifyContent:'space-between', margin: 5}}>
            <img src={brainAvatar} style={{width: 118, height: '',borderRadius:'10px'}} />
            <span style={{padding:'10px',color:'#1c1e21'}}>{spec?.name}</span> 
          </div>
        : 
          null 
      }
    </Flex>
    <Flex vertical align="flex-end" justify="space-between" style={{ padding: 12, width: '100%' }}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexDirection: 'row',width:'100%',color: 'var(--ifm-color-content)',marginLeft:'10px'}} >
        Connected to {webSerialConnected ? 'USB' : 'WebSocket'}
        <div>
          <Button
            type="primary"
            danger
            style={{marginRight:'10px'}}
            onClick={()=> bus.disconnect()}
          >
            Disconnect
          </Button>
          <Button
            type="primary"
            onClick={() => handleDownload()}
          >
            🔥 Download
          </Button>
        </div>
      </div>
    </Flex>
    { Object.keys(params).length > 0 ?
      <ParamsInput params={params} onChange={(key, value) => {
        setParams({...params, [key]: value})
      }} /> : null
    }
    { downloadErr && (
      <Alert message={downloadErr} type="error" closable afterClose={() => setDownloadErr('')} />
    )}
    { downloadProgress > 0 && (
      <Progress percent={downloadProgress} size="small" />
    )}
  </div>)
}

export const DisconnectState = ({ usbConnect }: { usbConnect?: boolean }) => {

  const {connectJDBus} = useJacdacStore()

  const handleConnect = async () => {
    connectJDBus(usbConnect)
  }

  return <Flex justify='space-between' align="center"  style={{height: 50,backgroundColor: 'var(--ifm-background-color)',color: 'var(--ifm-color-content)'/*,border: '1px solid var(--ifm-toc-border-color)'*/,borderRadius: '8px',padding:'0 20px'}}>
    No Jacdac bus connected
    <Button style={{margin: 8}} type="primary" onClick={handleConnect}>Connect</Button>
  </Flex>
}

const ParamsInput = ({params, onChange}: {params: Record<string, string>, onChange: any }) => {

  return <div style={{padding: 12}}>
    <Form
      fields={Object.keys(params).map(key => ({name: key, value: params[key]}))}
      labelCol={{ span: 4 }}
      layout="horizontal"
      style={{maxWidth: 600, color: 'var(--ifm-color-content)'}}
      onFieldsChange={(changedFields, allFields) => {
        onChange(changedFields[0].name[0], changedFields[0].value)
      }}
    >
      {Object.keys(params).map((key, i) => {
        return <Form.Item 
          key={i}
          name={key}
          label={<span className={styles.formItemLabel}>{key}</span>}
          className={styles.formItem}
        >
          <Input />
        </Form.Item>
      })}
    </Form>
  </div>
}

export default DevsDownloadCard;
