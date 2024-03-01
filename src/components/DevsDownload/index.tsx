import React, { useEffect, useMemo, useState } from "react";
import BrowserOnly from '@docusaurus/BrowserOnly';
import { Alert, Button, Card, Flex, Progress, Divider, Form, Input } from 'antd';
import { Skill } from "@/remark/render-skill";


import { DeviceScriptManagerCmd, OutPipe } from 'jacdac-ts';

import { useJacdacStore } from "../../store/jacdacStore";
import CodeEditor from "../codeEditor";

const DevsDownloadCard = ({config}) => {

  const {connected} = useJacdacStore()
  const [code,setCode] = useState(JSON.parse(config).code)
  const handleChange = (value) => {
    setCode(value)
    skill.code = value
  }

  const skill: Skill = useMemo(() => {
    if (config)
      return JSON.parse(config);
  }, [config]);

  return (
    <>
      <Card hoverable style={{ width: '50vw', margin: 10 ,border: 'none'}} bodyStyle={{padding: 0, overflow: 'hidden',backgroundColor: 'var(--ifm-background-color)',border: '1px solid var(--ifm-color-emphasis-300)',borderRadius: '8px'}}>
        { connected ? <ConnectedState skill={skill}/>
        : <DisconnectState />
        }
      </Card>
      <CodeEditor defaultCode={code} onChange={handleChange} />
    </>
  );
};

const ConnectedState = ({skill}: {skill: Skill}) => {
  const { brainAvatar, devsService, deviceAvatar, brain, bus} = useJacdacStore()

  const [ downloadErr, setDownloadErr ] = useState('')
  const [ downloadProgress, setDownloadProgress ] = useState(0)

  const [compileWithHost, setCompileWithHost] = useState(null);

  const [params, setParams] = useState(skill.params || {})

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

    let code = skill.code

    for (const key in params) {
      const value = params[key]
      code = code.replace(new RegExp(`\\$${key}`, 'g'), value)
    }
    
    console.log("download", code);

    const host = new DevsHost({
      hwInfo: {
        // progName: "DeviceScript-workspace devs/hello",
        // progVersion: "6.0.0",
      },
      files: {
        "src/main.ts": code,
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


  return (<div style={{flex: 1, flexDirection: 'column',backgroundColor: 'var(--ifm-background-color)'}}>
    <Flex justify="space-between" style={{flexDirection:'column-reverse',padding:'0 16px 16px',color: 'var(--ifm-color-content)'}}>
      { brainAvatar ?
          <div style={{height:147,width:'118px',display:'flex',flexDirection:'column',backgroundColor:'#fff',borderRadius:'10px',justifyContent:'space-between'}}>
            <img src={brainAvatar} style={{width: 118, height: '',borderRadius:'10px'}} />
            <span style={{padding:'10px',color:'#1c1e21'}}>{brain?.name}</span> 
          </div>
        : 
          null 
      }
    <Flex vertical align="flex-end" justify="space-between" style={{ padding: 12, width: '100%' }}>
      <div style={{ width: '100%'}}>
        {deviceAvatar.map((img:any, i) => (
            <div key={i} style={{height:147,width:'118px',display:'flex',flexDirection:'column',backgroundColor:'#fff',borderRadius:'10px',justifyContent:'space-between'}}>
              <img src={img.img} style={{width: 118, height: '100px',borderRadius:'10px'}} />
              <span style={{padding:'10px'}}>{img?.name}</span> 
            </div>
          ))
        }
      </div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexDirection: 'row',width:'100%',color: 'var(--ifm-color-content)',marginLeft:'10px'}} >
        Connected !
        <div>
          <Button
            type="primary"
            danger
            style={{marginRight:'10px'}}
            onClick={()=> bus.disconnect()}
          >
            disconnect
          </Button>
          <Button
            type="primary"
            onClick={handleDownload}
          >
            🔥 Download Demo
          </Button>
        </div>
      </div>

    </Flex>
    </Flex>
    { skill.params && (
      <ParamsInput params={params} onChange={(key, value) => {
        setParams({...params, [key]: value})
      }} />
    )}
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
    <Divider>Parameters</Divider>
    <Form
      fields={Object.keys(params).map(key => ({name: key, value: params[key]}))}
      labelCol={{ span: 4 }}
      layout="horizontal"
      style={{maxWidth: 600}}
      onFieldsChange={(changedFields, allFields) => {
        onChange(changedFields[0].name[0], changedFields[0].value)
      }}
    >
      {Object.keys(params).map((key, i) => {
        const param = params[key]
        return <Form.Item key={i} name={key} label={key} >
          <Input />
        </Form.Item>
      })}
    </Form>
  </div>
}

export default DevsDownloadCard;
