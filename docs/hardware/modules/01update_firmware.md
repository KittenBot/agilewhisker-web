# 01Update Firmware

## Introduction

Some Jacdac modules have the capability to update firmware. They are based on the STM32G0 chip. Therefore, the following four modules support firmware updates:

1. Jacdac-Accelerometer
2. Jacdac-RGB Strip
3. Jacdac-Servo
4. Jacdac-Env Sensor

![jacdacG0](https://learn.kittenbot.cn/2024md_pic/202402271847277.png)



## Update Procedure

1. Firstly, use the motherboard (which can be a Microbit, keyboard, Grapebit, etc.) to connect the module that requires firmware update.

> The motherboard firmware should include Jacdac support.

![image-20240302142245528](https://learn.kittenbot.cn/2024md_pic/202403021422688.png)

2. Open the corresponding module update page and click on "Connect."

![image-20240302143153280](https://learn.kittenbot.cn/2024md_pic/202403021431324.png)

3. Click on "Update" and wait for the firmware update to complete.

![image-20240302142539733](https://learn.kittenbot.cn/2024md_pic/202403021425793.png)



## FAQ

Q:The hardware is unable to establish a connection?

A:1.Check if other webpages are able to establish a connection with the hardware (such as https://makecode.microbit.org/ or https://microsoft.github.io/jacdac-docs/dashboard/).

  2.The hardware needs to have the Jacdac firmware embedded.
