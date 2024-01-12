# Ultrasonic Sensor

A sensor that determines the distance of an object without any physical contact involved.

```ts
import { Distance } from "@devicescript/core"

const distance = new Distance()
```


---



## Registers

### reading

Current distance from the object.

* read only

```typeScript
import { Distance } from "@devicescript/core"

const distance = new Distance()

const value = await distance.reading.read()
```

* track incoming values

```typescript
import { Distance } from "@devicescript/core"

const distance = new Distance()

distance.reading.subscribe(async (value) => {
    ...
})
```



### readingError

Absolute error on the reading value.

* read only

```typeScript
import { Distance } from "@devicescript/core"

const distance = new Distance()

const value = await distance.readingError.read()
```

* track incoming values

```typescript
import { Distance } from "@devicescript/core"

const distance = new Distance()

distance.readingError.subscribe(async (value) => {
    ...
})
```


### minReading

Minimum measurable distance.

* read only

```typeScript
import { Distance } from "@devicescript/core"

const distance = new Distance()

const value = await distance.maxReading.read()
```


### maxReading

Maximum measurable distance.

* read only

```typeScript
import { Distance } from "@devicescript/core"

const distance = new Distance()

const value = await distance.minReading.read()
```


### variant

Determines the type of sensor used.

* read only

```typeScript
import { Distance } from "@devicescript/core"

const distance = new Distance()

const value = await distance.variant.read()
```


---



## help

[The &#34;deviceScript&#34; contains more information that can be helpful in answering questions related to the device. You can refer to it for better understanding and troubleshooting.](https://microsoft.github.io/devicescript/)
