import React, { useEffect, useState } from "react";
import { Input, Button, List, Typography } from "antd";
import ReactMarkdown from "react-markdown";

const { TextArea } = Input;

type Message = {
  content: string;
  role: string;
}

const HostChat = () => {
  const [context, setContext] = useState<Message[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { get_settings } = window.electronAPI;

  useEffect(() => {
    get_settings().then((settings: any) => {
      console.log("settings", settings);
      setSettings(settings);
    });
  }, []);

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

        while (!done) {
          const { value, done: _done } = await reader.read();
          done = _done;
          cacheRes += decoder.decode(value, { stream: true });
          let botMsg = '';
          const lines = cacheRes.split('\n').filter((line) => line.trim());
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const message = JSON.parse(line.substring(6));
              console.log(message);
              if (message.choices && message.choices[0].delta?.content) {
                const _txt: string = message.choices[0].delta.content;
                botMsg += _txt;
                const updatedMessages = [...messages, { content: botMsg, role: 'assistant' }];
                setContext(updatedMessages);
              }
            }
          }

        }
      } catch (error) {
        
      }

    }
  };

  return (
    <div style={{ padding: 16, background: 'white' }}>
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
      <Button type="primary" onClick={sendMessage} style={{ marginTop: 8 }}>
        Send
      </Button>

    </div>
  );
}

export default HostChat;

