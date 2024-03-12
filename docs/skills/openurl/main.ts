import * as ds from "@devicescript/core"

import { startHidMouse } from "@devicescript/servers"

// Textviewer: use button to open a webpage
// 文本浏览器： 使用按键打开网页

const cd = await new ds.PCEvent()
const btn = new ds.Button()

btn.down.subscribe(async () => {
    await cd.openUrl("$URL")
})
