import { useEffect, useMemo, useRef, useState } from "react";
import React from "react";
import Keyboard from "react-simple-keyboard";

import './keyboard.css';
import { KeyConfig } from "./elite60"

const numberPad: KeyConfig[][] = [
  [
    { name: "{numlock}", hid: 0x59 },
    { name: "{numpaddivide}", hid: 0x54 },
    { name: "{numpadmultiply}", hid: 0x55 },
  ],
  [
    { name: "{numpad7}", hid: 0x5F },
    { name: "{numpad8}", hid: 0x60 },
    { name: "{numpad9}", hid: 0x61 },
  ],
  [
    { name: "{numpad4}", hid: 0x5C },
    { name: "{numpad5}", hid: 0x5D },
    { name: "{numpad6}", hid: 0x5E },
  ],
  [
    { name: "{numpad1}", hid: 0x59 },
    { name: "{numpad2}", hid: 0x5A },
    { name: "{numpad3}", hid: 0x5B },
  ],
  [
    { name: "{numpad0}", hid: 0x62 },
    { name: "{numpaddecimal}", hid: 0x63 },
  ]
]

const numberPadEnd: KeyConfig[][] = [
  [
    { name: "{numpadsubtract}", hid: 0x56 },
  ],[
    { name: "{numpadadd}", hid: 0x57 },
  ],[
    { name: "{numpadenter}", hid: 0x58 },
  ]

]

export default function NumberPad() {
  const [keyboard, setKeyboard] = useState(null);
  const [layout, setLayout] = useState([])
  const [layoutEnd, setLayoutEnd] = useState([])

  useEffect(() => {
    const _layout = []
    const _layoutEnd = []
    for (const row of numberPad) {
      let rowAry = ""
      for (const key of row) {
        rowAry += key.name + " "
      }
      _layout.push(rowAry.trim())
    }
    for (const row of numberPadEnd) {
      let rowAry = ""
      for (const key of row) {
        rowAry += key.name + " "
      }
      _layoutEnd.push(rowAry.trim())
    }
    setLayout(_layout)
    setLayoutEnd(_layoutEnd)
  }, [])


  return (
    <div style={{
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
    }}>
    <Keyboard
      baseClass={"simple-keyboard-numpad"}
      keyboardRef={(r) => {
        setKeyboard(r)
      }}
      // debug={true}
      layout={{
        default: layout
      }}
      mergeDisplay={true}
      syncInstanceInputs={true}
      physicalKeyboardHighlight={true}
    />
    <Keyboard
      baseClass={"simple-keyboard-numpadEnd"}
      layout={{
        default: layoutEnd
      }}
    />
    </div>
  )
}