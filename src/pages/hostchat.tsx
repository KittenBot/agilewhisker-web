import React, { useEffect, useMemo, useRef, useState } from "react";
import { debounce } from 'lodash';
import {FloatButton} from 'antd'
import { ChatMessage, ProChat, ProChatInstance } from '@ant-design/pro-chat';
import './hostchat.css';
import { LLMConfig, LLMConfigModal, LLMMsg } from "../components/Hostapp/llms";


const HostChat = () => {
  const chatRef = useRef<ProChatInstance>();
  const [llm, setLLM] = useState<LLMConfig>();
  const [llmEdit, setLLMEdit] = useState<LLMConfig>();

  const [hash, setHash] = useState<string>('0/0');
  const [promt, setPromt] = useState<string>('');
  const [context, setContext] = useState<LLMMsg[]>([]);
  const [settings, setSettings] = useState<any>({});

  
  useEffect(() => {
    const { get_settings, onUserText, onLoadLLM } = window.electronAPI;
    get_settings().then((settings: any) => {
      setSettings(settings);
    });
    onUserText((text: string) => {
      text = text.trim();
      console.log("input", text)
      text && chatRef.current?.sendMessage(text);
    });

    onLoadLLM((llm: LLMConfig) => {
      console.log("on llm loaded", llm)
      setLLM(llm);
      setContext(llm.context);
      setPromt(llm.system || 'You are a helpful assistant.');
      setHash(llm.id);
    });

    const param = new URLSearchParams(window.location.search);
    const id = param.get('id') // llmid/historyid
    setHash(id);
  }, []);

  const saveHistory = useMemo(() => {
    return (messages: LLMMsg[]) => {
      const { save_history } = window.electronAPI;
      save_history({ id: hash, history: messages });
    }
  }, [hash]);
  
  const handleSaveLLM = (values: any) => {
    if (values) {
        const { save_llm } = window.electronAPI;
        save_llm({id: values.id, llm: values});
        setLLM(values);
    }
    setLLMEdit(null);
  }
    

  const debouncedSaveHistory = debounce(saveHistory, 1000);

  return (
    <div style={{ padding: 16, background: 'white', height: '100vh' }}>
      <FloatButton className="llm-config-btn" onClick={() => setLLMEdit(llm)} />
      <LLMConfigModal 
          llm={llmEdit}
          isModalVisible={!!llmEdit}
          handleSave={handleSaveLLM}
      />
      {promt ? <ProChat
        chatRef={chatRef}
        initialChats={context as any}
        helloMessage={
          '欢迎使用 ProChat ，我是你的专属机器人，这是我们的 Github：[ProChat](https://github.com/ant-design/pro-chat)'
        }
        onChatsChange={(messages) => {
          console.log('onChatsChange', messages);
          debouncedSaveHistory(messages);
        }}
        request={async (inputValue) => {
          console.log('request', inputValue);
          const messages = inputValue.map((item) => {
            return {
              role: item.role,
              content: item.content
            }
          })
          if (llm.historyLength){
            // only keep the last Nx2 messages
            messages.splice(0, messages.length - llm.historyLength * 2);
            
          }
          const url = settings.openaiUrl || 'http://127.0.0.1:11434/v1/chat/completions'
          const res = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + settings.openaiKey
            },
            body: JSON.stringify({ 
              model: settings.openaiModel || 'llama2',
              messages: [
                {
                  role: 'system',
                  content: promt
                },
                ...messages
              ],
              stream: true
            })
          }); 
          if (!res.ok) {
            throw new Error('Failed to send message');
          }

          const reader = res.body?.getReader();
          const decoder = new TextDecoder();
          const encoder = new TextEncoder();
          let done = false;

          const readableStream = new ReadableStream({
            async start(controller) {
              while (!done) {
                const { value, done: _done } = await reader.read();
                done = _done;
                const _chunk = decoder.decode(value, { stream: true });
                let botMsg = '';
                const lines = _chunk.split('\n').filter((line) => line.trim());
                for (const line of lines) {
                  if (line.includes('[DONE]')) {
                    break;
                  } else if (line.startsWith('data: ')) {
                    const message = JSON.parse(line.substring(6));
                    if (message.choices && message.choices[0].delta?.content) {
                      const _txt: string = message.choices[0].delta.content;
                      botMsg += _txt;
                      controller.enqueue(encoder.encode(_txt));
                    }
                    // if (message.choices && message.choices[0].finish_reason === 'stop') {
                    //   done = true;
                    //   controller.close();
                    // }
                  }
                }

              } // end while
              controller.close();
            }
          });
          return new Response(readableStream);
        }}
      /> : null}

    </div>
  );
}

export default HostChat;

