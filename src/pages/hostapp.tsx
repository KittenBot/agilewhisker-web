import React, { useEffect, useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { Card, Col, Row, List, Button } from 'antd'

import ambient_icon from '@site/assets/ambient.png'
import cloud_icon from '@site/assets/cloud.png'
import event_icon from '@site/assets/event.png'
import monitor_icon from '@site/assets/monitor.png'

import styles from './hostapp.module.css';

function ServiceCard(props: { name: string, status: boolean, icon: string, toggle: any }) {

    return (<Card
        hoverable
        title={props.name} 
        bordered={false}
        actions={[
            <Button onClick={props.toggle}>{props.status ? "Stop" : "Start"}</Button>,
        ]}
    >
        <Card.Meta
            avatar={<img className={styles.serviceicon} alt="logo" src={props.icon} />}
            title={<a>{props.name}</a>}
            description={props.status ? "Running" : "Stopped"}
        />
    </Card>)
}

export default function HostApp() {

    const [services, setServices] = useState([])

    const handleToggleService = async (status: boolean, name: string) => {
        const { ipcRenderer } = (window as any).electron
        if (status) {
            const _nextServices = await ipcRenderer.invoke('stop-service', name)
            console.log("services", _nextServices)
            setServices(_nextServices)
        } else {
            const _nextServices = await ipcRenderer.invoke('start-service', name)
            console.log("services", _nextServices)
            setServices(_nextServices)
        }
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const { ipcRenderer } = (window as any).electron
            ipcRenderer.on('message', (event: any, message: any) => {
                console.log("message", message)
            })
            // get services from backend
            ipcRenderer.invoke('get-services').then((services: any) => {
                console.log("services", services)
                setServices(services)
            })
        }        
    }, [])

    return (<BrowserOnly>
    {() => {
        return (
        <div className={styles.servicelist}>
            <List
                grid={{ gutter: 16, column: 3 }}
                dataSource={services}
                renderItem={item => (
                    <List.Item>
                        <ServiceCard {...item} toggle={() => handleToggleService(item.status, item.name)}/>
                    </List.Item>
                )}
            />
        </div>)}}
    </BrowserOnly>);
}

