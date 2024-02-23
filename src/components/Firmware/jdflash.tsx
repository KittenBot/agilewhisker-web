import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Progress, message } from "antd";

import { DisconnectState } from "../DevsDownload";
import { useJacdacStore } from "../../store/jacdacStore";

import {
  parseFirmwareFile,
  FirmwareBlob,
  FirmwareUpdater,
  PROGRESS,
} from 'jacdac-ts'

export interface JDFlashCardProps {
  name: string;
  url: string;
  version: string;
}

const JDFlashCard = (props: JDFlashCardProps) => {

  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const {bus, connected} = useJacdacStore()
  const [firmwareBlob, setBlob] = useState<FirmwareBlob>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(props.url);
      const blob = await response.blob();
      const firmware = await parseFirmwareFile(blob);
      if (firmware.length){
        setBlob(firmware[0]);
      }
    }
    fetchData();
  }, [props.url]);

  const handleUpgrade = async () => {
    const { productIdentifier } = firmwareBlob;
    // find the device in the bus
    // TODO: async product id read??
    let device = bus.devices().find(d => d.productIdentifier === productIdentifier);
    for (const dev of bus.devices()){
      if (dev.productIdentifier === productIdentifier){
        device = dev;
      }
    }
    if (!device) {
      message.error("Device not found");
      return;
    }
    setIsDownloading(true);
    const firmwareInfo = device.firmwareInfo;
    let firmwareUpdater = device.firmwareUpdater;
    if (!firmwareUpdater) {
      firmwareUpdater = new FirmwareUpdater(bus, firmwareBlob);
      device.firmwareUpdater = firmwareUpdater;
      firmwareUpdater.subscribe(PROGRESS, (v: number) => {
        setProgress(v*100)
      });
    }
    try {
      const updateCandidates = [firmwareInfo]
      await firmwareUpdater.flash(updateCandidates, false)
    } catch (error) {
      message.error(error.message);
    } finally {
      setIsDownloading(false);
    }
    
  }

  if (!connected) return(
    <DisconnectState />
  );

  return (
    <div>
    {firmwareBlob ? <Card hoverable>
      <Card.Meta
        title={firmwareBlob.name}
        description={`Flash uf2 firmware ${firmwareBlob.version} to device`}
      />
      {isDownloading ? (
        <Progress percent={progress} status="active" />
      ) : (
        <Button style={{ margin: 8 }} type="primary" onClick={handleUpgrade}>
          Download
        </Button>
      )}
    </Card> : <div>
      Reading firmware...
    </div> }
    </div>
  );
}

export default JDFlashCard;