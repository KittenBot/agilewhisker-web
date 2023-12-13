import React, { useEffect } from 'react';
import { Modal, Switch } from 'antd'


function ipcSend(channel: string, ...args: any[]) {
    if (typeof window !== 'undefined') {
        const { ipcRenderer } = (window as any).electron
        ipcRenderer.send(channel, ...args)
    }
}

export default function HostApp() {

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const { ipcRenderer } = (window as any).electron
            ipcRenderer.on('message', (event: any, message: any) => {
                console.log("message", message)
            })
        }
    }, [])

    return (<div>
        <h1>Host App</h1>
        <p>Host App</p>
    </div>);
}

