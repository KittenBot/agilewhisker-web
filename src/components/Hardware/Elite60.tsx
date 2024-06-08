import React, { useEffect, useMemo, useState } from 'react';
import './Elite60.css';


export interface KeyboardProps {
    shortcut?: Record<string, string>;
    keys?: string[][];
}

const defaultLayout = [
    ['ESC', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '', '⭕'],
    ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
    ['CapsLock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', '\'', 'Enter'],
    ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', '', '↑', 'Del'],
    ['Ctrl', '⌘', 'Alt', 'Space', 'Alt', '', '←', '↓', '→']
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
    'MetaLeft': '⌘',
};


const Elite60 = (props: KeyboardProps) => {
    const [layout, setLayout] = useState(props.keys || defaultLayout);
    const [activeKey, setActiveKey] = useState(null);
    const [dragOverKey, setDragOverKey] = useState(null);

    const keyMap = useMemo(() => {
        return layout.flat().reduce((acc, key) => {
            acc[key.toLowerCase()] = key;
            return acc;
        }, {});
    }, [layout]);

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
        <div className="keyboard">
            {layout.map((row, rowIndex) => (
                <div key={rowIndex} className="keyboard-row">
                    {row.map((key, keyIndex) => {
                        let className =`key ${key.toLowerCase()}`
                        if (activeKey === key) {
                            className += ' active';
                        }
                        if (dragOverKey === key) {
                            className += ' drag-over';
                        }

                        return (
                            <div
                                key={keyIndex}
                                className={className}
                                onDragOver={(event) => handleDragOver(event, key)}
                                onDragLeave={handleDragLeave}
                                onDrop={() => handleDrop(event, key)}
                                onClick={() => console.log('Clicked on', key)}
                            >
                                {key}
                            </div>)
                        })}
                </div>
            ))}
        </div>
    );
};

export default Elite60;