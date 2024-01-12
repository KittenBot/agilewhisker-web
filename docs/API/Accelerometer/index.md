# Accelerometer

A 3-axis accelerometer.

An accelerometer module should translate acceleration values as follows:

| Orientation           | X value (g) | Y value (g) | Z value (g) |
| --------------------- | ----------- | ----------- | ----------- |
| Module lying flat     | 0           | 0           | -1          |
| Module on left edge   | -1          | 0           | 0           |
| Module on bottom edge | 0           | 1           | 0           |

```typescript
import { Accelerometer } from "@devicescript/core"

const accelerometer = new Accelerometer()
```

## Registers

### reading

Indicates the current forces acting on accelerometer.

* track incoming values

```typescript
import { Accelerometer } from "@devicescript/core"

const accelerometer = new Accelerometer()

accelerometer.reading.subscribe(async (value) => {
    ...
})
```

### readingError

Error on the reading value.

* read only

```typeScript
import { Accelerometer } from "@devicescript/core"

const accelerometer = new Accelerometer()

const value = await accelerometer.readingError.read()
```

* track incoming values

```typescript
import { Accelerometer } from "@devicescript/core"

const accelerometer = new Accelerometer()

accelerometer.readingError.subscribe(async (value) => {
    ...
})
```

### readingRange

Configures the range forces detected. The value will be "rounded up" to one of `max_forces_supported`.

* read and write

```typeScript
import { Accelerometer } from "@devicescript/core"

const accelerometer = new Accelerometer()
// ...
const value = await accelerometer.readingRange.read()
await accelerometer.readingRange.write(value)
```

* track incoming values

```typescript
import { Accelerometer } from "@devicescript/core"

const accelerometer = new Accelerometer()

accelerometer.readingRange.subscribe(async (value) => {
    ...
})
```

---

## Events

### tiltUp

Emitted when accelerometer is tilted in the given direction.

```typescript
accelerometer.tiltUp.subscribe(() => {

})
```

### tiltDown

Emitted when accelerometer is tilted in the given direction.

```typescript
accelerometer.tiltDown.subscribe(()=>{

})
```

### tiltLeft

Emitted when accelerometer is tilted in the given direction.

```typescript
accelerometer.tiltLeft.subscribe(()=>{

})
```

### tiltRight

Emitted when accelerometer is tilted in the given direction.

```typescript
accelerometer.tiltRight.subscribe(()=>{

})
```

### faceUp

Emitted when accelerometer is laying flat in the given direction.

```typescript
accelerometer.faceUp.subscribe(()=>{

})
```

### faceDown

Emitted when accelerometer is laying flat in the given direction.

```typescript
accelerometer.faceDown.subscribe(()=>{

})
```

### freefall

Emitted when total force acting on accelerometer is much less than 1g.

```ts
accelerometer.freefall.subscribe(()=>{

})
```

### shake

Emitted when forces change violently a few times.

```ts
accelerometer.shake.subscribe(()=>{

})
```

### force2g

Emitted when force in any direction exceeds given threshold.

```ts
accelerometer.force2g.subscribe(()=>{

})
```

### force3g

Emitted when force in any direction exceeds given threshold.

```ts
accelerometer.force3g.subscribe(()=>{

})
```

### force6g

Emitted when force in any direction exceeds given threshold.

```ts
accelerometer.force6g.subscribe(()=>{

})
```

### force8g

Emitted when force in any direction exceeds given threshold.

```ts
accelerometer.force8g.subscribe(()=>{

})
```

---

## help

[The &#34;deviceScript&#34; contains more information that can be helpful in answering questions related to the device. You can refer to it for better understanding and troubleshooting.](https://microsoft.github.io/devicescript/)
