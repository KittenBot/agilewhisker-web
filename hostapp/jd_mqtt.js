const aedes = require('aedes')()
const net = require('net')
const {
    jdunpack,
    JDServiceServer,
    CloudAdapterServer
} =  require('jacdac-ts')


class MQTTServer extends CloudAdapterServer {
    // TODO: this is mqtt server, cloud adapter should be separate as client
    constructor(options={}) {
        super({
            connectionName: "mqtt://localhost:1883",
        })
        this.start()
    }

    async start() {
        aedes.addListener('clientReady', (client) => {
            console.log("client ready", client.id)
        })
        aedes.addListener('clientDisconnect', (client) => {
            console.log("client disconnect", client.id)
        })

        const server = net.createServer(aedes.handle)
        server.listen(1883)
        console.log("MQTT server started")
        this.connected = true
    }
}

exports.MQTTServer = MQTTServer
