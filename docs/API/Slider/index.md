# Slider

A slider or rotary potentiometer.

```typescript
import { Potentiometer } from "@devicescript/core"

const potentiometer = new Potentiometer()
```


---



## Registers

### reading

The relative position of the slider.

* read only

```typeScript
import { Potentiometer } from "@devicescript/core"

const potentiometer = new Potentiometer()

const value = await potentiometer.reading.read()
```

* track incoming values

```typescript
import { Potentiometer } from "@devicescript/core"

const potentiometer = new Potentiometer()

potentiometer.reading.subscribe(async (value) => {
    ...
})
```


### variant

Specifies the physical layout of the potentiometer.

* read only

```typescript
import { Potentiometer } from "@devicescript/core"

const potentiometer = new Potentiometer()
// ...
const value = await potentiometer.variant.read()
```

---



## help

[The &#34;deviceScript&#34; contains more information that can be helpful in answering questions related to the device. You can refer to it for better understanding and troubleshooting.](https://microsoft.github.io/devicescript/)
