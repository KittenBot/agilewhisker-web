import CryptoJS from 'crypto-js';
import { ESPLoader, Transport } from 'esptool-js';

class ESPFlash {
    private _device: any;
    private _transport: Transport;
    private _chip: string

    esploader: ESPLoader;

    constructor(public bin: string, public vid: number) {

    }

    async init(transport: Transport) {
        const terminal = {
            write: ( data: any ) => {
                console.log(data);
            },
            writeLine: ( data: any ) => {
                console.log(data);
            },
            clean: () => {
                
            }
        }

        const esptool = new ESPLoader(transport, 115200, terminal);
        const { bin } = this;
        const md5 = CryptoJS.MD5(bin).toString();

        const filters = [
            { usbVendorId: this.vid }
        ]

        this._device = await ( window.navigator as any ).serial.requestPort({ filters })
        this._transport = new Transport( this._device );

        try {
            this.esploader = new ESPLoader( this._transport, 115200, terminal );

            this._chip = await this.esploader.main_fn();
        } catch ( error ) {
            console.warn( error )
        }        
    }

}

export default ESPFlash;