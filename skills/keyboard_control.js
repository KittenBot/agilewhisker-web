const template =`
import * as ds from "@devicescript/core"
import {hidEnable} from './keyboarUtils'

await hidEnable(#ENABLE#)
`

awagent({
    id: 'keyboard_hid_control',
    category: 'Keyboard',
    name: 'HID Scan control',
    description: 'Enable or disable the keyboard HID scan',
    params: {
        'ENABLE': {
            type: 'boolean',
            description: 'Enable or disable the keyboard HID scan',
            default: true
        }
    },
    devs: template,
})