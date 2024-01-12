# Haptic Output

A vibration motor.

```ts
import { VibrationMotor } from "@devicescript/core"

const vibrationMotor = new VibrationMotor()
```


---



## Commands

### vibrate

Starts a sequence of vibration and pauses. To stop any existing vibration, send an empty payload.

```ts
vibrationMotor.vibrate(duration:number, intensity:number):Promise<void>
```


## Registers

### maxVibrations

The maximum number of vibration sequences supported in a single packet.

* read only

```typescript
import { VibrationMotor } from "@devicescript/core"

const vibrationMotor = new VibrationMotor()

const value = await vibrationMotor.maxVibrations.read()
```

---



## help

[The &#34;deviceScript&#34; contains more information that can be helpful in answering questions related to the device. You can refer to it for better understanding and troubleshooting.](https://microsoft.github.io/devicescript/)
