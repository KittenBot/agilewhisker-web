# RGB Strip

A controller for strips of individually controlled RGB LEDs.


---



## About

### Light programs

light service defines a domain-specific language for describing light animations and efficiently transmitting them over wire. For short LED displays, less than 64 LEDs, you can also use the [LED service](https://microsoft.github.io/devicescript/api/clients/led).

Light commands are not Jacdac commands. Light commands are efficiently encoded as sequences of bytes and typically sent as payload of run command.

#### Definitions:

* `P` - position in the strip
* `R` - number of repetitions of the command
* `N` - number of pixels affected by the command
* `C` - single color designation
* `C+` - sequence of color designations

#### Update modes:

* `0` - replace
* `1` - add RGB
* `2` - subtract RGB
* `3` - multiply RGB (by c/128); each pixel value will change by at least 1

#### Program commands:

* `0xD0: setall C+` - set all pixels in current range to given color pattern
* `0xD1: fade C+` - set pixels in current range to colors between colors in sequence
* `0xD2: fadehsv C+` - similar to `fade()`, but colors are specified and faded in HSV
* `0xD3: rotfwd K` - rotate (shift) pixels by `K` positions away from the connector
* `0xD4: rotback K` - same, but towards the connector
* `0xD5: show M=50` - send buffer to strip and wait `M` milliseconds
* `0xD6: range P=0 N=length W=1 S=0` - range from pixel `P`, `N` pixels long (currently unsupported: every `W` pixels skip `S` pixels)
* `0xD7: mode K=0` - set update mode
* `0xD8: tmpmode K=0` - set update mode for next command only
* `0xCF: setone P C` - set one pixel at `P` (in current range) to given color
* `mult V` - macro to multiply current range by given value (float)

#### A number `k` is encoded as follows:

* `0 <= k < 128` -> `k`
* `128 <= k < 16383` -> `0x80 | (k >> 8), k & 0xff`
* bigger and negative numbers are not supported

Thus, bytes `0xC0-0xFF` are free to use for commands.

#### Formats:

* `0xC1, R, G, B` - single color parameter
* `0xC2, R0, G0, B0, R1, G1, B1` - two color parameter
* `0xC3, R0, G0, B0, R1, G1, B1, R2, G2, B2` - three color parameter
* `0xC0, N, R0, G0, B0, ..., R(N-1), G(N-1), B(N-1)` - `N` color parameter
* `0xCF, <number>, R, G, B` - `set1` special format

Commands are encoded as command byte, followed by parameters in the order from the command definition.

The `setone()` command has irregular encoding to save space - it is byte `0xCF` followed by encoded number, and followed by 3 bytes of color.

```ts
import { LedStrip } from "@devicescript/core"

const ledStrip = new LedStrip()
```


## Commands

### run

Run the given light "program". See service description for details.

```ts
ledStrip.run(program: Buffer):Promise<void>
```


## Registers

### intensity

Set the luminosity of the strip. At `0` the power to the strip is completely shut down.

* read and write

```typeScript
import { LedStrip } from "@devicescript/core"

const ledStrip = new LedStrip()

const value = await ledStrip.intensity.read()
await ledStrip.intensity.write(value)
```

* track incoming values

```typescript
import { LedStrip } from "@devicescript/core"

const ledStrip = new LedStrip()

ledStrip.intensity.subscribe(async (value) => {
    ...
})
```


### actualBrightness

This is the luminosity actually applied to the strip. May be lower than `brightness` if power-limited by the `max_power` register. It will rise slowly (few seconds) back to `brightness` is limits are no longer required.

* read only

```typeScript
import { LedStrip } from "@devicescript/core"

const ledStrip = new LedStrip()

const value = await ledStrip.actualBrightness.read()
```

* track incoming values

```typescript
import { LedStrip } from "@devicescript/core"

const ledStrip = new LedStrip()

ledStrip.actualBrightness.subscribe(async (value) => {
    ...
})
```


### lightType

Specifies the type of light strip connected to controller. Controllers which are sold with lights should default to the correct type and could not allow change.

* read and write

```typeScript
import { LedStrip } from "@devicescript/core"

const ledStrip = new LedStrip()

const value = await ledStrip.lightType.read()
await ledStrip.lightType.write(value)
```

* track incoming values

```typescript
import { LedStrip } from "@devicescript/core"

const ledStrip = new LedStrip()

ledStrip.lightType.subscribe(async (value) => {
    ...
})
```


### numPixels

Specifies the number of pixels in the strip. Controllers which are sold with lights should default to the correct length and could not allow change. Increasing length at runtime leads to ineffective use of memory and may lead to controller reboot.

* read and write

```typeScript
import { LedStrip } from "@devicescript/core"

const ledStrip = new LedStrip()

const value = await ledStrip.numPixels.read()
await ledStrip.numPixels.write(value)
```

* track incoming values

```typescript
import { LedStrip } from "@devicescript/core"

const ledStrip = new LedStrip()

ledStrip.numPixels.subscribe(async (value) => {
    ...
})
```


### numColumns

If the LED pixel strip is a matrix, specifies the number of columns. Otherwise, a square shape is assumed. Controllers which are sold with lights should default to the correct length and could not allow change. Increasing length at runtime leads to ineffective use of memory and may lead to controller reboot.

* read and write

```typeScript
import { LedStrip } from "@devicescript/core"

const ledStrip = new LedStrip()

const value = await ledStrip.numColumns.read()
await ledStrip.numColumns.write(value)
```

* track incoming values

```typescript
import { LedStrip } from "@devicescript/core"

const ledStrip = new LedStrip()

ledStrip.numColumns.subscribe(async (value) => {
    ...
})
```


### maxPower

Limit the power drawn by the light-strip (and controller).

* read and write

```typeScript
import { LedStrip } from "@devicescript/core"

const ledStrip = new LedStrip()

const value = await ledStrip.maxPower.read()
await ledStrip.maxPower.write(value)
```

* track incoming values

```typescript
import { LedStrip } from "@devicescript/core"

const ledStrip = new LedStrip()

ledStrip.maxPower.subscribe(async (value) => {
    ...
})
```


### maxPixels

The maximum supported number of pixels. All writes to `num_pixels` are clamped to `max_pixels`.

* read only

```typeScript
import { LedStrip } from "@devicescript/core"

const ledStrip = new LedStrip()

const value = await ledStrip.maxPixels.read()
```


### numRepeats

How many times to repeat the program passed in `run` command. Should be set before the `run` command. Setting to `0` means to repeat forever.

* read and write

```typeScript
import { LedStrip } from "@devicescript/core"

const ledStrip = new LedStrip()

const value = await ledStrip.numRepeats.read()
await ledStrip.numRepeats.write(value)
```

* track incoming values

```typescript
import { LedStrip } from "@devicescript/core"

const ledStrip = new LedStrip()

ledStrip.numRepeats.subscribe(async (value) => {
    ...
})
```


### variant

Specifies the shape of the light strip.

* read only

```typeScript
import { LedStrip } from "@devicescript/core"

const ledStrip = new LedStrip()

const value = await ledStrip.variant.read()
```


## Syntax

The input is split at spaces. The following tokens are supported:

* a command name (see below)
* a decimal number (0-16383)
* a color, in HTML syntax '#ff0000' for red, etc
* a single '#' which will take color (24-bit number) from list of arguments; the list of arguments has an array or colors it will encode all elements of the array
* a single '%' which takes a number (0-16383) from the list of arguments

### Commands

* `setall C+` - set all pixels in current range to given color pattern
* `fade C+` - set pixels in current range to colors between colors in sequence
* `fadehsv C+` - similar to `fade()`, but colors are specified and faded in HSV
* `rotfwd K` - rotate (shift) pixels by `K` positions away from the connector
* `rotback K` - same, but towards the connector
* `show M=50` - send buffer to strip and wait `M` milliseconds
* `range P=0 N=length W=1 S=0` - range from pixel `P`, `N` pixels long (currently unsupported: every `W` pixels skip `S` pixels)
* `mode K=0` - set update mode
* `tmpmode K=0` - set update mode for next command only
* `setone P C` - set one pixel at `P` (in current range) to given color
* `mult V` - macro to multiply current range by given value (float)
* `C+` means one or more colors
* `V` is a floating point number
* Other letters (`K`, `M`, `N`, `P`, `W`, `S`) represent integers, with their default values if omitted


### Examples

```ts
import{ LedStrip }from"@devicescript-core"
const led =newLedStrip()

// turn off all lights
await led.runEncoded("setall #000000")
// the same
await led.runEncoded("setall #",0)
// set first pixel to red, last to blue, and interpolate the ones in between
await led.runEncoded("fade # #",0xff0000,0x0000ff)
// the same; note the usage of an array []
await led.runEncoded("fade #",[0xff0000,0x0000ff])
// set pixels 2-7 to white
await led.runEncoded("range 2 5 setall #ffffff")
// the same
await led.runEncoded("range % % setall #",2,5,0xffffff)
```

---



## help

[The &#34;deviceScript&#34; contains more information that can be helpful in answering questions related to the device. You can refer to it for better understanding and troubleshooting.](https://microsoft.github.io/devicescript/)
