import { Accelerometer, PCEvent,Button } from "@devicescript/core";

const accelerometer = new Accelerometer()
const pc = new PCEvent()
const btn = new Button()

let lastMove = {x:0,y:0}
setInterval(async()=>{
  const value = await accelerometer.reading.read()
  const x = value[0]
  const y = value[1]
  if(Math.abs(lastMove.x-x)>=200&&Math.abs(lastMove.y-y)>=150){
    lastMove = {x,y}
    await pc.moveMouse(`${x},${y}`)
  }
},80)

//按钮按下松开，模拟鼠标按下松开000
btn.down.subscribe(async()=>{
  await pc.clickMouse('down')
})
btn.up.subscribe(async()=>{
  await pc.clickMouse('up')
})