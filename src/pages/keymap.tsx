import Layout from '@theme/Layout';

import Keyboard from "react-simple-keyboard"
import "react-simple-keyboard/build/css/index.css"

import "./keymap.css"

const layout = {
    'default': [
        '{esc} 1 2 3 4 5 6 7 8 9 0 - = {backspace} {encoder}',
        '{tab} q w e r t y u i o p [ ] \\',
        "{capslock} a s d f g h j k l ; ' {enter}",
        '{shiftleft} z x c v b n m , . / {shiftright} FN {arrowup} FN2',
        '{controlleft} {metaleft} {altleft} {space} {altright} {metaright} {ctrlright} {arrowleft} {arrowdown} {arrowright}'
    ],
}

const display = {
    "{backspace}": "⌫",
    "{encoder}": "⭕",
    "{enter}": "⏎",
    "{controlleft}": "Ctrl ^",
    "{metaleft}": "Win ⌘",
    "{altleft}": "Alt ⌥",
    "{altright}": "Alt ⌥",
    "{metaright}": "Win ⌘",
    "{ctrlright}": "Ctrl ^",

}

export default function Keymap() {
  return (
    <Layout title="Keymap" description="Keymap Config">
    <div>
      <h1>Keymap</h1>
      <Keyboard 
        debug={true}
        layout={layout}
        display={display}
        mergeDisplay={true}
        syncInstanceInputs={true}
        physicalKeyboardHighlight={true}
      />
    </div>
    </Layout>
  )
}

