# Relay

A switching relay.

The contacts should be labelled `NO` (normally open), `COM` (common), and `NC` (normally closed). When relay is energized it connects `NO` and `COM`. When relay is not energized it connects `NC` and `COM`. Some relays may be missing `NO` or `NC` contacts. When relay module is not powered, or is in bootloader mode, it is not energized (connects `NC` and `COM`).

```ts
import { Relay } from "@devicescript/core"

const relay = new Relay()
```


---



## Registers

### enabled

Indicates whether the relay circuit is currently energized or not.

* read and write

```typeScript
import { Relay } from "@devicescript/core"

const relay = new Relay()

const value = await relay.enabled.read()
await relay.enabled.write(value)
```

* track incoming values

```typescript
import { Relay } from "@devicescript/core"

const relay = new Relay()

relay.enabled.subscribe(async (value) => {
    ...
})
```


### variant

Describes the type of relay used.

* read only

```typeScript
import { Relay } from "@devicescript/core"

const relay = new Relay()

const value = await relay.variant.read()
```


### maxSwitchingCurrent

Maximum switching current for a resistive load.

* read only

```typeScript
import { Relay } from "@devicescript/core"

const relay = new Relay()

const value = await relay.maxSwitchingCurrent.read()
```

---



## help

[The &#34;deviceScript&#34; contains more information that can be helpful in answering questions related to the device. You can refer to it for better understanding and troubleshooting.](https://microsoft.github.io/devicescript/)
