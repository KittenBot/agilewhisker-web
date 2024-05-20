import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';

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
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Please input your username!' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please input your email!' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="serverUrl" label="Server URL" rules={[{ required: true, message: 'Please input the server URL!' }]}>
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Settings;