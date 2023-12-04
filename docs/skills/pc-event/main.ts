import * as ds from "@devicescript/core"

import { startHidMouse } from "@devicescript/servers"

// Textviewer: use button to open a webpage, then use slider to control mouse wheel
// 文本浏览器： 使用按键打开网页，之后使用slider模块控制鼠标滚轮

const cd = await new ds.PCEvent()
const btn = new ds.Button()
const slider = new ds.Potentiometer()
const mouse = startHidMouse({})

btn.down.subscribe(async () => {
    await cd.openUrl("$URL")
})

while(1){
    let v = await slider.reading.read()
    if (v < 0.2){
        await mouse.wheel(-10, 100)
    } else if (v > 0.8){
        await mouse.wheel(10, 100)
    }
    await ds.sleep(300)
}