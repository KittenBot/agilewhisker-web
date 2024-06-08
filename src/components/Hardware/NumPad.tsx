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
            console.log(code);
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

    const handleDrop = (event, key) => {
        event.preventDefault();
        setDragOverKey(null);
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
                                <div key={keyIndex} className={`key ${key} ${key === '0' ? 'key-wide' : ''} ${key === activeKey ? 'active' : ''} ${key === dragOverKey ? 'drag-over' : ''}`}
                                    onDragOver={(event) => handleDragOver(event, key)}
                                    onDragLeave={handleDragLeave}
                                    onDrop={() => handleDrop(event, key)}
                                    onClick={() => console.log('Clicked on', key)}
                                >
                                    {key}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="side-keys">
                    {sideKeys.map((key, keyIndex) => (
                        <div
                            key={keyIndex} className={`key ${(key === 'Enter' || key === '+')? 'key-tall' : ''} ${key === activeKey ? 'active' : ''} ${key === dragOverKey ? 'drag-over' : ''}`}
                            onDragOver={(event) => handleDragOver(event, key)}
                            onDragLeave={handleDragLeave}
                            onDrop={() => handleDrop(event, key)}
                            onClick={() => console.log('Clicked on', key)}
                        >
                            {key}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NumpadLayout;