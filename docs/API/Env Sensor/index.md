# Env Sensor

Sensor for measuring external environmental humidity and temperature.

```typescript
import { Humidity,Temperature } from "@devicescript/core"

const humidity = new Humidity()
const temperature = new Temperature()
```

---

## Registers

### reading

The temperature.

* read only

```typeScript
import { Humidity,Temperature } from "@devicescript/core"

const temperature = new Temperature()
const humidity = new Humidity()

const temp = await temperature.reading.read()
const hum = await humidity.reading.read()
```

* track incoming values

```typescript
import { Humidity,Temperature } from "@devicescript/core"

const temperature = new Temperature()
const humidity = new Humidity()

temperature.reading.subscribe(async (value) => {
    ...
})
humidity.reading.subscribe(async (value) => {
    ...
})
```

### minReading

Lowest temperature that can be reported.

* read only

```typeScript
import { Humidity,Temperature } from "@devicescript/core"

const temperature = new Temperature()
const humidity = new Humidity()

const temp = await temperature.minReading.read()
const hum = await humidity.minReading.read()
```

### maxReading

Highest temperature that can be reported.

* read only

```typeScript
import { Humidity,Temperature } from "@devicescript/core"

const temperature = new Temperature()
const humidity = new Humidity()

const temp = await temperature.maxReading.read()
const hum = await humidity.maxReading.read()
```

### readingError

The real temperature is between `temperature - temperature_error` and `temperature + temperature_error`.

* read only

```typeScript
import { Humidity,Temperature } from "@devicescript/core"

const temperature = new Temperature()
const humidity = new Humidity()

const temp = await temperature.readingError.read()
const hum = await humidity.readingError.read()
```

* track incoming values

```typescript
import { Humidity,Temperature } from "@devicescript/core"

const temperature = new Temperature()
const humidity = new Humidity()

temperature.readingError.subscribe(async (value) => {
    ...
})
humidity.readingError.subscribe(async (value) => {
    ...
})
```

### variant

Specifies the type of thermometer.

* read only

```typeScript
import { Humidity,Temperature } from "@devicescript/core"

const temperature = new Temperature()
const humidity = new Humidity()

const temp = await temperature.variant.read()
const hum = await humidity.variant.read()
```

---

## help

[The &#34;deviceScript&#34; contains more information that can be helpful in answering questions related to the device. You can refer to it for better understanding and troubleshooting.](https://microsoft.github.io/devicescript/)
