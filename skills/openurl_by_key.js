
const template = `
import * as ds from "@devicescript/core"
import {regKey} from './keyboarUtils'

const cd = await new ds.PCEvent()

regKey(ds.HidKeyboardSelector.#KEY#, async () => {
    await cd.openUrl("#URL#")
});

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
