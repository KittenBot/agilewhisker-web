import React, { useState, useEffect } from 'react';
import { Form, Input, List, FloatButton, Modal } from 'antd';
import {
    AppstoreAddOutlined
} from '@ant-design/icons';

interface LLMMsg {
    role: string;
    content: string;
}

interface LLMConfig {
    id: string; // file name
    title: string;
    description?: string;
    system?: string; // system prompt
    context: LLMMsg[];
  }
  

interface LLMConfigProps {
    llm: LLMConfig,
    isModalVisible: boolean;
    handleSave: (values: any) => void;
}

const LLMConfig = (props: LLMConfigProps) => {
    const [form] = Form.useForm();

    const handleOk = () => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            console.log(values)
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
        props.handleSave(form.getFieldsValue());
    };

    const handleCancel = () => {
        form.resetFields();
        props.handleSave(null);
    }

    return (
        <Modal
            title="Create LLM Robot"
            visible={props.isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <Form
            form={form}
            layout="vertical"
            name="create_llm_robot"
            initialValues={{ remember: true }}
            >
                <Form.Item
                    name="id"
                    label="ID"
                    rules={[{ required: true, message: 'Please input the id!' }]}
                >
                    <Input placeholder="Enter the id, filename to save" />
                </Form.Item>
                <Form.Item
                    name="title"
                    label="Title"
                    rules={[{ required: true, message: 'Please input the title!' }]}
                >
                    <Input placeholder="Enter the title" />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ message: 'Please input the description!' }]}
                >
                    <Input.TextArea placeholder="Enter the description" />
                </Form.Item>
                <Form.Item
                    name="systemPrompt"
                    label="System Prompt"
                    rules={[{ required: true, message: 'Please input the system prompt!' }]}
                >
                    <Input.TextArea placeholder="Enter the system prompt" />
                </Form.Item>
            </Form>
        </Modal>
    )

}


const LLMS: React.FC = () => {
    const { list_llm, get_llm, save_llm } = window.electronAPI;
    const [llms, setLlms] = useState<string[]>([]);
    const [currentLLM, setCurrentLLM] = useState<LLMConfig | null>(null);

    useEffect(() => {
        list_llm().then((llms: string[]) => {
            console.log("llms", llms);
            setLlms(llms);
        });
    }, []);

    const handleAdd = () => {
        setCurrentLLM({
            id: 'new_robot',
            title: 'New LLM Robot',
            context: []
        })
    }

    const handleSaveLLM = (values: any) => {
        if (values) {
            save_llm(values.id, values).then(() => {
                list_llm().then((llms: string[]) => {
                    console.log("llms", llms);
                    setLlms(llms);
                });
            });
        }
        setCurrentLLM(null);
    }

    return (
        <div>
            <h1>LLMS</h1>
            <List
                itemLayout='horizontal'
                dataSource={llms}
                renderItem={(llm: string) => (
                    <List.Item key={llm}>
                        {llm}
                    </List.Item>
                )}
            />
            <LLMConfig 
                llm={currentLLM}
                isModalVisible={!!currentLLM}
                handleSave={handleSaveLLM}
            />
            <FloatButton
                onClick={handleAdd}
                icon={<AppstoreAddOutlined />}
                type='primary'
                description="ADD"
                shape="circle"
                style={{ right: 24 }}
            />
        </div>

    )
}

export default LLMS;