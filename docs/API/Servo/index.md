# Servo

Servo is a small motor with arm that can be pointing at a specific direction. Typically a servo angle is between 0° and 180° where 90° is the middle resting position.

The `min_pulse/max_pulse` may be read-only if the servo is permanently affixed to its Jacdac controller.

```typescript
import { Servo } from "@devicescript/core"

const servo = new Servo()
```

---

## Registers

### angle

Specifies the angle of the arm (request).

* read and write

```typeScript
import { Servo } from "@devicescript/core"

const servo = new Servo()

const value = await servo.angle.read()
await servo.angle.write(value)
```

* track incoming values

```typescript
import { Servo } from "@devicescript/core"

const servo = new Servo()

servo.angle.subscribe(async (value) => {
    ...
})
```


### enabled

Turn the power to the servo on/off.

* read and write

```typeScript
import { Servo } from "@devicescript/core"

const servo = new Servo()

const value = await servo.enabled.read()
await servo.enabled.write(value)
```

* track incoming values

```typescript
import { Servo } from "@devicescript/core"

const servo = new Servo()

servo.enabled.subscribe(async (value) => {
    ...
})
```


### offset

Correction applied to the angle to account for the servo arm drift.

* read and write

```typeScript
import { Servo } from "@devicescript/core"

const servo = new Servo()

const value = await servo.offset.read()
await servo.offset.write(value)
```

* track incoming values

```typescript
import { Servo } from "@devicescript/core"

const servo = new Servo()

servo.offset.subscribe(async (value) => {
    ...
})
```


### minValue

Lowest angle that can be set, typically 0 °.

* read only

```typeScript
import { Servo } from "@devicescript/core"

const servo = new Servo()

const value = await servo.minValue.read()
```


### minPulse

The length of pulse corresponding to lowest angle.

* read and write

```typeScript
import { Servo } from "@devicescript/core"

const servo = new Servo()

const value = await servo.minPulse.read()
await servo.minPulse.write(value)
```

* track incoming values

```typescript
import { Servo } from "@devicescript/core"

const servo = new Servo()

servo.minPulse.subscribe(async (value) => {
    ...
})
```


### maxValue

Highest angle that can be set, typically 180°.

* read only

```typeScript
import { Servo } from "@devicescript/core"

const servo = new Servo()
// ...
const value = await servo.maxValue.read()
```


### maxPulse

The length of pulse corresponding to highest angle.

* read and write

```typeScript
import { Servo } from "@devicescript/core"

const servo = new Servo()

const value = await servo.maxPulse.read()
await servo.maxPulse.write(value)
```

* track incoming values

```typescript
import { Servo } from "@devicescript/core"

const servo = new Servo()

servo.maxPulse.subscribe(async (value) => {
    ...
})
```


### stallTorque

The servo motor will stop rotating when it is trying to move a `stall_torque` weight at a radial distance of `1.0` cm.

* read only

```typeScript
import { Servo } from "@devicescript/core"

const servo = new Servo()

const value = await servo.stallTorque.read()
```


### responseSpeed

Time to move 60°.

* read only

```typeScript
import { Servo } from "@devicescript/core"

const servo = new Servo()

const value = await servo.responseSpeed.read()
```


### reading

The current physical position of the arm, if the device has a way to sense the position.

* read only

```typeScript
import { Servo } from "@devicescript/core"

const servo = new Servo()

const value = await servo.reading.read()
```

* track incoming values

```typescript
import { Servo } from "@devicescript/core"

const servo = new Servo()

servo.reading.subscribe(async (value) => {
    ...
})
```

---



## help

[The &#34;deviceScript&#34; contains more information that can be helpful in answering questions related to the device. You can refer to it for better understanding and troubleshooting.](https://microsoft.github.io/devicescript/)
