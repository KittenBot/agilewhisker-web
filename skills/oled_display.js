
const template = `
import * as ds from "@devicescript/core"
import {startOLED} from './keyboarUtils'

const oled = await startOLED()

oled.image.print("#TEXT#", 3, 1)
await oled.show()
`

awagent({
    id: 'oled_display_text',
    category: 'OLED Display',
    name: 'Display Text',
    description: 'Display text on the OLED Display',
    params: {
        'TEXT': {
            type: 'string',
            description: 'The text to display',
            default: 'Hello, World!'
        }
    },
    devs: template,
    target: 'oled'
})


