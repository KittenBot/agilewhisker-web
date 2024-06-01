import React, { useEffect, useState } from 'react';
import Wrapper from "@theme/Layout";

import { Avatar, Card, Row, Col, Layout, Menu, Button, Pagination, Input, Modal } from 'antd';
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

const { Sider, Content } = Layout;
const { SubMenu } = Menu;

const SkillBuild = () => {
  const [userCode, setUserCode] = useState('')
  const [showCode, setShowCode] = useState(false)
  const { generate, builds, skills, load, current } = useSkillsStore()
  const { compileWithHost } = useDevsStore()
  useEffect(() => {
    if (builds.length > 0) {
      load(builds[0])
    }
  }, [builds])

  const handleCompile = async () => {
    const code = generate()
    console.log(code)
    const result = await compileWithHost()
    console.log(result)
  }

  const handleShowCode = async () => {
    const code = generate()
    setUserCode(code)
    setShowCode(true)
  }

  const handleOk = () => {

  }

  const handleCancel = () => {
    setShowCode(false)
  }

  const handleChange = (value) => {
    console.log(value)
  }

  return (
    // <Wrapper title="Skill Builder">
    <Layout className={styles.layout}>
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
          <Button icon={<SettingOutlined />} className={styles.deviceButton}>Deivce</Button>
          <Menu mode="vertical" className={styles.deviceMenu}>
            <Menu.Item key="device1">Elite60 Keyboard</Menu.Item>
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
                  avatar={<Avatar src="https://microsoft.github.io/jacdac-docs/images/devices/kittenbot/keycapbuttonv10.preview.jpg" />}
                  title={skill.id}
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
      <Modal title="Generated Code" open={showCode} onOk={handleOk} onCancel={handleCancel}>
        <p>Code Editor</p>
        <CodeEditor
          code={userCode}
          onChange={handleChange}
        />
      </Modal>
    </Layout>
    // </Wrapper>
  );
};

export default SkillBuild;