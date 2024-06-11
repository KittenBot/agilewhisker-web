
const template = `
import * as ds from "@devicescript/core"
const kb = new ds.KeyboardClient()
const cd = await new ds.PCEvent()

const _key#KEY# = kb.button(HidKeyboardSelector.#KEY#)
_key#KEY#.subscribe(() => {
  await cd.openUrl("#URL#")
})

`

awagent({
  id: 'key_press_openurl',
  category: 'PC Event',
  name: 'OpenUrl',
  description: 'This skill listens for a key press and opens a URL',
  params: {
    'KEY': {
      type: 'string',
      description: 'The key to listen for',
      default: 'A'
    },
    'URL': {
      type: 'string',
      description: 'The URL to open',
      default: 'https://w.kittenbot.cc'
    }
  }
  
})
