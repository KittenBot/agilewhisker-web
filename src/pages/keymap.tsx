import Layout from "@theme/Layout";

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

// for testing
const testKeymap = [
  // esc, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, -, =, backspace
  0x29, 0x1e, 0x1f, 0x20, 0x21, 0x22, 0x23,0x24, 0x25, 0x26, 0x27, 0x2d, 0x2e, 0x2a,
  // tab, q, w, e, r, t, y, u, i, o, p, [, ], slash
  0x2b, 0x14, 0x1a, 0x08, 0x15, 0x17, 0x1c, 0x18, 0x0c, 0x12, 0x13, 0x2f, 0x30, 0x31,
  // cap, a, s, d, f, g, h, j, k, l, ;, ', enter
  0x39, 0x04, 0x16, 0x07, 0x09, 0x0a, 0x0b, 0x0d, 0x0e, 0x0f, 0x33, 0x34, 0x28, 0x00,
  // lshift, z, x, c, v, b, n, m, ,, ., /, rshift, up, del
  0xe1, 0x1d, 0x1b, 0x06, 0x19, 0x05, 0x11, 0x10, 0x36, 0x37, 0x38, 0xe5, 0x52, 0x4c,
  // lctrl, cmd, alt, null, null, space, null, null, null, fn, rctrl, left, down, right
  0xe0, 0xe3, 0xe2, 0x00, 0x00, 0x2c, 0x00, 0x00, 0x00, 0xe6, 0xFF, 0x50, 0x51, 0x4f,
]

export default function Keymap() {
  const [keyboard, setKeyboard] = useState('elite60');
  const [keymap, setKeymap] = useState(testKeymap)
  
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

  const handleUpdate = (index: number, value: number) => {
    console.log("update", index, value)
    const _keymap = [...keymap]
    _keymap[index] = value
    setKeymap(_keymap)
  }

  return (
    <>     
      <Layout title="Keymap" description="Keymap Config">
        <div>
          <h1>Keymap</h1>
          {connected ? null : <DisconnectState />}
          {keyboard === 'elite60' ? <Elite60 keymap={keymap} update={handleUpdate}/> : null}
          {keyboard === 'numpad' ? <NumberPad /> : null}
          
        </div>
      </Layout>
    </>
  );
}
