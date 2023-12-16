import React, { useEffect, useState } from 'react';
import { Card, Col, Row, List, Button } from 'antd'

import styles from './hostapp.module.css';

declare global {
    interface Window { 
        electronAPI: {
            start_service: (name: string) => Promise<any>,
            stop_service: (name: string) => Promise<any>,
            get_services: () => Promise<any>
        }
    }
}

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
        </div>);
}

