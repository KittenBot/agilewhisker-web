import React, { useEffect } from "react";

import { useJacdacStore } from "../store/jacdacStore";
import { DisconnectState } from "../components/DevsDownload";
import {
    SRV_ROLE_MANAGER,
    RoleManagerClient
} from 'jacdac-ts'
import Layout from "@theme/Layout";


export default function DeivceManager (){
    const {spec, connected, device} = useJacdacStore()

    useEffect(() => {
        if (!device) return
        const _service = device.services({serviceClass: SRV_ROLE_MANAGER})
        if (_service.length){
            const roleManagerClient = new RoleManagerClient(_service[0])
            roleManagerClient.startRefreshRoles()
            roleManagerClient.subscribe("change", (role) => {
                console.log("change", role)
            })
            console.log("roleManagerClient", roleManagerClient.allRolesBound())
            for (const role of roleManagerClient.roles){
                console.log("role", role)
            }
        }

    }, [device])

    return (
        <Layout title="Device" description="Device info and manager">
            <div>
                <h1>Device</h1>
                {connected ? null : <DisconnectState />}


            </div>
        </Layout>
    )
}
