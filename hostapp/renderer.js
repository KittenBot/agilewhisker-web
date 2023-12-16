const {
    DEVICE_CHANGE,
    CONNECTION_STATE,
    JDBus,
    createNodeWebSerialTransport,
} = require('jacdac-ts')
const { SerialPort } = require('serialport')

// create a new bus
async function main() {
    const transports = [
        await createNodeWebSerialTransport(SerialPort),
    ]
    const bus = new JDBus(transports)
    console.log("bus created", bus)
    bus.on(DEVICE_CHANGE, async () => {
        console.log("device change", bus.devices())
    })

    bus.on(CONNECTION_STATE, async (state) => {
        console.log("connection state", state)
    })

    await bus.connect()
}

main()