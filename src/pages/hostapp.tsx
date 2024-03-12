import React, { useEffect, useState } from 'react';
import { Card, Col, Row, List, Button, Menu, Layout, Switch } from 'antd'

import styles from './hostapp.module.css';
import MenuItem from 'antd/es/menu/MenuItem';
import type { GetProp, MenuProps } from 'antd';
import Keymap from './keymap';

const { Header, Sider, Content } = Layout;

declare global {
    interface Window { 
        electronAPI: {
            start_service: (name: string) => Promise<any>,
            stop_service: (name: string) => Promise<any>,
            get_services: () => Promise<any>
        }
    }
}

function ServiceCard(props: { name: string, status: boolean, icon: string, toggle: any,disabled?: boolean}) {

    return (<Card
        hoverable
        title={props.name} 
        bordered={false}
        actions={[
            <Switch checkedChildren="on" unCheckedChildren="off" disabled={props.disabled} checked={props.status} onChange={props.toggle} />
        ]}
    >
        <Card.Meta
            className={styles.cardContainer}
            avatar={<img className={styles.serviceicon} alt="logo" src={`${location.origin}/${props.icon}`} />}
            title={<a>{props.name}</a>}
            description={<span className={styles.description} >{props.status ? "Running" : "Stopped"}</span>}
        />
    </Card>)
}
type MenuTheme = GetProp<MenuProps, 'theme'>;
type MenuItem = GetProp<MenuProps, 'items'>[number];
function getItem(
    label: React.ReactNode,
    key?: React.Key | null,
    icon?: React.ReactNode,
    children?: MenuItem[]
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
    } as MenuItem;
  }
const items: MenuItem[] = [
    getItem('Services', '1'),
  ];
export default function HostApp() {

    const [services, setServices] = useState([])
    const [tabs,setTabs] = useState<any> ('1')

    const handleToggleService = async (status: boolean, name: string) => {
        const { start_service, stop_service } = window.electronAPI
        if (status) {
            const _nextServices = await stop_service(name)
            console.log("services", _nextServices)
            setServices(_nextServices)
        } else {
            const _nextServices = await start_service(name)
            console.log("services", _nextServices)
            setServices(_nextServices)
        }
    }

    useEffect(() => {
        const { get_services } = window.electronAPI
        // get services from backend
        get_services().then((services: any) => {
            console.log("services", services)
            setServices(services)
        })
    }, [])
    const [mode, setMode] = useState<'vertical' | 'inline'>('inline');
    const [theme, setTheme] = useState<MenuTheme>('light');

    return (
        <Layout>
            <Sider style={{ background: '#fff',paddingTop:'10px'}} trigger={null} collapsible collapsed={false}>
                <Menu
                    style={{ height: '100%',borderInlineEnd:'none'}}
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    onClick={(value: any) => {
                    console.log(value);
                    setTabs(value.key)
                    }}
                    mode={mode}
                    theme={theme}
                    items={items}
                />
            </Sider>
            <Layout style={{padding:'20px'}}>
                <List
                    grid={{ gutter: 16, column: 3 }}
                    dataSource={services}
                    renderItem={item => (
                        <List.Item>
                            <ServiceCard {...item} toggle={() => handleToggleService(item.status, item.name)}/>
                        </List.Item>
                    )}
                />
            </Layout>
        </Layout>
    );
}

