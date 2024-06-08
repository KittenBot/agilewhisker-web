import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';

export interface SettingsProps {
  mqttbroker: string;
  mqtttopic: string;
  openaiUrl: string;
  openaiKey: string;
  openaiModel: string;
}

const Settings: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { get_settings, save_settings } = window.electronAPI;

  useEffect(() => {
    get_settings().then((settings: any) => {
      form.setFieldsValue(settings);
    });
  }, [form]);

  const onFinish = (values: any) => {
    setLoading(true);
    save_settings(values).then(() => {
      setLoading(false);
      message.success('Settings saved successfully');
    }).catch((error) => {
      setLoading(false);
      message.error('Failed to save settings');
    });
  };

  return (
    <div>
    <h1>Settings</h1>
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item name="mqttbroker" label="Mqtt-Broker" rules={[{ required: true, message: 'The mqtt borker' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="mqtttopic" label="Mqtt-Topic" rules={[{ required: true, message: 'The mqtt topic' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="openaiKey" label="OpenAI Key" rules={[{ required: true, message: 'The openai key' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="openaiModel" label="OpenAI Model" rules={[{ required: true, message: 'The openai model' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="openaiUrl" label="OpenAI URL" rules={[{ required: true, message: 'The openai url' }]}>
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Save
        </Button>
      </Form.Item>
    </Form>
    </div>
  );
};

export default Settings;