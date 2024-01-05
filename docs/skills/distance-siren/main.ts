import { Distance,Led,Buzzer,sleep } from "@devicescript/core";
import { Palette } from "@devicescript/graphics";
import { fillPalette } from "@devicescript/runtime";

const ultrasonic = new Distance()
const led = new Led()
const pixels = await led.buffer()
let isFlashing = false

const flash = async()=>{
  fillPalette(pixels, new Palette(hex`ff0000`))
  await led.show()
  await sleep(500)
  fillPalette(pixels, new Palette(hex`000000`))
  await led.show()
}

setInterval(async()=>{
  if(isFlashing) return
  let distance = await ultrasonic.reading.read()
  if(distance<0.30){
    await flash()
  }
},1000)