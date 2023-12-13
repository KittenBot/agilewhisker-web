const aedes = require('aedes')
const net = require('net')
const {
    jdunpack,
    JDServiceServer,
    CloudAdapterServer
} =  require('jacdac-ts')


class MQTTServer extends CloudAdapterServer {
    constructor(options={}) {
        super({
            connectionName: "MQTT",
        })
    }
}

exports.MQTTServer = MQTTServer
