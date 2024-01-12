# Magnet Sensor

A sensor that measures strength and polarity of magnetic field.

```ts
import { MagneticFieldLevel } from "@devicescript/core"

const magneticFieldLevel = new MagneticFieldLevel()
```

---

## Registers

### reading

Indicates the strength of magnetic field between -1 and 1. When no magnet is present the value should be around 0. For analog sensors, when the north pole of the magnet is on top of the module and closer than south pole, then the value should be positive. For digital sensors, the value should either `0` or `1`, regardless of polarity.

* read only

```typeScript
import { MagneticFieldLevel } from "@devicescript/core"

const magneticFieldLevel = new MagneticFieldLevel()

const value = await magneticFieldLevel.reading.read()
```

* track incoming values

```typescript
import { MagneticFieldLevel } from "@devicescript/core"

const magneticFieldLevel = new MagneticFieldLevel()
// ...
magneticFieldLevel.reading.subscribe(async (value) => {
    ...
})
```

### detected

Determines if the magnetic field is present. If the event `active` is observed, `detected` is true; if `inactive` is observed, `detected` is false.

* read only

```typeScript
import { MagneticFieldLevel } from "@devicescript/core"

const magneticFieldLevel = new MagneticFieldLevel()

const value = await magneticFieldLevel.detected.read()
```

* track incoming values

```typescript
import { MagneticFieldLevel } from "@devicescript/core"

const magneticFieldLevel = new MagneticFieldLevel()
// ...
magneticFieldLevel.detected.subscribe(async (value) => {
    ...
})
```

### variant

Determines which magnetic poles the sensor can detected, and whether or not it can measure their strength or just presence.

* read only

```typescript
import { MagneticFieldLevel } from "@devicescript/core"

const magneticFieldLevel = new MagneticFieldLevel()
// ...
const value = await magneticFieldLevel.variant.read()
```

---

## Events

### active

Emitted when strong-enough magnetic field is detected.

```typescript
magneticFieldLevel.active.subscribe(()=>{

})
```

### inactive

Emitted when strong-enough magnetic field is no longer detected.

```typescript
magneticFieldLevel.inactive.subscribe(() => {

})
```

---

## help

[The &#34;deviceScript&#34; contains more information that can be helpful in answering questions related to the device. You can refer to it for better understanding and troubleshooting.](https://microsoft.github.io/devicescript/)
