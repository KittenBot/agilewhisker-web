import React, { useState, useEffect, useMemo } from 'react';
import { Form, Input, List, FloatButton, Modal, Card, Row } from 'antd';
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

    useEffect(() => {
        if (props.llm) {
            form.setFieldsValue(props.llm);
        }
    }, [props.llm]);

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
            title="LLM Robot"
            open={props.isModalVisible}
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
                    rules={[{ message: 'Please input the title!' }]}
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
                    name="system"
                    label="System Prompt"
                    rules={[{ required: true, message: 'Please input the system prompt!' }]}
                >
                    <Input.TextArea placeholder="Enter the system prompt" />
                </Form.Item>
            </Form>
        </Modal>
    )

}

const LLMCard = ({config, onSelect}: {
    config: LLMConfig,
    onSelect: (cfg: LLMConfig) => void
}) => {
    return (
        <Card
            title={config.title}
            bordered={false}
            hoverable
            extra={<a onClick={() => onSelect(config)}>Edit</a>}
        >
            <Row justify="space-between" align='middle'>
                <p>{config.system.length > 24 ? config.system.slice(0, 24) + '...' : config.system}</p>


            </Row>

        </Card>
    )
}


const LLMS: React.FC = () => {
    const [llms, setLlms] = useState<LLMConfig[]>([]);
    const [currentLLM, setCurrentLLM] = useState<LLMConfig | null>(null);

    const refreshLLM = useMemo(() => {
        const { list_llm } = window.electronAPI;
        return () => {
            list_llm().then((ret) => {
                console.log("llms", ret);
                const llms = ret.llms as LLMConfig[]
                const history = ret.history as Record<string, string[]>
                setLlms(llms);
            });
        }
    }, []);
    useEffect(() => {
        refreshLLM();
    }, []);

    const handleAdd = () => {
        setCurrentLLM({
            id: 'new_robot',
            title: '',
            context: []
        })
    }

    const handleSaveLLM = (values: any) => {
        if (values) {
            const { save_llm } = window.electronAPI;
            save_llm({id: values.id, llm: values}).then(() => {
                refreshLLM();
            });
        }
        setCurrentLLM(null);
    }

    const handleCardClick = (config: LLMConfig) => {
        setCurrentLLM(config)
    }

    return (
        <div>
            <h1>LLMS</h1>
            <List
                grid={{ gutter: 8, column: 2 }}
                dataSource={llms}
                renderItem={(llm: LLMConfig) => (
                    <List.Item key={llm.id}>
                        {/* <List.Item.Meta
                            title={<a onClick={
                                async () => {
                                    const _conf = await get_llm(llm)
                                    setCurrentLLM(_conf)
                                }
                            }>{llm}</a>}
                        /> */}
                        <LLMCard config={llm} onSelect={handleCardClick}/>
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