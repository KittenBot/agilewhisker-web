import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Progress } from "antd";
import CryptoJS from "crypto-js";
import { ESPLoader, Transport } from "esptool-js";

const blob2BinaryString = ( blob: Blob ) => {
  return new Promise( ( resolve, reject ) => {
      const reader = new FileReader();
      reader.onload = ( e ) => {
          resolve( e.target.result );
      };
      reader.onerror = ( e ) => {
          reject( e );
      };
      reader.readAsBinaryString( blob );
  } );
}

class ESPFlash {
  private _device: any;
  private _transport: Transport;
  private _chip: string;

  esploader: ESPLoader;

  constructor(public config: ESPFlashConfig, public onProgress) {}

  init = async () => {
    const terminal = {
      write: (data: any) => {
        console.log(data);
      },
      writeLine: (data: any) => {
        console.log(data);
      },
      clean: () => {},
    };

    const filters = [{ usbVendorId: this.config.vid }];

    this._device = await (window.navigator as any).serial.requestPort({
      filters,
    });
    this._transport = new Transport(this._device);

    try {
      this.esploader = new ESPLoader(this._transport, 115200, terminal);

      this._chip = await this.esploader.main_fn();
    } catch (error) {
      console.warn(error);
    }
  };


  upload = async ( params?: any ) => {
    const parseAddr = ( addr?: string ) => {
        if ( addr === undefined ) {
            return 0x1000
        }
        if ( addr.startsWith( '0x' ) ) {
            return parseInt( addr, 16 )
        }
        return parseInt( addr, 10 )
    }

    await this.init()
    if ( this.config.fullerase ) {
        await this.erase()
    }
    const fileArray = []
    if ( this.config.firmware ) {
        const addr = parseAddr( this.config.address )
        const file = await fetch( `/${this.config.firmware}` ).then( res => res.blob() )
        const txt = await blob2BinaryString( file )
        fileArray.push( {
            address: addr,
            data: txt
        } )
    } else if ( this.config.firmwares.length ) {
        for ( let i = 0; i < this.config.firmwares.length; i++ ) {
            const element = this.config.firmwares[i];
            const addr = parseAddr( element.address )
            const file = await fetch( `/${element.file}` ).then( res => res.blob() )
            const txt = await blob2BinaryString( file )
            fileArray.push( {
                address: addr,
                data: txt
            } )
        }
    }
    try {
        await this.esploader.write_flash( fileArray, 'keep', undefined, undefined, false, true,
            ( filleIndex, wirtten, total ) => {
                const percentage = Math.trunc((filleIndex + wirtten)/total * 100)
                this.onProgress(percentage)
            },
            ( image: any ) => {
                const result = CryptoJS.MD5( CryptoJS.enc.Latin1.parse( image ) )
                return result.toString()
            }
        )
    } catch ( error ) {
        throw error
    } finally {
        try {
            await this._transport.disconnect()
        } catch ( error ) {
           console.warn(error)
        }
        this.reset()
    }

  }

  erase = async () => {
    await this.esploader.erase_flash();
  };

  reset = async () => {
    await this._transport.connect();
    await this._transport.setDTR(false);
    await new Promise((resolve) => setTimeout(resolve, 100));
    await this._transport.setDTR(true);
    await new Promise((resolve) => setTimeout(resolve, 100));
    await this._transport.disconnect();
  };

  cleanUp = () => {
    this._device = null;
    this._transport = null;
    this._chip = null;
  };
}

interface ESPFlashConfig {
  vid: number;
  address?: string;
  fullerase?: boolean;
  firmware?: string;
  firmwares?: { address: string, file: string }[];
}

export interface ESPFlashProps {
  board: string;
  version: string;
  config: ESPFlashConfig;
}

const ESPFlashCard = (props: ESPFlashProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDownload = async () => {
    const espflash = new ESPFlash(props.config, setProgress);
    try {
      setIsDownloading(true);
      await espflash.upload();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDownloading(false);
    }
    
  };
  return (
    <Card hoverable>
      <Card.Meta
        title={props.board}
        description={`Flash esp32 firmware ${props.version} to device`}
      />
      {isDownloading ? (
        <Progress percent={progress} status="active" />
      ) : (
        <Button style={{ margin: 8 }} type="primary" onClick={handleDownload}>
          Download
        </Button>
      )}
    </Card>
  );
};

export default ESPFlashCard;
