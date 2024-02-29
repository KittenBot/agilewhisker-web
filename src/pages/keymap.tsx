import Layout from "@theme/Layout";
import { Modal, Switch } from 'antd'

import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

import "./keymap.css";
import { useEffect, useMemo, useRef, useState } from "react";
import React from "react";

export interface KeyConfig {
  name: string;
  label?: string;
  hid: number;
  mapped?: number;
  index?: string; //rNbN
}

const defaultKeys: KeyConfig[][] = [
  [
    { name: "{esc}", hid: 0x29 },
    { name: "1", hid: 0x1E },
    { name: "2", hid: 0x1F },
    { name: "3", hid: 0x20 },
    { name: "4", hid: 0x21 },
    { name: "5", hid: 0x22 },
    { name: "6", hid: 0x23 },
    { name: "7", hid: 0x24 },
    { name: "8", hid: 0x25 },
    { name: "9", hid: 0x26 },
    { name: "0", hid: 0x27 },
    { name: "-", hid: 0x2D },
    { name: "=", hid: 0x2E },
    { name: "{backspace}", hid: 0x4C, label: "⌫" },
    { name: "{encoder}", hid: 0x58, label: "⭕" },
  ],
  [
    { name: "{tab}", hid: 0x2B },
    { name: "q", hid: 0x14 },
    { name: "w", hid: 0x1A },
    { name: "e", hid: 0x08 },
    { name: "r", hid: 0x15 },
    { name: "t", hid: 0x17 },
    { name: "y", hid: 0x1C },
    { name: "u", hid: 0x18 },
    { name: "i", hid: 0x0C },
    { name: "o", hid: 0x12 },
    { name: "p", hid: 0x13 },
    { name: "[", hid: 0x2F },
    { name: "]", hid: 0x30 },
    { name: "\\", hid: 0x32 },
  ],
  [
    { name: "{capslock}", hid: 0x39 },
    { name: "a", hid: 0x04 },
    { name: "s", hid: 0x16 },
    { name: "d", hid: 0x07 },
    { name: "f", hid: 0x09 },
    { name: "g", hid: 0x0A },
    { name: "h", hid: 0x0B },
    { name: "j", hid: 0x0D },
    { name: "k", hid: 0x0E },
    { name: "l", hid: 0x0F },
    { name: ";", hid: 0x33 },
    { name: "'", hid: 0x34 },
    { name: "{enter}", hid: 0x28, label: "⏎" },
  ],
  [
    { name: "{shiftleft}", hid: 0xE1 },
    { name: "z", hid: 0x1D },
    { name: "x", hid: 0x1B },
    { name: "c", hid: 0x06 },
    { name: "v", hid: 0x19 },
    { name: "b", hid: 0x05 },
    { name: "n", hid: 0x11 },
    { name: "m", hid: 0x10 },
    { name: ",", hid: 0x36 },
    { name: ".", hid: 0x37 },
    { name: "/", hid: 0x38 },
    { name: "{shiftright}", hid: 0xE5 },
    { name: "FN", hid: 0x65 },
    { name: "{arrowup}", hid: 0x52 },
    { name: "FN2", hid: 0x66 },
  ],
  [
    { name: "{controlleft}", hid: 0xE0, label: "⌃" },
    { name: "{metaleft}", hid: 0xE3, label: "⌘" },
    { name: "{altleft}", hid: 0xE2, label: "⌥" },
    { name: "{space}", hid: 0x2C, label: "␣" },
    { name: "{altright}", hid: 0xE6, label: "⌥" },
    { name: "{metaright}", hid: 0xE7, label: "⌘" },
    { name: "{ctrlright}", hid: 0xE4, label: "⌃" },
    { name: "{arrowleft}", hid: 0x50 },
    { name: "{arrowdown}", hid: 0x51 },
    { name: "{arrowright}", hid: 0x4F },
  ]
]

const findHidFromCode = (code) => {
  code = code.toLowerCase()
  for (const row of defaultKeys) {
    for (const key of row) {
      let name = key.name.replace("{", "").replace("}", "")
      if (name === code) {
        return key.hid
      }
    }
  }
  return null
}

export default function Keymap({noNavbar}:{noNavbar?:boolean}) {
  const [keyconfig, setKeyconfig] = useState<KeyConfig[][]>(null)
  const [editing, setEditing] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null) // use rNbN
  const [keymap, setKeymap] = useState({}) // key index to hid
  const [keyboard, setKeyboard] = useState(null);

  function handleKey(event) {
    if (editing && editingIndex) {
      console.log("event", editingIndex, event)
      const { key } = event
      let code: string = event.code
      if (code.startsWith("Key")) {
        code = code.substr(3)
      } else if (code.startsWith("Digit")) {
        code = code.substr(5)
      }
      const _hidToMap = findHidFromCode(code)
      
      if (_hidToMap) {
        setKeymap({
          ...keymap,
          [editingIndex]: _hidToMap
        })
      }
      // localStorage.setItem("keymap", JSON.stringify(keymap))
      setEditingIndex(null)
    }
  }

  useEffect(() => {
    const keymap = localStorage.getItem("keymap")
    if (keymap) {
      setKeymap(JSON.parse(keymap))
    }
    const _config = []
    let y = 0
    for (const row of defaultKeys) {
      const _row = []
      let x = 0
      for (const key of row) {
        _row.push({
          ...key,
          index: `r${y}b${x}`
        })
        x++
      }
      y++
      _config.push(_row)
    }
    setKeyconfig(_config)
  }, [])

  useEffect(() => {
    document.addEventListener("keydown", handleKey)
    return () => {
      document.removeEventListener("keydown", handleKey)
    }
  }, [editingIndex, editing])

  const [layout, display] = useMemo(() => {
    if (!keyconfig)
      return [null, null]

    const hidKeymap = {}
    for (const key of keyconfig.flat()) {
      hidKeymap[key.hid] = key
    }
    const layoutAry = []
    const displayMap = {}
    for (const row of keyconfig) {
      let rowAry = ""
      for (const key of row) {
        let _key = key
        if (keymap[key.index]) {
          console.log("#1", key)
          let _hid = keymap[key.index]
          _key = hidKeymap[_hid]
        }
        rowAry += _key.name + " "
        if (_key.label) {
          displayMap[_key.name] = _key.label
        }
      }
      layoutAry.push(rowAry.trim())
    }
    return [
      {default: layoutAry},
      displayMap
    ];
  }, [keymap, keyconfig])

  return (
    <>
    {
      noNavbar ?
        <div className="keymap">
          <h1>Keymap</h1>
          <Keyboard
            keyboardRef={(r) => {
              setKeyboard(r)
            }}
            style={{width:'100%'}}
            // debug={true}
            layout={layout}
            display={display}
            mergeDisplay={true}
            syncInstanceInputs={true}
            physicalKeyboardHighlight={true}
            onKeyPress={(button, event) => {
              const ele: any = event.target
              let index = ele.getAttribute("data-skbtnuid")
              index = index.replace("default-", "")
              if (editingIndex) {
                setEditingIndex(null)
              } else if (editing) {
                setEditingIndex(index)
              }
            }}
          />
          <Switch checkedChildren="edit" onChange={c => setEditing(c)} />
          <Modal title="Press a key" open={editingIndex} footer={null} onCancel={() => setEditingIndex(null)} maskClosable>
            <p>Press a key to bind</p>
          </Modal>
        </div>
      :
      <Layout title="Keymap" description="Keymap Config">
        <div>
          <h1>Keymap</h1>
          <Keyboard
            keyboardRef={(r) => {
              setKeyboard(r)
            }}
            // debug={true}
            layout={layout}
            display={display}
            mergeDisplay={true}
            syncInstanceInputs={true}
            physicalKeyboardHighlight={true}
            onKeyPress={(button, event) => {
              const ele: any = event.target
              let index = ele.getAttribute("data-skbtnuid")
              index = index.replace("default-", "")
              if (editingIndex) {
                setEditingIndex(null)
              } else if (editing) {
                setEditingIndex(index)
              }
            }}
          />
          <Switch checkedChildren="edit" onChange={c => setEditing(c)} />
          <Modal title="Press a key" open={editingIndex} footer={null} onCancel={() => setEditingIndex(null)} maskClosable>
            <p>Press a key to bind</p>
          </Modal>
        </div>
      </Layout>
    }
    </>
  );
}
