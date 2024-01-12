# Light Sensor

A sensor that measures strength and polarity of magnetic field.

```typescript
import { LightLevel } from "@devicescript/core"

const lightLevel = new LightLevel()
```

---

## Registers

### reading

Detect light level

* read only

```typeScript
import { LightLevel } from "@devicescript/core"

const lightLevel = new LightLevel()

const value = await lightLevel.reading.read()
```

* track incoming values

```typescript
import { LightLevel } from "@devicescript/core"

const lightLevel = new LightLevel()
// ...
lightLevel.reading.subscribe(async (value) => {
    ...
})
```

### readingError

Absolute estimated error of the reading value

* read only

```typeScript
import { LightLevel } from "@devicescript/core"

const lightLevel = new LightLevel()

const value = await lightLevel.readingError.read()
```

* track incoming values

```typescript
import { LightLevel } from "@devicescript/core"

const lightLevel = new LightLevel()

lightLevel.readingError.subscribe(async (value) => {
    ...
})
```

### variant

The type of physical sensor.

* read only

```typescript
import { LightLevel } from "@devicescript/core"

const lightLevel = new LightLevel()

const value = await lightLevel.variant.read()
```

---

## help

[The &#34;deviceScript&#34; contains more information that can be helpful in answering questions related to the device. You can refer to it for better understanding and troubleshooting.](https://microsoft.github.io/devicescript/)
