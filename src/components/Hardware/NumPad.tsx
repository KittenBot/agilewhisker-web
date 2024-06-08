import React, { useEffect, useMemo, useState } from 'react';
import './NumPad.css';

import { KeyboardProps } from './Elite60';

const mainKeys = [
    ['Num', '/', '*'],
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['0', '.', 'Del']
];

const sideKeys = ['-', '+', 'Enter'];

const NumpadLayout = () => {
    return (
        <div className="numpad">
            <div className="numpad-header">
                <div className="oled">OLED</div>
                <div className="encoder">☺</div>
                <div className="encoder">☻</div>
            </div>
            <div className="numpad-body">
                <div className="main-keys">
                    {mainKeys.map((row, rowIndex) => (
                        <div key={rowIndex} className="numpad-row">
                            {row.map((key, keyIndex) => (
                                <div key={keyIndex} className="key">
                                    {key}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="side-keys">
                    {sideKeys.map((key, keyIndex) => (
                        <div key={keyIndex} className={`key ${(key === 'Enter' || key === '+')? 'key-tall' : ''}`}>
                            {key}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NumpadLayout;