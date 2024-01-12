# Rotary Button

An incremental rotary encoder - converts angular motion of a shaft to digital signal.

```typescript
import { RotaryEncoder } from "@devicescript/core"

const rotaryEncoder = new RotaryEncoder()
```

---

## Registers

### reading

Upon device reset starts at `0` (regardless of the shaft position). Increases by `1` for a clockwise "click", by `-1` for counter-clockwise.

* read only

```typeScript
import { RotaryEncoder } from "@devicescript/core"

const rotaryEncoder = new RotaryEncoder()

const value = await rotaryEncoder.reading.read()
```

* track incoming values

```typescript
import { RotaryEncoder } from "@devicescript/core"

const rotaryEncoder = new RotaryEncoder()
// ...
rotaryEncoder.reading.subscribe(async (value) => {
    ...
})
```


### clicksPerTurn

This specifies by how much `position` changes when the crank does 360 degree turn. Typically 12 or 24.

* read only

```typeScript
import { RotaryEncoder } from "@devicescript/core"

const rotaryEncoder = new RotaryEncoder()

const value = await rotaryEncoder.clicksPerTurn.read()
```


### clicker

The encoder is combined with a clicker. If this is the case, the clicker button service should follow this service in the service list of the device.

* read only

```typeScript
import { RotaryEncoder } from "@devicescript/core"

const rotaryEncoder = new RotaryEncoder()

const value = await rotaryEncoder.clicker.read()
```

---



## help

[The &#34;deviceScript&#34; contains more information that can be helpful in answering questions related to the device. You can refer to it for better understanding and troubleshooting.](https://microsoft.github.io/devicescript/)
