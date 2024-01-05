import {
  HidKeyboardAction as ACT,
  HidKeyboardSelector as KEY,
  Potentiometer
} from "@devicescript/core";
import { startHidKeyboard } from "@devicescript/servers";

const potentiometer = new Potentiometer()
const keyboard = startHidKeyboard( {} )

potentiometer.reading.subscribe( async ( value ) => {
  if ( value > 0.9 ) {
    await keyboard.key( KEY.VolumeUp, 0, ACT.Press )
  } else if ( value < 0.1 ) {
    await keyboard.key( KEY.VolumeDown, 0, ACT.Press )
  }
} )