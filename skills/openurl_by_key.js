
const template = `
import * as ds from "@devicescript/core"
import './keyboarUtils'
const kb = new ds.KeyboardClient()
const cd = await new ds.PCEvent()

const _key#KEY# = kb.button(ds.HidKeyboardSelector.#KEY#)
_key#KEY#.subscribe(async () => {
  await cd.openUrl("#URL#")
})

`

awagent({
  id: 'key_press_openurl',
  category: 'PC Event',
  name: 'OpenUrl',
  description: 'This skill listens for a key press and opens a URL',
  thumbnail: 'urlopen.png',
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
  },
  devs: template,
  target: 'keybutton'
  
})
