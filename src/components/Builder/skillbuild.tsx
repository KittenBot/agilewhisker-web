import React, { useEffect, useState } from 'react';
import Wrapper from "@theme/Layout";

import { Avatar, Card, Row, Col, Layout, Menu, Button, Progress, Pagination, Input, Modal, message, Tooltip, Divider, List } from 'antd';
import {
  CodeOutlined,
  PlusOutlined,
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  SearchOutlined,
  PlaySquareOutlined,
  YoutubeOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';
import styles from './skillbuild.module.css';
import { useSkillsStore } from '../../store/skillsStore';
import { useDevsStore } from '../../store/devsStore';
import CodeEditor from '../codeEditor';
import { useJacdacStore } from '../../store/jacdacStore';
import { parseColoredText } from '../../lib/codeparse';

import Elite60 from '../Hardware/Elite60'
import NumberPad from '../Hardware/NumPad';
import { SkillEvent, SkillCategory } from '@/lib/SkillBuild';
import { SkillConfigModal } from './skillconfig';

const { Sider, Content } = Layout;
const { SubMenu } = Menu;


const SkillBuild = (props: {
  skills: Record<string, SkillCategory>
}) => {
  const [userCode, setUserCode] = useState('')
  const [showCode, setShowCode] = useState(false)
  const [messageApi, contextHolder] = message.useMessage();
  const [editingEvt, setEditingEvt] = useState<SkillEvent>(null)
  const { addEvent, getSkill, saveEvent, deleteEvent, generate, build, builds, skills, load, loadSkills } = useSkillsStore()
  const { downloadProgress, downloadErr, downloadDevs, webSerialConnected, webSocketConnected, brainAvatar, spec, connectJDBus } = useJacdacStore()
  const isConnected = webSerialConnected || webSocketConnected

  useEffect(() => {
    loadSkills(props.skills)
    console.log("skills", skills);
  }, [props.skills])

  const { compileWithHost } = useDevsStore()

  const handleCompile = async () => {
    const code = generate()
    console.log(code)
    const result = await compileWithHost(code)
    console.log(result)
    if (!result.success){
      messageApi.error('Compile failed')
      return
    }
    // download
    
  }

  const handleShowCode = async () => {
    const code = generate()
    setUserCode(code)
    setShowCode(true)
  }

  const handleDownload = async () => {
    const ret = await compileWithHost(userCode)
    console.log(ret)
    if (ret.success){
      const _err = await downloadDevs(ret.binary)
      if (_err){
        messageApi.error(_err)
      } else {
        messageApi.success('Download success')
      }
    } else {
      const _err = ret.diagnostics[0].formatted;
      const formattedText = parseColoredText(_err);

      messageApi.error(<pre style={{ background: '#f6f6f6', padding: '10px' }}>{formattedText}</pre>)
    }
  }

  const handleCancel = () => {
    setShowCode(false)
  }

  const handleChange = (value) => {
    setUserCode(value)
  }

  const handleSkillChanged = (evt: SkillEvent) => {
    setEditingEvt(null)
    if (evt){
      saveEvent(evt)
    }
  }

  const handleSkillDelete = (evt: SkillEvent) => {
    setEditingEvt(null)
    deleteEvent(evt)
  }

  const handleAddSkill = (id, key, accept) => {
    const skill = getSkill(id)
    if (!skill) {
      message.error('Skill not found')
      return
    }
    if (accept && skill.target && accept !== skill.target) {
      message.error(`Skill won't work on ${accept}, need ${skill.target}`)
      return
    }
    let _key = key
    if (typeof key !== 'string'){
      // SkillEvtParam
      _key = key.text
    }
    const _evt: SkillEvent = {
      id,
      key: _key,
      params: {},
    }
    // fill in default params
    if (skill.params){
      for (const key in skill.params){
        _evt.params[key] = skill.params[key].default
      }
    }
    if (skill.params?.KEY){
      // calc key map to devs HID key?
      _evt.params.KEY = key
    }
    if (skill.thumbnail){
      _evt.thumbnail = skill.thumbnail
    }
    addEvent(_evt)
  }

  const handleKeyClick = (key) => {
    // find skillevt with key
    console.log("key click", key)
    const evt = build.events.find((e) => e.key === key)
    if (!evt){
      console.log("no event found", key)
      return
    }
    setEditingEvt(evt)
  }

  return (
    // <Wrapper title="Skill Builder">
    <Layout className={styles.layout}>
      {contextHolder}
      <Sider className={styles.sider}>
        <Menu mode="vertical" className={styles.menu}>
          {builds.map((_id) => (
            <Menu.Item 
              key={_id}
              className={build?.id === _id ? styles.activeMenuItem : ''}
              onClick={() => load(_id)}
            >{_id}</Menu.Item>
          ))}
        </Menu>
        <div className={styles.deviceSection}>
          <Menu mode="vertical" className={styles.deviceMenu}>
            <Menu.Item key="device" className={styles.deviceMenuTitle} icon={<SettingOutlined />}>
              Deivce
            </Menu.Item>
            {spec? <Menu.Item key="device0" icon={
              <Avatar
                size="small"
                src={brainAvatar}
              />
            }>{spec.name}</Menu.Item> : 
            <Menu.Item key="connect">
              <Button type="primary" onClick={() => connectJDBus()}>Connect</Button>
            </Menu.Item>
            }
          </Menu>
        </div>
      </Sider>
      <Content className={styles.content}>
        <div className={styles.topBar}>
          <Button
            type='primary'
            shape='circle'
            icon={<PlusOutlined />}
            className={styles.topBarButton}
          />
          <div>
          <Button icon={<CodeOutlined />} className={styles.topBarButton} onClick={handleShowCode} />
          <Button icon={<PlaySquareOutlined />} className={styles.topBarButton} onClick={handleCompile}/>
          </div>
        </div>
        {spec?.id === 'kittenbot-agilewhiskernumerickeypadv10' && <NumberPad 
          onDrop={handleAddSkill}
          onClick={handleKeyClick}
          build={build}
        />}
        {spec?.id === 'kittenbot-agilewhiskerkeyboardelite60v10' && <Elite60
          onDrop={handleAddSkill}
          onClick={handleKeyClick}
          build={build}
        />}
        <Divider>Modules</Divider>
        <List>
          
        </List>
      </Content>
      <Sider className={styles.rightSider}>
        <Menu
          className={styles.menu}
          mode="inline"
        >
          {Object.entries(skills).map(([id, category]) => (
            <SubMenu
              key={id}
              title={category.name}
              icon={category.thumbnail ? <Avatar src={category.thumbnail} size='small' shape='square'/> : null}
            >
              {Object.entries(category.skills).map(([id, skill]) => (
                <Menu.Item key={id} draggable 
                  onDragStart={(e) => {
                    e.dataTransfer.setData('id', id)
                  }}
                  icon={skill.thumbnail ? <Avatar src={skill.thumbnail} size='small' shape='square'/> : null}
                >
                  <Tooltip title={skill.description}>
                  {skill.name}
                  </Tooltip>
                </Menu.Item>
              ))}
            </SubMenu>
          ))}
        </Menu>
      </Sider>
      <Modal
        title="Generated Code"
        open={showCode}
        onCancel={handleCancel}
        footer={[
          <Button key="submit" type="primary" onClick={handleDownload}>
            Download
          </Button>,
        ]}
      >
        <p>Code Editor</p>
        { downloadProgress > 0 && (
          <Progress percent={downloadProgress} showInfo={false} />
        )}
        <CodeEditor
          code={userCode}
          onChange={handleChange}
        />
      </Modal>
      {editingEvt && <SkillConfigModal
        evt={editingEvt}
        handleChange={handleSkillChanged}
        handleDelete={handleSkillDelete}
      />}
    </Layout>
    // </Wrapper>
  );
};

export default SkillBuild;