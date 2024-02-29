# Github

Notification for receiving new emails.

```typescript
import * as ds from "@devicescript/core"

const github = new ds.GithubClient()
```

---

## Registers

### requestStatus(body: string)

Requesting to check the commit status of the GitHub repository.

```typeScript
import * as ds from "@devicescript/core"

const github = new ds.GithubClient()
const body = JSON.stringify({
    owner: "", // Repository owner
    repo: "", // Repository name
    commitId: "", // commit hash
    token: "" // github token
})
await github.requestStatus(body)
```

---

## Events

### listenStatus

Listen for the commit status returned by GitHub.

```typescript
github.listenStatus.subscribe((status) => {
    if(status === 'success') {
        ...
    }else if(status === 'failure') {
        ...
    }else if(status === 'pending'){
        ...
    }

})
```

## help

[The &#34;deviceScript&#34; contains more information that can be helpful in answering questions related to the device. You can refer to it for better understanding and troubleshooting.](https://microsoft.github.io/devicescript/)
