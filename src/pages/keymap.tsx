import Layout from '@theme/Layout';

import Keyboard from "react-simple-keyboard"
import "react-simple-keyboard/build/css/index.css"

const layout = {
    'default': [
        '{esc} 1 2 3 4 5 6 7 8 9 0 - = {bksp} ⭕',
        '{tab} q w e r t y u i o p [ ] \\',
        '{lock} a s d f g h j k l ; \' {enter}',
        '{shift} z x c v b n m , . / {shift} FN ▲ DEL',
        'CTL WIN ALT {space} FN CTL FN ◀ ▼ ▶'
    ]
}


export default function Keymap() {
  return (
    <Layout title="Keymap" description="Keymap Config">
    <div>
      <h1>Keymap</h1>
      <Keyboard 
        layout={layout}
      
      />
    </div>
    </Layout>
  )
}

