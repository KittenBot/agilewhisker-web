
const animationLib = `
import * as ds from "@devicescript/core"
import { startLed } from "@devicescript/drivers"

let curr = 0
let _ledBuff
const pattern_snake = (pixels: any, t: number) => {
    let len = pixels.length
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

const pattern_sparkle = (pixels: any, t: number) => {
    let len = pixels.length
    if (t % 8)
        return
    for (let i=0;i<len;++i) {
        pixels.setAt(curr, Math.random()*65535 % 16 ? 0 : 0xffffff)
        curr = (curr + 1) % pixels.length
    }
}

const pattern_random = (pixels: any, t: number) => {
    let len = pixels.length
    if (t % 8)
        return
    for (let i=0;i<len;++i) {
        pixels.setAt(curr, Math.random()*0xffffff)
        curr = (curr + 1) % pixels.length
    }
}
const pattern_greys = (pixels: any, t: number) => {
    let len = pixels.length
    const max = 100
    t %= max
    for (let i=0;i<len;++i) {
        pixels.setAt(curr, t*0x10101)
        curr = (curr + 1) % pixels.length
        if (++t >= max)
            t = 0
    }
}

async function initLED() {
    const led = await startLed({
        length: 13*5,
        columns: 5,
        variant: ds.LedVariant.Strip,
        hwConfig: { type: ds.LedStripLightType.WS2812B_GRB, pin: ds.gpio(7) },
    })
    await led.showAll(0)
    return led
}

export {
    initLED,
    pattern_greys,
    pattern_random,
    pattern_snake,
    pattern_sparkle,
}
`

const template = `
import {initLED, $PATTERN} from './keyboardAnim'
const led = await initLED()
const pixels = await led.buffer()
let _ledLloop = 0

while (1) {
    _ledLloop += 1
    $PATTERN(pixels, _ledLloop)
    await led.show()
    await ds.sleep(10)
}

`

const codeTemplates = {
    'snake': 'pattern_snake',
    'sparkle': 'pattern_sparkle',
    'random': 'pattern_random',
    'greys': 'pattern_greys'
}

Object.entries(codeTemplates).forEach(([pattern, fun]) => {
    awagent({
        id: `keyboard_animation_${pattern}`,
        category: 'Animation',
        name: pattern,
        description: `animation: ${pattern}`,
        devs: template.replace(/\$PATTERN/g, fun),
        target: 'animation',
        libs: {
            'src/keyboardAnim.ts': animationLib
        }
    })
})

