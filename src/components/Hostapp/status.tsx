import React, { useState, useEffect, useMemo } from 'react';
import { FloatButton, Row, Col, Card, Badge, Avatar, Divider } from 'antd';
import { 
    RedoOutlined
} from '@ant-design/icons';

import {
    deviceCatalogImage,
    deviceCatalog

} from 'jacdac-ts'

export interface HostAppStatusProps {
    transports: string[];
    devices: {
        shortId: string;
        productIdentifier: number;
    }[]
}

const HostAppStatus = () => {
    const [specs, setSpecs] = useState<any[]>([])
    const [status, setStatus] = useState<HostAppStatusProps>({
        devices: [],
        transports: []
    })

    const handleRefresh = useMemo(() => () => {
        const { get_status } = window.electronAPI
        get_status().then((status: any) => {
            console.log("status", status)
            setStatus(status)
        })
    }, [])

    useEffect(()=>{
        handleRefresh()
    },[])

    useEffect(() => {
        const _spec = []
        for (const dev of status.devices) {
            if (!dev.productIdentifier)
                continue
            const spec = deviceCatalog.specificationFromProductIdentifier(dev.productIdentifier)
            if (!spec)
                continue
            _spec.push({
                id: dev.shortId,
                name: spec.name,
                productIdentifier: dev.productIdentifier,
                img: deviceCatalogImage(spec, "list")
            })
        }
        setSpecs(_spec)
    }, [status])

    

    return (<div>
        <h1>Status</h1>
        {status.transports.map((transport, idx) => (
            <Badge key={idx} color='cyan' text={transport}/>
        ))}
        <Divider />
        <Row gutter={[16, 16]}>
            {specs.map((_spec, idx) => (
                <Col key={idx} span={8}>
                    <Card
                        title={<div>
                            <Avatar src={_spec.img} />
                            {_spec.id}
                        </div>}
                        bordered={false}
                    >
                        <Card.Meta
                            description={_spec.name}
                        />
                    </Card>
                </Col>
            ))}
        

        </Row>
        <FloatButton
            icon={<RedoOutlined />}
            shape="circle"
            style={{ right: 24 }}
            onClick={handleRefresh}
        />
    </div>)
}

export default HostAppStatus;