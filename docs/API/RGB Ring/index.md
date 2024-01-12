# RGB Ring

A controller for displays of individually controlled RGB LEDs.

For 64 or less LEDs, the service should support the pack the pixels in the pixels register. Beyond this size, the register should return an empty payload as the amount of data exceeds the size of a packet. Typically services that use more than 64 LEDs will run on the same MCU and will maintain the pixels buffer internally.

```typescript
import { Led } from "@devicescript/core"

const led = new Led()
```

***Additional runtime support is provided for `Led` by importing the `@devicescript/runtime` package.***

***Please refer to the [LEDs developer documentation](https://microsoft.github.io/devicescript/developer/leds).***

```typescript
import { Led } from "@devicescript/core"
import "@devicescript/runtime"

const led = new Led()
```

---

## Registers

### pixels

A buffer of 24bit RGB color entries for each LED, in R, G, B order. When writing, if the buffer is too short, the remaining pixels are set to `#000000`; If the buffer is too long, the write may be ignored, or the additional pixels may be ignored. If the number of pixels is greater than `max_pixels_length`, the read should return an empty payload.

* track incoming values

```typescript
import { Led } from "@devicescript/core"

const led = new Led()

led.pixels.subscribe(async (value) => {
    ...
})
```

### intensity

Set the luminosity of the strip. At `0` the power to the strip is completely shut down.

* read and write

```typeScript
import { Led } from "@devicescript/core"

const led = new Led()

const value = await led.intensity.read()
await led.intensity.write(value)
```

* track incoming values

```typescript
import { Led } from "@devicescript/core"

const led = new Led()

led.intensity.subscribe(async (value) => {
    ...
})
```

### actualBrightness

This is the luminosity actually applied to the strip. May be lower than `brightness` if power-limited by the `max_power` register. It will rise slowly (few seconds) back to `brightness` is limits are no longer required.

* read only

```typeScript
import { Led } from "@devicescript/core"

const led = new Led()

const value = await led.actualBrightness.read()
```

* track incoming values

```typescript
import { Led } from "@devicescript/core"

const led = new Led()

led.actualBrightness.subscribe(async (value) => {
    ...
})
```

### numPixels

Specifies the number of pixels in the strip.

* read only

```typeScript
import { Led } from "@devicescript/core"

const led = new Led()

const value = await led.numPixels.read()
```

### numColumns

If the LED pixel strip is a matrix, specifies the number of columns.

* read only

```typeScript
import { Led } from "@devicescript/core"

const led = new Led()
// ...
const value = await led.numColumns.read()
```

### maxPower

Limit the power drawn by the light-strip (and controller).

* read and write

```typeScript
import { Led } from "@devicescript/core"

const led = new Led()

const value = await led.maxPower.read()
await led.maxPower.write(value)
```

* track incoming values

```typescript
import { Led } from "@devicescript/core"

const led = new Led()

led.maxPower.subscribe(async (value) => {
    ...
})
```

### ledsPerPixel

If known, specifies the number of LEDs in parallel on this device. The actual number of LEDs is `num_pixels * leds_per_pixel`.

* read only

```typeScript
import { Led } from "@devicescript/core"

const led = new Led()

const value = await led.ledsPerPixel.read()
```

### waveLength

If monochrome LED, specifies the wave length of the LED. Register is missing for RGB LEDs.

* read only

```typeScript
import { Led } from "@devicescript/core"

const led = new Led()

const value = await led.waveLength.read()
```

### luminousIntensity

The luminous intensity of all the LEDs, at full brightness, in micro candella.

* read only

```typeScript
import { Led } from "@devicescript/core"

const led = new Led()

const value = await led.luminousIntensity.read()
```

### variant

Specifies the shape of the light strip.

* read only

```typeScript
import { Led } from "@devicescript/core"

const led = new Led()

const value = await led.variant.read()
```

---

## help

[The &#34;deviceScript&#34; contains more information that can be helpful in answering questions related to the device. You can refer to it for better understanding and troubleshooting.](https://microsoft.github.io/devicescript/)
