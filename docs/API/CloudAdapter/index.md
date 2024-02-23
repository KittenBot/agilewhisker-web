# Cloud Adapter

Supports cloud connections to upload and download data.

```typescript
import * as ds from "@devicescript/core"

const client = new ds.MQTTClient()
```

---

## Registers

### uploadJson(topic:string, json:string)

Upload a JSON-encoded message to the cloud.

```typeScript
import * as ds from "@devicescript/core"

const mqtt = new ds.MQTTClient()

await mqtt.uploadJson('jacdac','') // topic:string, json:string
```

### uploadBinary(topic:string, bytes:Uint8Array)

Upload a binary message to the cloud.

```typeScript
import * as ds from "@devicescript/core"

const mqtt = new ds.MQTTClient()

await mqtt.uploadBinary('jacdac',Uint8Array) // topic:string, bytes:Uint8Array

```

---

## Events

### onJson([topic:string, json:string])

Upload a JSON-encoded message to the cloud.

```typescript
mqtt.onJson.subscribe(async (json:[topic:string,json:string]) => {
   ...
})
```

### onBinary([topic:string, payload:Uint8Array])

Emitted when cloud send us a binary message.

```typescript
mqtt.onBinary.subscribe(async (json:[topic:string,payload:Uint8Array]) => {
   ...
})
```

## help

[The &#34;deviceScript&#34; contains more information that can be helpful in answering questions related to the device. You can refer to it for better understanding and troubleshooting.](https://microsoft.github.io/devicescript/)
