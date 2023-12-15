const {
    jdunpack,
    JDServiceServer,
    REGISTER_PRE_GET
} =  require('jacdac-ts')
const si = require('systeminformation');

const SRV_PC_MONITOR = 0x18627b15

class PCMonitor extends JDServiceServer {
    REG_CPU_USAGE = 0x190
    REG_CPU_TEMP = 0x191
    REG_MEMORY_USAGE = 0x192

    REG_GPU_INFO = 0x193

    REG_NETWORK_INFO = 0x195

    // TODO: make "osx-temperature-sensor": "^1.0.8", works with electron

    constructor() {
        super(SRV_PC_MONITOR, {
            streamingInterval: 1000,
        })

        this.cpu_usage = this.addRegister(this.REG_CPU_USAGE, [0]) // u8 percent
        this.cpu_usage.on(REGISTER_PRE_GET, this.handleRefresh.bind(this))
        this.cpu_temp = this.addRegister(this.REG_CPU_TEMP, [-1]) // u8 celsius
        // this.cpu_temp.on(REGISTER_PRE_GET, this.handleRefresh.bind(this))

        this.memory_usage = this.addRegister(this.REG_MEMORY_USAGE, [0]) // u8 percent
        this.gpu_info = this.addRegister(this.REG_GPU_INFO, [-1, -1]) // u8, u8, gpu load, gpu temp
        this.network_info = this.addRegister(this.REG_NETWORK_INFO, [0, 0]) // u16, u16, tx, rx speed in kbps

        // this.on("refresh", this.handleRefresh.bind(this))
    }

    handleRefresh(){
        const t = new Date()
        console.log("refresh at", t.toLocaleTimeString())
        si.currentLoad().then(data => {
            const load = Math.round(data.currentLoad)
            console.log('CPU load', load)
            this.cpu_usage.setValues([load])
        }).catch(error => console.error(error));
    }


}

exports.PCMonitor = PCMonitor
