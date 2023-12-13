const {
    jdunpack,
    JDServiceServer
} =  require('jacdac-ts')

const SRV_PC_MONITOR = 0x18627b15

class PCMonitor extends JDServiceServer {
    REG_CPU_USAGE = 0x190
    REG_CPU_TEMP = 0x191
    REG_MEMORY_USAGE = 0x192

    REG_GPU_INFO = 0x193

    REG_NETWORK_INFO = 0x195

    constructor(options={}) {
        super(SRV_PC_MONITOR, options)

        this.cpu_usage = this.addRegister(this.REG_CPU_USAGE, [0]) // u8 percent
        this.cpu_temp = this.addRegister(this.REG_CPU_TEMP, [-1]) // u8 celsius
        this.memory_usage = this.addRegister(this.REG_MEMORY_USAGE, [0]) // u8 percent
        this.gpu_info = this.addRegister(this.REG_GPU_INFO, [-1, -1]) // u8, u8, gpu load, gpu temp
        this.network_info = this.addRegister(this.REG_NETWORK_INFO, [0, 0]) // u16, u16, tx, rx speed in kbps

    }

}

exports.PCMonitor = PCMonitor
