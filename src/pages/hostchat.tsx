import React, { useState } from "react";
import { Input, Button, List, Typography } from "antd";
import ReactMarkdown from "react-markdown";

const { TextArea } = Input;

type Message = {
  content: string;
  role: string;
}

const HostChat = () => {
  const [context, setContext] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    if (inputValue.trim()) {
      setInputValue('');
      setIsLoading(true);

      const systemPrompt = 'The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.';

      const messages: Message[] = [
        { content: systemPrompt, role: 'assistant' },
        ...context,
        { content: inputValue, role: 'user' }
      ]

      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
          body: JSON.stringify({ 
            model: 'gpt-3.5-turbo',
            messages,
            stream: true
          })
        });

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let cacheRes = ''
        let botMsg = '';
        let done = false;

        while (!done) {
          const { value, done: _done } = await reader.read();
          done = _done;
          cacheRes += decoder.decode(value, { stream: true });

          const lines = cacheRes.split('\n').filter((line) => line.trim());
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const message = JSON.parse(line.substring(6));
              console.log(message);
              if (message.choices && message.choices[0].delta) {
                const _txt: string = message.choices[0].delta.content;
                botMsg += _txt;
                console.log(">>>>>", _txt);
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
          <List.Item>
            <Typography.Text strong style={{ color: item.role === 'user' ? 'blue' : 'green' }}>
              {item.role === 'user' ? 'User' : 'Bot'}:
            </Typography.Text>
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

