import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Checkbox } from 'antd';
import { SkillEvent } from '@/lib/SkillBuild';
import { useSkillsStore } from '../../store/skillsStore';


export const SkillConfigModal = (props: {
  evt: SkillEvent,
  handleChange: (skill) => void,
}) => {
  const [form] = Form.useForm();
  const { evt, handleChange } = props
  const { skills } = useSkillsStore()
  const skill = skills.find(s => s.id == evt.id)
  
  const handleFinish = (values: any) => {
    console.log("finish",values)
  };

  const onClose = () => {
    handleChange(null)
  }

  return (
    <Modal title="Skill Configuration"
      open={!!evt}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Submit
        </Button>,
      ]}
    >
      <p>Configuration for {skill.name} @ {evt.key}</p>
      <Form
        form={form}
        layout="vertical"
        initialValues={{ params: evt.params }}
        onFinish={handleFinish}
      >
        {Object.entries(skill.params || {}).map(([key, param]) => (
          <Form.Item
            key={key}
            label={param.description || key}
            name={['params', key]}
            initialValue={param.default}
            rules={[{ required: !param.editable, message: 'This field is required' }]}
          >
            {(param.editable === false || key == 'KEY' )? (
              <Input disabled={true} />
            ) : (
              <Input />
            )}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  )
}