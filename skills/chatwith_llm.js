const template = `
import * as ds from "@devicescript/core"
import './keyboarUtils'
const kb = new ds.KeyboardClient()
const cd = await new ds.PCEvent()

const _key#KEY# = kb.button(ds.HidKeyboardSelector.#KEY#)
_key#KEY#.subscribe(async () => {
  await cd.runScript("llm://#LLM#?ocr=#OCR#&clip=#CLIP#")
})

`

awagent({
    id: 'chatwith_llm',
    category: 'PC Event',
    name: 'ChatWith',
    description: 'This skill listens for a key press and starts a chat with a LLM',
    thumbnail: 'chatwith.png',
    params: {
        'KEY': {
            type: 'string',
            description: 'The key to listen for',
            default: 'A'
        },
        'LLM': {
            type: 'string',
            description: 'The LLM to chat with',
            default: 'robot2/Robot2_1'
        },
        'OCR': {
            type: 'boolean',
            describtion: 'Read user input from OCR',
            default: false
        },
        'CLIP': {
            type: 'boolean',
            describtion: 'Read user input from clipboard',
            default: false
        }
    },
    devs: template,
    target: 'keybutton'

})