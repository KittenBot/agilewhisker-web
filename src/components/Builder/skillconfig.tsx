import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Checkbox } from 'antd';
import { SkillEvent } from '@/lib/SkillBuild';
import { useSkillsStore } from '../../store/skillsStore';


export const SkillConfigModal = (props: {
  evt: SkillEvent,
  handleChange: (params: SkillEvent) => void,
}) => {
  const [form] = Form.useForm();
  const { evt, handleChange } = props
  const { skills } = useSkillsStore()
  const skill = skills.find(s => s.id == evt.id)
  
  const handleFinish = (values: any) => {
    const { params } = values
    // rebuild params
    const newParams: SkillEvent = Object.assign({}, evt)
    Object.entries(skill.params).forEach(([key, param]) => {
      if (!param.constant){
        newParams.params[key] = params[key]
      }
    })
    
    handleChange(newParams)
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
        {Object.entries(skill.params || {}).filter(([key, param]) => !param.constant && key !== 'KEY').map(([key, param]) => (
          <Form.Item
            key={key}
            label={param.description || key}
            name={['params', key]}
            initialValue={param.default}
            rules={[{ required: !param.constant, message: 'This field is required' }]}
          >
            <Input />
          </Form.Item>
        ))}
      </Form>
    </Modal>
  )
}