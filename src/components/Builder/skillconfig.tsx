import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Checkbox, Switch, AutoComplete } from 'antd';
import { SkillEvent, SkillParam } from '@/lib/SkillBuild';
import { useSkillsStore } from '../../store/skillsStore';


const SkillInputList = (props: {
  param: SkillParam
}) => {
  const [options, setOptions] = useState([])
  useEffect(() => {
    let values = props.param.values
    if (typeof values === 'string' && values.startsWith('http')){
      fetch(values).then(res => res.json()).then(data => {
        setOptions(data.map((value: string) => ({ value })))
      })
    } else if (Array.isArray(values)){
      setOptions(values.map((value: string) => ({ value })))
    }
  }, [])

  return (
    <AutoComplete
      options={options}
      filterOption={(inputValue, option) =>
        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
      }
    />
  )
}

export const SkillConfigModal = (props: {
  evt: SkillEvent,
  handleChange: (params: SkillEvent) => void,
  handleDelete: (params: SkillEvent) => void
}) => {
  const [form] = Form.useForm();
  const { evt, handleChange, handleDelete } = props
  const { skills, getSkill } = useSkillsStore()
  const skill = getSkill(evt.id)
  
  const handleFinish = (values: any) => {
    const { params } = values
    // rebuild params
    const newParams: SkillEvent = Object.assign({}, evt)
    Object.entries(skill.params).forEach(([key, param]) => {
      if (!param.constant && params[key] !== undefined){
        newParams.params[key] = params[key]
      }
    })
    console.log(newParams)
    handleChange(newParams)
  };

  const onClose = () => {
    handleChange(null)
  }

  const onDelete = () => {
    handleDelete(evt)
  }

  return (
    <Modal title="Skill Configuration"
      open={!!evt}
      onCancel={onClose}
      footer={[
        <Button key="delete" onClick={onDelete} danger>
          Delete
        </Button>,
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
        {Object.entries(skill.params || {}).filter(([key, param]) => !param.constant && key !== 'KEY').map(([key, param]) => {
          console.log(key, param)
          return (<Form.Item
            key={key}
            label={param.description || key}
            name={['params', key]}
            initialValue={param.default}
            rules={[{ required: !param.constant, message: 'This field is required' }]}
            valuePropName={param.type === 'boolean' ? 'checked' : 'value'}
          >
            {param.type === 'boolean' && <Switch />}
            {param.type === 'string' && <Input />}
            {param.type === 'list' && <SkillInputList param={param} />}
          </Form.Item>)
        })}
      </Form>
    </Modal>
  )
}