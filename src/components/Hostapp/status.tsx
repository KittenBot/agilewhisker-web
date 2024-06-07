import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Card, Badge, Avatar, Divider } from 'antd';

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

const HostAppStatus = (props: HostAppStatusProps) => {
    const { transports, devices } = props;
    const [specs, setSpecs] = useState<any[]>([])
    useEffect(() => {
        const _spec = []
        for (const dev of devices) {
            if (!dev.productIdentifier)
                continue
            const spec = deviceCatalog.specificationFromProductIdentifier(dev.productIdentifier)
            _spec.push({
                id: dev.shortId,
                name: spec.name,
                productIdentifier: dev.productIdentifier,
                img: deviceCatalogImage(spec, "list")
            })
        }
        setSpecs(_spec)
    }, [devices])
    
    return (<div>
        <h1>Status</h1>
        {transports.map((transport, idx) => (
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
    </div>)
}

export default HostAppStatus;