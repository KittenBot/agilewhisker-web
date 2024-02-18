import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Progress, message } from "antd";
import { useJacdacStore } from "@/store/jacdacStore";

import {
  parseFirmwareFile,
  FirmwareBlob,
  FirmwareUpdater
} from 'jacdac-ts'

export interface JDFlashCardProps {
  name: string;
  url: string;
  version: string;
}

const JDFlashCard = (props: JDFlashCardProps) => {

  const {bus} = useJacdacStore()
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
    const updater = new FirmwareUpdater(bus, firmwareBlob);
    
  }

  return (
    <div>
    {firmwareBlob ? <Card hoverable>
      <Card.Meta
        title={firmwareBlob.name}
        description={`Flash uf2 firmware ${firmwareBlob.version} to device`}
      />
      <Button style={{ margin: 8 }} type="primary" onClick={handleUpgrade}>
        Download
      </Button>
    </Card> : <div>
      Reading firmware...
    </div> }
    </div>
  );
}

export default JDFlashCard;