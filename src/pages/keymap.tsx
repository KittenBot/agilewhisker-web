import Layout from "@theme/Layout";
import { Card, Modal, Switch } from 'antd'

import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { DisconnectState } from "../components/DevsDownload";
import {
  jdpack, Packet, jdunpack,
  JDDevice,
  SRV_SETTINGS,
} from 'jacdac-ts'

import "./keymap.css";
import { useEffect, useMemo, useRef, useState } from "react";
import React from "react";
import { useJacdacStore } from "../store/jacdacStore";
import Elite60 from "../components/Keymap/elite60";
import NumberPad from "../components/Keymap/numpad";


export default function Keymap() {
  const [keyboard, setKeyboard] = useState('elite60');
  const [editingIndex, setEditingIndex] = useState(null) // use rNbN
  const [editing, setEditing] = useState(false)
  
  const {spec, connected, device} = useJacdacStore()

  async function readKeymap(device: JDDevice) {
    const settingService = device.services({serviceClass: SRV_SETTINGS})[0]
    const pkt = Packet.from(0x80, jdpack('s', ['keymap']))
    const ret = await settingService.sendCmdAwaitResponseAsync(pkt)
    const [key, value] = jdunpack<[string, Uint8Array]>(ret.data, 'z b')
    // TODO: refactor to jacdac config format

  }

  useEffect(() => {
    if (spec?.productIdentifiers.includes(0x3ae6b1e2)){
      setKeyboard('numpad')
    } else if (spec?.productIdentifiers.includes(0x3458bc2a)){
      setKeyboard('elite60')
    }
  }, [spec])

  useEffect(() => {
    if (device) {
      readKeymap(device)
    }

  }, [device])

  return (
    <>     
      <Layout title="Keymap" description="Keymap Config">
        <div>
          <h1>Keymap</h1>
          {connected ? null : <DisconnectState />}
          {keyboard === 'elite60' ? <Elite60 /> : null}
          {keyboard === 'numpad' ? <NumberPad /> : null}
          <Switch checkedChildren="edit" onChange={c => setEditing(c)} />
          <Modal title="Press a key" open={editingIndex} footer={null} onCancel={() => setEditingIndex(null)} maskClosable>
            <p>Press a key to bind</p>
          </Modal>
        </div>
      </Layout>
    </>
  );
}
