import { useEffect, useMemo, useRef, useState } from "react";
import React from "react";
import { Button, Card, Dropdown, Modal, Switch, Alert, Space } from 'antd'

import Keyboard from "react-simple-keyboard";

export interface KeyConfig {
  name: string;
  label?: string;
  hid: number;
  mapped?: number;
  index?: string; //rNbN
}

// this is the default keymap for the elite60
const elite60: KeyConfig[][] = [
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
    { name: "{backspace}", hid: 0x2A, label: "⌫" },
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
    { name: "\\", hid: 0x31 },
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
    { name: "{arrowup}", hid: 0x52 },
    { name: "{delete}", hid: 0x4c },
  ],
  [
    { name: "{controlleft}", hid: 0xE0, label: "Ctrl" },
    { name: "{metaleft}", hid: 0xE3, label: "⌘" },
    { name: "{altleft}", hid: 0xE2, label: "alt" },
    { name: "{space}", hid: 0x2C, label: "␣" },
    { name: "{altright}", hid: 0xE6, label: "alt" },
    { name: "{metaright}", hid: 0xff, label: "><" },
    { name: "{arrowleft}", hid: 0x50 },
    { name: "{arrowdown}", hid: 0x51 },
    { name: "{arrowright}", hid: 0x4F },
  ]
]



export default function Elite60(props: { keymap: number[], update: (index: number, value: number) => void}) {

  const { keymap, update } = props
  const [layoutName, setLayoutName] = useState('default')

  const [editingIndex, setEditingIndex] = useState(null)
  const [targetIndex, setTargetIndex] = useState(null)
  const [showAllkeys, setShowAllkeys] = useState(false)

  const [isEditing, setEditing] = useState(false)

  const [layout, setLayout] = useState(null)
  const [display, setDisplay] = useState(null)
  const [keyboard, setKeyboard] = useState(null);
  const [keyIndex, setKeyIndex] = useState({})

  // only load keymap from jacdac config
  useEffect(() => {
    // key config to hid map
    const hid2key = {}
    for (const row of elite60) {
      for (const key of row) {
        if (keymap.includes(key.hid)) {
          hid2key[key.hid] = key
        }
      }
    }
    console.log("hid2key", hid2key)
    console.log("keymap", keymap)

    // rebuild keyconfig with hid2key
    const _config = []
    const _keyconfig = []
    const _keyindex = {}
    for (let y=0;y<5;y++) {
      const _row = []
      for (let x=0;x<14;x++) {
        const key = hid2key[keymap[y*14+x]]
        if (key) {
          const _keyconf = {...key, row: y, col: x}
          _row.push(_keyconf)
          _keyindex[key['name']] = _keyconf
        }
      }
      _keyconfig.push(_row)
    }
    console.log("_keyconfig", _keyconfig)
    
    // rebuild layout and display
    const layoutAry = []
    const shiftAry = []
    const displayMap = {}
    for (const row of _keyconfig) {
      let rowAry = ""
      for (const key of row) {
        rowAry += key.name + " "
        if (key.label) {
          displayMap[key.name] = key.label
        }
      }
      layoutAry.push(rowAry.trim())
      shiftAry.push(rowAry.trim())
    }
    // trick to add encoder key
    layoutAry[0] += " {encoder}"
    shiftAry[0] = "{escape} {f1} {f2} {f3} {f4} {f5} {f6} {f7} {f8} {f9} {f10} {f11} {f12} {backspace} {encoder}"
    displayMap["{encoder}"] = "⭕"

    setLayout({
      default: layoutAry,
      shift: shiftAry
    })

    setDisplay(displayMap)

    setKeyIndex(_keyindex)

  }, [keymap])

  const handleKeyPress = (button: string, editing) => {
    const index = keyIndex[button]
    if (button === "{metaright}"){
      setLayoutName(layoutName === "default" ? "shift" : "default")
    }

    if (!editing){
      setEditingIndex(index)
    } else if (editing) {
      setTargetIndex(index)
    }
  }

  const allkeyMenu = useMemo(() => {
    const menu = []
    for (const row of elite60) {
      for (const key of row) {
        menu.push({
          label: key.name,  
        })
      }
    }
    return menu
  }, [elite60])

  return (
    <Card
      style={{ margin: 16}}
    >
    {editingIndex ? <Alert message={`Press a key to bind to ${editingIndex.name}@${editingIndex.row}-${editingIndex.col}`} type="info" showIcon banner closable onClose={() => setEditingIndex(null)} action={
      <Button size="small" danger onClick={() => setShowAllkeys(true)}>
        All Keys
      </Button>
    }/> : null}
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
      layoutName={layoutName}
      onKeyPress={(button) => handleKeyPress(button, editingIndex)}
    />
    <div>
      Key Map: 
      <Switch checkedChildren="edit" onChange={c => setEditing(c)} />
    </div>
    <Modal title="Press a key" open={editingIndex && targetIndex} maskClosable onOk={() => {
      update(editingIndex.row*14+editingIndex.col, targetIndex.hid)
      setEditingIndex(null)
      setTargetIndex(null)
    }} onCancel={() => {
      setEditingIndex(null)
      setTargetIndex(null)
    }}>
      <p>Remap: {editingIndex?.name} to {targetIndex?.name} ?</p>
    </Modal>
    <Modal title="All Key mapping" open={showAllkeys} onOk={() => {

    }} onCancel={() => {
      setShowAllkeys(false)
    }}>
        <Dropdown menu={{items: allkeyMenu}} trigger={['click']}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              Select a key
            </Space>
          </a>
        </Dropdown>
    </Modal>
    </Card>
  )
}

