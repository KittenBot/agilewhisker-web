import React, { useEffect, useState } from 'react';
import Wrapper from "@theme/Layout";

import { Layout, Menu, Button, Pagination, Input } from 'antd';
import {
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

const { Sider, Content } = Layout;
const { SubMenu } = Menu;

const SkillBuild = () => {
  const { builds, load, current } = useSkillsStore()
  useEffect(() => {
    if (builds.length > 0) {
      load(builds[0])
    }
  }, [builds])

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
          <Button icon={<PlaySquareOutlined />} className={styles.topBarButton} />
        </div>
        <div className={styles.iconsGrid}>
          {/* Example icons */}
          <div className={styles.icon}><UserOutlined /></div>
          <div className={styles.icon}><UserOutlined /></div>
          <div className={styles.icon}><UserOutlined /></div>
          <div className={styles.icon}><UserOutlined /></div>
          <div className={styles.icon}><UserOutlined /></div>
          <div className={styles.icon}><UserOutlined /></div>
          <div className={styles.icon}><UserOutlined /></div>
          <div className={styles.icon}><UserOutlined /></div>
          <div className={styles.icon}><UserOutlined /></div>
          <div className={styles.icon}><UserOutlined /></div>
          <div className={styles.icon}><UserOutlined /></div>
          <div className={styles.icon}><UserOutlined /></div>
        </div>
        <Pagination className={styles.pagination} defaultCurrent={2} total={60} />
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
    </Layout>
    // </Wrapper>
  );
};

export default SkillBuild;