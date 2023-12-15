const {
    jdunpack,
    JDServiceServer
} =  require('jacdac-ts')

const SRV_PC_EVENT = 0x113d0987

class PCEvent extends JDServiceServer {
    CMD_OPEN_URL = 0x80
    CMD_OPEN_APP = 0x81
    CMD_SEND_TXT = 0x82
    CMD_RUN_SCRIPT = 0x83
    constructor() {
        super(SRV_PC_EVENT, {
            
        })

        this.addCommand(PCEvent.CMD_OPEN_URL, this.handleOpenUrl.bind(this))
        this.addCommand(PCEvent.CMD_OPEN_APP, this.handleOpenApp.bind(this))
        this.addCommand(PCEvent.CMD_SEND_TXT, this.handleSendText.bind(this))
        this.addCommand(PCEvent.CMD_RUN_SCRIPT, this.handleRunScript.bind(this))

    }

    handleOpenUrl(pkt) {
        const [url] = jdunpack(pkt.data, "s")
        console.log("open url", url)
    }

    handleOpenApp(pkt) {
        const [app, args] = jdunpack(pkt.data, "z s")
        console.log("open app", app)
    }

    handleSendText(pkt) {
        const [text] = jdunpack(pkt.data, "s")
        console.log("send text", text)
    }

    handleRunScript(pkt) {
        const [script] = jdunpack(pkt.data, "s")
        console.log("run script", script)
    }


}

exports.PCEvent = PCEvent


