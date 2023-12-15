import React, { useEffect, useState } from 'react';
import { Card, Col, Row, List, Button } from 'antd'

import ambient_icon from '@site/assets/ambient.png'
import cloud_icon from '@site/assets/cloud.png'
import event_icon from '@site/assets/event.png'
import monitor_icon from '@site/assets/monitor.png'

import styles from './hostapp.module.css';


function ipcSend(channel: string, ...args: any[]) {
    if (typeof window !== 'undefined' && (window as any).electron) {
        const { ipcRenderer } = (window as any).electron
        ipcRenderer.send(channel, ...args)
    }
}

function ServiceCard(props: { name: string, status: boolean, icon: string }) {

    return (<Card
        hoverable
        title={props.name} 
        bordered={false}
        actions={[
            <Button onClick={() => {
                ipcSend('jd-control', {command: 'start-service', data: props.name})
            }}>Start</Button>
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

    return (<div>
        <h1>Host App</h1>
        <div className={styles.servicelist}>
            <List
                grid={{ gutter: 16, column: 3 }}
                dataSource={services}
                renderItem={item => (
                    <List.Item>
                        <ServiceCard {...item} />
                    </List.Item>
                )}
            />
        </div>
    </div>);
}

