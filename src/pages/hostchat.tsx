import React, { useEffect, useMemo, useRef, useState } from "react";
import { ProChat, ProChatInstance } from '@ant-design/pro-chat';

type Message = {
  content: string;
  role: string;
}

interface History {
  id: string;
  history: Message[];
}


const HostChat = () => {
  const chatRef = useRef<ProChatInstance>();
  const [hash, setHash] = useState<string>('0/0');
  const [context, setContext] = useState<Message[]>([]);
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    const { get_settings, onUserText, onLoadHistory } = window.electronAPI;
    get_settings().then((settings: any) => {
      setSettings(settings);
    });
    onUserText((text: string) => {
      chatRef.current?.sendMessage(text);
    });
    onLoadHistory((history: History) => {
      setContext(history.history);
      setHash(history.id);
      console.log("history", history)
    });
    const param = new URLSearchParams(window.location.search);
    const id = param.get('id') // llmid/historyid
    setHash(id);
    console.log("id", id)
  }, []);

  const saveHistory = useMemo(() => {
    const { save_history } = window.electronAPI;
    return (messages: Message[]) => {
      save_history({ id: hash, history: messages });
    }
  }, [hash]);


  return (
    <div style={{ padding: 16, background: 'white', height: '100vh' }}>
      <ProChat
        chatRef={chatRef}
        showTitle
        helloMessage={
          '欢迎使用 ProChat ，我是你的专属机器人，这是我们的 Github：[ProChat](https://github.com/ant-design/pro-chat)'
        }
        onChatsChange={(messages) => {
          console.log('onChatsChange', messages);
        }}
        request={async (inputValue) => {
          console.log('request', inputValue);
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
                ...inputValue
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
                    if (message.choices && message.choices[0].finish_reason === 'stop') {
                      done = true;
                      controller.close();
                    }
                  }
                }

              } // end while
              controller.close();
            }
          });
          return new Response(readableStream);
        }}
      />

    </div>
  );
}

export default HostChat;

