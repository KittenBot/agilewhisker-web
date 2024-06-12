import React, { useEffect, useMemo, useState } from 'react';
import './NumPad.css';

import { KeyboardProps } from './Elite60';

const mainKeys = [
    ['Num', '/', '*'],
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['0', '.']
];

const sideKeys = ['-', '+', 'Enter'];

const NumpadKeyMap = {
    'NumLock': 'Num',
    'NumpadDivide': '/',
    'NumpadMultiply': '*',
    'NumpadSubtract': '-',
    'NumpadAdd': '+',
    'NumpadDecimal': '.',
}

// actually HID key codes in devicescript-spec
const hidKeyMap = {
    '1': 'Keypad1',
    '2': 'Keypad2',
    '3': 'Keypad3',
    '4': 'Keypad4',
    '5': 'Keypad5',
    '6': 'Keypad6',
    '7': 'Keypad7',
    '8': 'Keypad8',
    '9': 'Keypad9',
    '0': 'Keypad0',
    'Enter': 'KeypadReturn',
    'Num': 'KeypadNumLock',
    '/': 'KeypadDivide',
    '*': 'KeypadMultiply',
    '-': 'KeypadSubtrace',
    '+': 'KeypadAdd',
    '.': 'KeypadDecimalPoint',
}


const NumpadLayout = (props: KeyboardProps) => {
    const [activeKey, setActiveKey] = useState(null);
    const [dragOverKey, setDragOverKey] = useState(null);

    useEffect(() => {
        const handleKeyDown = (event) => {
            const code = event.code;
            if (NumpadKeyMap[code]) {
                setActiveKey(NumpadKeyMap[code]);    
            } else if (code.startsWith('Numpad')) {
                setActiveKey(code.replace('Numpad', ''));
            }
        };

        const handleKeyUp = (event) => {
            const code = event.code;
            if (NumpadKeyMap[code]) {
                setActiveKey(null);
            } else if (code.startsWith('Numpad')) {
                setActiveKey(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    const handleDragOver = (event, key) => {
        // TODO: only allow drop on certain keys
        event.preventDefault();
        setDragOverKey(key);
    }

    const handleDragLeave = () => {
        setDragOverKey(null);
    }

    const handleDropKeybutton = (event, key) => {
        setDragOverKey(null);
        const target = event.dataTransfer.getData('id');
        if (hidKeyMap[key]) {
            key = {
                text: key,
                value: hidKeyMap[key]
            }
        }
        props.onDrop(target, key, 'keybutton');
    }

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
                                <div key={keyIndex} className={`keynum ${key === '0' ? 'keynum-wide' : ''} ${key === activeKey ? 'active' : ''} ${key === dragOverKey ? 'drag-over' : ''} ${props.build.events.find((e) => e.key === key) ? 'filled' : ''}`}
                                    onDragOver={(event) => handleDragOver(event, key)}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(event) => handleDropKeybutton(event, key)}
                                    onClick={() => props.onClick(key)}
                                >
                                    {props.build.events.find((e) => e.key === key) ? <img src={props.build.events.find((e) => e.key === key).thumbnail} alt={key} /> : key}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="side-keys">
                    {sideKeys.map((key, keyIndex) => (
                        <div
                            key={keyIndex} className={`keynum ${(key === 'Enter' || key === '+')? 'keynum-tall' : ''} ${key === activeKey ? 'active' : ''} ${key === dragOverKey ? 'drag-over' : ''} ${props.build.events.find((e) => e.key === key) ? 'filled' : ''}`}
                            onDragOver={(event) => handleDragOver(event, key)}
                            onDragLeave={handleDragLeave}
                            onDrop={(event) => handleDropKeybutton(event, key)}
                            onClick={() => props.onClick(key)}
                            >
                            {props.build.events.find((e) => e.key === key) ? <img src={props.build.events.find((e) => e.key === key).thumbnail} alt={key} /> : key}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NumpadLayout;