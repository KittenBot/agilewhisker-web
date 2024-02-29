# Email

Notification for receiving new emails.

```typescript
import * as ds from "@devicescript/core"

const email = new ds.EmailClient()
```

---

## Registers

### openListen(body: string)

Open the new email listener.

```typeScript
import * as ds from "@devicescript/core"

const email = new ds.EmailClient()
const body = JSON.stringify({
  email: '', // email address
  password: '', // email password
})

await email.openListen(body)
```

### closeListen()

Turn off the new email listener.


```typeScript
import * as ds from "@devicescript/core"

const email = new ds.EmailClient()

await email.closeListen()
```

---

## Events

### listen

When a new email is detected.

```typescript
email.listen.subscribe(() => {
    ...
})
```

## help

[The &#34;deviceScript&#34; contains more information that can be helpful in answering questions related to the device. You can refer to it for better understanding and troubleshooting.](https://microsoft.github.io/devicescript/)
