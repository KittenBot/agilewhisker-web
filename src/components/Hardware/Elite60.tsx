import React from 'react';
import './Elite60.css';

const keys = [
  ['ESC', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '/', '⭕'],
  ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
  ['CapsLock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', '\'', 'Enter'],
  ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'FN2', '↑', 'Del'],
  ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Fn', '←', '↓', '→']
];

const Elite60 = () => {
  return (
    <div className="keyboard">
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key, keyIndex) => (
            <div key={keyIndex} className={`key ${key.toLowerCase()}`}>
              {key}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Elite60;