# Button

A push-button, which returns to inactive position when not operated anymore.

```typescript
import { Button } from "@devicescript/core"

const button = new Button()
```



---



## Registers

### reading

Indicates the pressure state of the button, where `0` is open.

* read only

```typeScript
import { Button } from "@devicescript/core"

const button = new Button()

const value = await button.reading.read()
```

* track incoming values

```typescript
import { Button } from "@devicescript/core"

const button = new Button()
// ...
button.reading.subscribe(async (value) => {
    ...
})
```



### analog

Indicates if the button provides analog `pressure` readings.

* read only

```typeScript
import { Button } from "@devicescript/core"

const button = new Button()

const value = await button.analog.read()
```


### pressed

Determines if the button is pressed currently.

If the event `down` or `hold` is observed, `pressed` becomes true; if `up` is observed, `pressed` becomes false. The client should initialize `pressed` to false.

* read only

```typeScript
import { Button } from "@devicescript/core"

const button = new Button()

const value = await button.pressed.read()
```

* track incoming values

```typescript
import { Button } from "@devicescript/core"

const button = new Button()
// ...
button.pressed.subscribe(async (value) => {
    ...
})
```

---

## Events

### down

Emitted when button goes from inactive to active.

```typescript
button.down.subscribe(() => {

})
```


### up

Emitted when button goes from active to inactive. The 'time' parameter records the amount of time between the down and up events.

```typescript
button.up.subscribe(() => {

})
```


### hold

Emitted when the press time is greater than 500ms, and then at least every 500ms as long as the button remains pressed. The 'time' parameter records the the amount of time that the button has been held (since the down event).

```typescript
button.hold.subscribe(() => {

})
```


---

## help

[The &#34;deviceScript&#34; contains more information that can be helpful in answering questions related to the device. You can refer to it for better understanding and troubleshooting.](https://microsoft.github.io/devicescript/)
