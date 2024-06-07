import React, { useEffect, useState } from 'react';
import Wrapper from "@theme/Layout";

import { Avatar, Card, Row, Col, Layout, Menu, Button, Progress, Pagination, Input, Modal, message } from 'antd';
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
import { useSkillsStore } from '../store/skillsStore';
import { useDevsStore } from '../store/devsStore';
import CodeEditor from '../components/CodeEditor';
import { useJacdacStore } from '../store/jacdacStore';
import { parseColoredText } from '../lib/codeparse';

const { Sider, Content } = Layout;
const { SubMenu } = Menu;

const SkillConfigModal = (props: {
  skill: any,
  handleChange: (skill) => void,
}) => {
  const { skill, handleChange } = props

  return (
    <Modal title="Skill Configuration" open={!!skill} onOk={() => handleChange(skill)} onCancel={() => handleChange(null)}>
      <p>Configuration for</p>
    </Modal>
  )
}

const SkillBuild = () => {
  const [userCode, setUserCode] = useState('')
  const [showCode, setShowCode] = useState(false)
  const [messageApi, contextHolder] = message.useMessage();
  const [editingSkill, setEditingSkill] = useState(null)
  const { generate, builds, skills, load, current } = useSkillsStore()
  const { downloadProgress, downloadErr, downloadDevs, webSerialConnected, webSocketConnected, brainAvatar, spec, connectJDBus } = useJacdacStore()
  const isConnected = webSerialConnected || webSocketConnected

  const { compileWithHost } = useDevsStore()
  useEffect(() => {
    if (builds.length > 0) {
      load(builds[0])
    }
  }, [builds])

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

  const showConfigModal = (skill) => {
    setEditingSkill(skill)
  }

  const handleSkillChanged = (skill) => {
    console.log(skill)
    setEditingSkill(null)
  }

  return (
    // <Wrapper title="Skill Builder">
    <Layout className={styles.layout}>
      {contextHolder}
      <Sider className={styles.sider}>
        <Menu mode="vertical" className={styles.menu}>
          {builds.map((build) => (
            <Menu.Item 
              key={build}
              className={build === current ? styles.activeMenuItem : ''}
              onClick={() => load(build)}
            >{build}</Menu.Item>
          ))}
          <Menu.Item key="new" className={styles.newMenuItem}>
            <PlusOutlined />
            New Build
          </Menu.Item>
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
          <Input
            className={styles.searchInput}
            placeholder="Search"
            prefix={<SearchOutlined />}
          />
          <div>
          <Button icon={<CodeOutlined />} className={styles.topBarButton} onClick={handleShowCode} />
          <Button icon={<PlaySquareOutlined />} className={styles.topBarButton} onClick={handleCompile}/>
          </div>
        </div>
        <Row gutter={[4, 4]}>

          {skills.map((skill) => (
            <Col key={skill.id} span={6}>
              <Card
                className={styles.skillCard}
                hoverable
                title={<div>
                  <Avatar src="https://microsoft.github.io/jacdac-docs/images/devices/kittenbot/keycapbuttonv10.preview.jpg" />
                  {skill.id}
                </div>}
                extra={<Button
                  icon={<SettingOutlined />}
                  size="small"
                  className={styles.configButton}
                  onClick={() => showConfigModal(skill)}
                />}
                onDragOver={(e) => {
                  e.preventDefault()
                  console.log('drag over')
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  console.log('drop')
                }}
              >
                <Card.Meta
                  description={skill.description}
                />
              </Card>
            </Col>
          ))}
        </Row>
        <Pagination className={styles.pagination} defaultCurrent={1} total={20} />
        <div className={styles.instruction}>Skill Options here</div>
      </Content>
      <Sider className={styles.rightSider}>
        <Menu
          className={styles.menu}
          mode="inline"
        >
          <SubMenu key="sub1" icon={<AppstoreOutlined />} title="PC event">
            <Menu.Item key="5-1" draggable>Skill1</Menu.Item>
            <Menu.Item key="5-2">Skill2</Menu.Item>
          </SubMenu>
          <Menu.Item key="6" icon={<AppstoreOutlined />}>
            Tool Box
          </Menu.Item>
          <Menu.Item key="7" icon={<AppstoreOutlined />}>
            Music Player
          </Menu.Item>
          <Menu.Item key="8" icon={<AppstoreOutlined />}>
            Demo
          </Menu.Item>
          <SubMenu key="youtube" icon={<YoutubeOutlined />} title="YouTube">
            <Menu.Item key="youtube1" icon={<VideoCameraOutlined />}>
              视频1
            </Menu.Item>
            <Menu.Item key="youtube2" icon={<VideoCameraOutlined />}>
              视频2
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="13" icon={<AppstoreOutlined />}>
            System Monitor
          </Menu.Item>
          <Menu.Item key="14" icon={<AppstoreOutlined />}>
            Date & Time
          </Menu.Item>
          <Menu.Item key="15" icon={<AppstoreOutlined />}>
            Weather
          </Menu.Item>
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
      <SkillConfigModal
        skill={editingSkill}
        handleChange={handleSkillChanged}
      />
    </Layout>
    // </Wrapper>
  );
};

export default SkillBuild;