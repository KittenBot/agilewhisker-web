import { useEffect, useMemo, useRef, useState } from "react";
import React from "react";

import Keyboard from "react-simple-keyboard";

export interface KeyConfig {
  name: string;
  label?: string;
  hid: number;
  mapped?: number;
  index?: string; //rNbN
}


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
    { name: "{arrowup}", hid: 0x52 },
    { name: "{delete}", hid: 0x66 },
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



export default function Elite60() {

  const [layoutName, setLayout] = useState('default')
  const [keyconfig, setKeyconfig] = useState<KeyConfig[][]>(null)
  const [keymap, setKeymap] = useState(elite60) // key index to hid
  const [keyboard, setKeyboard] = useState(null);

  // only load keymap from jacdac config
  useEffect(() => {
    let _keyconfig = elite60

    const _config = []
    let y = 0
    for (const row of _keyconfig) {
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

  const [layout, display] = useMemo(() => {
    if (!keyconfig)
      return [null, null]

    const hidKeymap = {}
    for (const key of keyconfig.flat()) {
      hidKeymap[key.hid] = key
    }
    const layoutAry = []
    const shiftAry = []
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
      shiftAry.push(rowAry.trim())
    }

    // replace first row with function keys
    shiftAry[0] = "{escape} {f1} {f2} {f3} {f4} {f5} {f6} {f7} {f8} {f9} {f10} {f11} {f12} ⭕"

    return [
      {
        default: layoutAry,
        shift: shiftAry
      },
      displayMap
    ];
  }, [keymap, keyconfig])

  const handleKeyPress = (button: string, event: any) => {
    const ele: any = event.target
    let index = ele.getAttribute("data-skbtnuid")
    index = index.replace("default-", "")
    if (button === "{metaright}"){
      setLayout(layoutName === "default" ? "shift" : "default")

    }
  }

  return (
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
      onKeyPress={handleKeyPress}
    />
  )
}

