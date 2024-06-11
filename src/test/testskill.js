
const template = `
import * as ds from "@devicescript/core"
const kb = new ds.KeyboardClient()
const _key#KEY# = kb.button(HidKeyboardSelector.#KEY#)
_key#KEY#.subscribe(() => {
  #CALLBACK#
})

`

awagent({
  id: 'testskill',
  name: 'Test Skill',
  description: 'This is a test skill',
  
})



md`
# Test Skill

This is a test skill

## Code
\`\`\`js

\`\`\`

## Usage

Prints a message to the console

`