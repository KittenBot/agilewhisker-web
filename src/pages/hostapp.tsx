import React from 'react';
import { useEffect, useState } from 'react';
import { Card, Col, Row, List, Button, Menu, Layout, Switch } from 'antd'

import styles from './hostapp.module.css';
import Settings from '../components/Hostapp/settings';

const { Header, Sider, Content } = Layout;

declare global {
    interface Window { 
        electronAPI: {
            start_service: (name: string) => Promise<any>,
            stop_service: (name: string) => Promise<any>,
            get_services: () => Promise<any>,
            save_settings: (settings: any) => Promise<any>,
            get_settings: () => Promise<any>
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

    return (
        <Layout>
            <Sider style={{ background: '#fff',paddingTop:'10px'}} trigger={null} collapsible collapsed={false}>
                <Menu
                    style={{ height: '100%',borderInlineEnd:'none'}}
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    onClick={(e) => setTabs(e.key)}
                >
                    <Menu.Item key="1">Services</Menu.Item>
                    <Menu.Item key="2">Settings</Menu.Item>
                </Menu>
            </Sider>
            <Layout style={{padding:'20px'}}>
                {tabs === '1' && <List
                    grid={{ gutter: 16, column: 3 }}
                    dataSource={services}
                    renderItem={item => (
                        <List.Item>
                            <ServiceCard {...item} toggle={() => handleToggleService(item.status, item.name)}/>
                        </List.Item>
                    )}
                />}
                {tabs === '2' && <Settings />}

            </Layout>
        </Layout>
    );
}

