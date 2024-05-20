import * as ds from "@devicescript/core"


const cd = await new ds.CloudAdapter()

cd.onJson.subscribe((data) => {
    console.log("data: "+ data)
})

setInterval(async () => {
    await cd.uploadJson("jacdac", JSON.stringify({ "hello": "world"}))
}, 3000)