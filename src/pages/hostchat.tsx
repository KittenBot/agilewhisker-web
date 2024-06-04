import React, { useEffect, useMemo, useState } from "react";
import { Input, Button, List, Typography } from "antd";
import ReactMarkdown from "react-markdown";

const { TextArea } = Input;

type Message = {
  content: string;
  role: string;
}

interface History {
  id: string;
  history: Message[];
}


const HostChat = () => {
  const [hash, setHash] = useState<string>('0/0');
  const [context, setContext] = useState<Message[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const { get_settings, onUserText, onLoadHistory } = window.electronAPI;
    get_settings().then((settings: any) => {
      setSettings(settings);
    });
    onUserText((text: string) => {
      setInputValue(text);
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


  const sendMessage = async () => {
    if (inputValue.trim()) {
      setInputValue('');
      setIsLoading(true);

      const systemPrompt = 'The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.';

      const messages: Message[] = [
        ...context,
        { content: inputValue, role: 'user' }
      ]

      try {
        // openai api like call
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
              { role: 'system', content: systemPrompt },
              ...messages
            ],
            stream: true
          })
        });

        if (!res.ok) {
          throw new Error('Failed to send message');
        }

        setContext([
          ...context,
          { content: inputValue, role: 'user' }
        ]);

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let cacheRes = ''
        let done = false;
        let updatedMessages;

        while (!done) {
          const { value, done: _done } = await reader.read();
          console.log(value, _done);
          done = _done;
          cacheRes += decoder.decode(value, { stream: true });
          let botMsg = '';
          const lines = cacheRes.split('\n').filter((line) => line.trim());
          for (const line of lines) {
            console.log(line);
            if (line.includes('[DONE]')) {
              break;
            } else if (line.startsWith('data: ')) {
              const message = JSON.parse(line.substring(6));
              console.log(message);
              if (message.choices && message.choices[0].delta?.content) {
                const _txt: string = message.choices[0].delta.content;
                botMsg += _txt;
                updatedMessages = [...messages, { content: botMsg, role: 'assistant' }];
                setContext(updatedMessages);
              }
            }
          }

        }
        setIsLoading(false);
        saveHistory(updatedMessages)
        

      } catch (error) {
        
      }

    }
  };

  return (
    <div style={{ padding: 16, background: 'white', height: '100vh' }}>
      <List
        bordered
        dataSource={context}
        renderItem={(item) => (
          <List.Item style={{ color: item.role === 'user' ? 'blue' : 'green', fontWeight: item.role === 'user' ? 'bold' : 'normal' }}>
            <ReactMarkdown>{item.content}</ReactMarkdown>
          </List.Item>
        )}
        style={{ marginBottom: 16, maxHeight: 400, overflowY: 'auto' }}
      />
      <TextArea
        rows={4}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onPressEnter={sendMessage}
        placeholder="Type your message here..."
      />
      <Button
        type="primary"
        onClick={sendMessage}
        style={{ marginTop: 8 }}
        disabled={isLoading}
      >
        Send
      </Button>

    </div>
  );
}

export default HostChat;

