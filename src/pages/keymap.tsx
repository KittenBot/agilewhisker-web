import Layout from "@theme/Layout";

import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

import "./keymap.css";
import { useMemo, useRef, useState } from "react";

export interface KeyConfig {
  name: string;
  label?: string;
  hid: number;
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

export default function Keymap() {
  const [keymap, setKeymap] = useState({
  })
  const [keyboard, setKeyboard] = useState(null);
  const [layout, display] = useMemo(() => {
    const hidKeymap = {}
    for (const key of defaultKeys.flat()) {
      hidKeymap[key.hid] = key
    }
    const layoutAry = []
    const displayMap = {}
    for (const row of defaultKeys) {
      let rowAry = ""
      for (const key of row) {
        let _key = key
        if (keymap[key.hid]) {
          _key = hidKeymap[keymap[key.hid]]
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
  }, [keymap])

  return (
    <Layout title="Keymap" description="Keymap Config">
      <div>
        <h1>Keymap</h1>
        <Keyboard
          keyboardRef={(r) => setKeyboard(r)}
          debug={true}
          layout={layout}
          display={display}
          mergeDisplay={true}
          syncInstanceInputs={true}
          physicalKeyboardHighlight={true}
          onKeyPress={(button) => {
            console.log("Button pressed", button);
          }}
        />
      </div>
    </Layout>
  );
}
