import * as ds from "@devicescript/core"
import { fillRainbow, fillPalette } from "@devicescript/runtime"
import { Palette } from "@devicescript/graphics"

// Use rotary encoder to rotate the rgb led
// 使用旋转编码器旋转rgb led

const encoder = new ds.RotaryEncoder()
const led = new ds.Led()
const btn = new ds.Button()

const pixels = await led.buffer()

pixels.setAt(0, 0xff0000)
await led.show()

let pos = await encoder.reading.read()

encoder.reading.subscribe(async (v) => {
    if (v !== pos) {
        if (v > pos){
            await pixels.rotate(1)
        } else {
            await pixels.rotate(-1)
        }
        pos = v
        await led.show()
    }
})

let effect = 0
btn.down.subscribe(async () => {
    // toggle different effects
    effect = (effect + 1) % 3
    if (effect === 0){
        pixels.clear()
        pixels.setAt(0, 0xff0000)
        await led.show()
    } else if (effect === 1) {
        fillRainbow(pixels, {
            brightness: 64
        })
        await led.show()
    } else {
        const palette = new Palette(hex`1f0000 001f00 00001f 1f1f00 1f001f 00001f 1f1f1f 000000 1f0000 001f00 00001f 1f1f00 1f001f`)
        fillPalette(pixels, palette)
        await led.show()
    }

})
