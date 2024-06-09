
const extraLib = `
import * as ds from "@devicescript/core"
declare module "@devicescript/core" {
  interface KeyboardClient {
    button(value: number): ds.ClientRegister<boolean>
  }
}

ds.KeyboardClient.prototype.button = function(value: number) {
  const key = \`button\${value}\`
  let r = (this as any)[key] as ds.ClientRegister<boolean>
  if (!r) {
    (this as any)[key] = r = new ds.ClientRegister<boolean>()
    this.down.subscribe(async (k) => {
      if (k === value) {
        r.emit(true)
      }
    })
  }
}
`

const template = `
import * as ds from "@devicescript/core"
const kb = new ds.KeyboardClient()
const _key#KEY# = kb.button(HidKeyboardSelector.#KEY#)
hidA.subscribe(() => {
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