import { Accelerometer, PCEvent,Button } from "@devicescript/core";

const accelerometer = new Accelerometer()
const pc = new PCEvent()
const btn = new Button()

// 移动平均滤波的窗口大小
const windowSize = 5;
// 初始化加速度计值数组
const accelerometerValues = [[0,0],[0,0],[0,0],[0,0],[0,0]]

// 更新加速度计值
function updateAccelerometerValues(newValues: number[]) {
  accelerometerValues.shift();
  accelerometerValues.push(newValues);
}

// 平均加速度计值
function getAverageAccelerometerValues() {
  let sumX = 0;
  let sumY = 0;

  for (let i = 0; i < windowSize; i++) {
    sumX += accelerometerValues[i][0];
    sumY += accelerometerValues[i][1];
  }

  const averageX = sumX / windowSize;
  const averageY = sumY / windowSize;

  return [averageX, averageY];
}

accelerometer.reading.subscribe(async(value)=>{
  updateAccelerometerValues([value[0],value[1]])
  const averageValues = getAverageAccelerometerValues()
  await pc.moveMouse(`${averageValues[0]},${averageValues[1]}`)
})

//按钮按下松开，模拟鼠标按下松开
btn.down.subscribe(async()=>{
  await pc.clickMouse('down')
})
btn.up.subscribe(async()=>{
  await pc.clickMouse('up')
})