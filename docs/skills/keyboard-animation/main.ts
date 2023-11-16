import { LedStripLightType, LedVariant, gpio, Button, sleep } from "@devicescript/core"
import { startLed } from "@devicescript/drivers"
import { fillFade } from "@devicescript/runtime"

// This is a simple animation that runs on the LED strip.
// Please select one of the patterns below and uncomment it.

// 这个例子使用一个按键模块来切换动画效果

const led = await startLed({
    length: 13*5,
    columns: 5,
    variant: LedVariant.Strip,
    hwConfig: { type: LedStripLightType.WS2812B_GRB, pin: gpio(7) },
})
await led.showAll(0)
await sleep(1000)
const pixels = await led.buffer()
const btn = new Button()

pixels.setAt(0, 0xff0000)
fillFade(pixels, 0.2)
await led.show()
let curr = 0
let currAnimation = 0

const pattern_snake = (len: number, t: number) => {
    for (let i=0;i<len;++i) {
        let x = (i + (t >> 1)) % 64;
        if (x < 10){
            pixels.setAt(curr, 0x1f0000)
        } else if (x >= 15 && x < 25){
            pixels.setAt(curr, 0x001f00)
        } else if (x >= 30 && x < 40){
            pixels.setAt(curr, 0x00001f)
        } else {
            pixels.setAt(curr, 0)
        }
        curr = (curr + 1) % pixels.length
    }
}

const pattern_sparkle = (len: number, t: number) => {
    if (t % 8)
        return
    for (let i=0;i<len;++i) {
        pixels.setAt(curr, Math.random()*65535 % 16 ? 0 : 0xffffff)
        curr = (curr + 1) % pixels.length
    }
}

const pattern_random = (len: number, t: number) => {
    if (t % 8)
        return
    for (let i=0;i<len;++i) {
        pixels.setAt(curr, Math.random()*0xffffff)
        curr = (curr + 1) % pixels.length
    }
}

const pattern_greys = (len: number, t: number) => {
    const max = 100
    t %= max
    for (let i=0;i<len;++i) {
        pixels.setAt(curr, t*0x10101)
        curr = (curr + 1) % pixels.length
        if (++t >= max)
            t = 0
    }
}

btn.down.subscribe(async () => {
    currAnimation = (currAnimation + 1) % 4
})

let loop = 0;
while(1){
    // change the pattern here
    switch(currAnimation){
        case 0:
            pattern_snake(64, loop++)
            break
        case 1:
            pattern_sparkle(64, loop++)
            break
        case 2:
            pattern_random(64, loop++)
            break
        case 3:
            pattern_greys(64, loop++)
            break
    }

    await led.show()
    await sleep(10)
}