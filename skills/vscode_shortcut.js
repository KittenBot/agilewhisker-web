const template = `
import * as ds from "@devicescript/core"
import {regKey} from './keyboarUtils'
import { startHidKeyboard } from "@devicescript/servers"

const cd = await new ds.PCEvent()
const keyboard = startHidKeyboard({})

regKey(ds.HidKeyboardSelector.#KEY#, async () => {
    await keyboard.key($KEY, $MODIFIER, ds.HidKeyboardAction.Press)
});
`

const vscode_shortcut = [
    {id: 'openfile', name: 'Open File', key: 'N'},
    {id: 'openfolder', name: 'Open Folder', key: 'O'},
    {id: 'openproject', name: 'Open Project', key: 'R'},
    {id: 'terminal', name: 'Toggle Terminal', key: 'GraveAccent'},
    {id: 'sidebar', name: 'Toggle Sidebar', key: 'B'},
    {id: 'searchall', name: 'Search All', key: 'F', modifiers: 'ctrl/shift'},
    {id: 'comment', name: 'Comment Line', key: 'Slash'},
]

const modifiers = {
    'ctrl': 'ds.HidKeyboardModifiers.LeftControl',
    'alt/shift': 'ds.HidKeyboardModifiers.LeftAlt + ds.HidKeyboardModifiers.LeftShift',
    'ctrl/shift': 'ds.HidKeyboardModifiers.LeftControl + ds.HidKeyboardModifiers.LeftShift',
}

for (const item of vscode_shortcut) {
    const _key = `ds.HidKeyboardSelector.${item.key}`
    const _modifier = modifiers[item.modifiers || 'ctrl']
    const code = template.replace('$KEY', _key).replace('$MODIFIER', _modifier)
    awagent({
        id: `vscode_shortcut_${item.id}`,
        category: 'VSCode',
        categoryThumbnail: 'vscode.png',
        name: item.name,
        description: `${item.name} in VSCode`,
        params: {
            'KEY': {
                type: 'string',
                description: 'The key to listen for',
                default: "A"
            }
        },
        devs: code,
        target: 'keybutton'
    })
}
