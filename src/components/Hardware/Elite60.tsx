import React, { useEffect, useState } from 'react';
import './Elite60.css';

const keys = [
    ['ESC', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '/', '⭕'],
    ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
    ['CapsLock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', '\'', 'Enter'],
    ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'FN2', '↑', 'Del'],
    ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Fn', '←', '↓', '→']
];

const specialKeyCodeMap = {
    'ArrowUp': '↑',
    'ArrowLeft': '←',
    'ArrowDown': '↓',
    'ArrowRight': '→',
    'Escape': 'ESC',
    'Space': 'Space',
    'ShiftLeft': 'Shift',
    'ControlLeft': 'Ctrl',
};

const keyMap = keys.flat().reduce((acc, key) => {
    acc[key.toLowerCase()] = key;
    return acc;
}, {});

const Elite60 = () => {
    const [activeKey, setActiveKey] = useState(null);

    useEffect(() => {
        const handleKeyDown = (event) => {
            console.log(event)
            const key = keyMap[event.key.toLowerCase()];
            if (key){
                setActiveKey(key);
            } else if (specialKeyCodeMap[event.code]) {
                setActiveKey(specialKeyCodeMap[event.code]);
            }
        };

        const handleKeyUp = (event) => {
            const key = keyMap[event.key.toLowerCase()];
            if (key) {
                setActiveKey(null);
            } else if (specialKeyCodeMap[event.code]) {
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
    return (
        <div className="keyboard">
            {keys.map((row, rowIndex) => (
                <div key={rowIndex} className="keyboard-row">
                    {row.map((key, keyIndex) => (
                        <div
                            key={keyIndex}
                            className={`key ${key.toLowerCase()} ${activeKey === key ? 'active' : ''}`}
                        >
                            {key}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Elite60;