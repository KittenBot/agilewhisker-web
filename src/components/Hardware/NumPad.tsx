import React, { useEffect, useMemo, useState } from 'react';
import './NumPad.css';

import { KeyboardProps } from './Elite60';
import { SkillEvent } from '@/lib/SkillBuild';

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

export interface KeyboardKeyProps {
    name: string;
    className?: string;
    role?: string;
    isActive?: boolean;
    isDragOver?: boolean;
    evt?: SkillEvent;
    handleDragOver: (event, key: string) => void;
    handleDragLeave: () => void;
    handleDrop: (event, key: string, role?: string) => void;
    handleClick: () => void;
    children?: React.ReactNode;
}

const KeyboardKey = ({
    name,
    evt,
    className,
    role,
    isActive,
    isDragOver,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleClick,
    children
}: KeyboardKeyProps) => {
    return (
        <div
            className={`${className} ${isActive ? 'active' : ''} ${isDragOver ? 'drag-over' : ''} ${!!evt ? 'filled' : ''}`}
            onDragOver={(event) => handleDragOver(event, role)}
            onDragLeave={handleDragLeave}
            onDrop={(event) => handleDrop(event,  name, role)}
            onClick={handleClick}
        >
            {children ? children : evt &&
                evt.thumbnail ? <img src={evt.thumbnail} alt={name} /> : name
            }
        </div>
    );
};
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

    const handleDropKeybutton = (event, key, role='keybutton') => {
        setDragOverKey(null);
        const target = event.dataTransfer.getData('id');
        if (hidKeyMap[key]) {
            key = {
                text: key,
                value: hidKeyMap[key]
            }
        }
        props.onDrop(target, key, role);
    }

    return (
        <div className="numpad">
            <div className="numpad-header">
                <KeyboardKey
                    className='oled'
                    name='OLED'
                    role='oled'
                    evt={props.build.events.find((e) => e.key === 'OLED')}
                    isActive={activeKey === 'OLED'}
                    isDragOver={dragOverKey === 'OLED'}
                    handleDragOver={handleDragOver}
                    handleDragLeave={handleDragLeave}
                    handleDrop={handleDropKeybutton}
                    handleClick={() => props.onClick('OLED')}
                >OLED</KeyboardKey>
                <KeyboardKey
                    className='encoder'
                    name='ENCODER'
                    role='encoder'
                    evt={props.build.events.find((e) => e.key === 'ENCODER')}
                    isActive={activeKey === 'ENCODER'}
                    isDragOver={dragOverKey === 'ENCODER'}
                    handleDragOver={handleDragOver}
                    handleDragLeave={handleDragLeave}
                    handleDrop={handleDropKeybutton}
                    handleClick={() => props.onClick('ENCODER')}
                >☺</KeyboardKey>
                <KeyboardKey
                    className='encoder'
                    name='ENCODER2'
                    role='encoder'
                    evt={props.build.events.find((e) => e.key === 'ENCODER2')}
                    isActive={activeKey === 'ENCODER2'}
                    isDragOver={dragOverKey === 'ENCODER2'}
                    handleDragOver={handleDragOver}
                    handleDragLeave={handleDragLeave}
                    handleDrop={handleDropKeybutton}
                    handleClick={() => props.onClick('ENCODER2')}
                >☻</KeyboardKey>
            </div>
            <div className="numpad-body">
                <div className="main-keys">
                    {mainKeys.map((row, rowIndex) => (
                        <div key={rowIndex} className="numpad-row">
                            {row.map((key, keyIndex) => (
                                <KeyboardKey 
                                    key={keyIndex}
                                    className={`keynum ${key === '0' ? 'keynum-wide' : ''} `}
                                    name={key}
                                    evt={props.build.events.find((e) => e.key === key)}
                                    isActive={key === activeKey}
                                    isDragOver={key === dragOverKey}
                                    handleDragOver={handleDragOver}
                                    handleDragLeave={handleDragLeave}
                                    handleDrop={handleDropKeybutton}
                                    handleClick={() => props.onClick(key)}
                                />
                            ))}
                        </div>
                    ))}
                </div>
                <div className="side-keys">
                    {sideKeys.map((key, keyIndex) => (
                        <KeyboardKey
                            className={`keynum ${(key === 'Enter' || key === '+')? 'keynum-tall' : ''}`}
                            name={key}
                            role={key}
                            evt={props.build.events.find((e) => e.key === key)}
                            isActive={key === activeKey}
                            isDragOver={key === dragOverKey}
                            handleDragOver={handleDragOver}
                            handleDragLeave={handleDragLeave}
                            handleDrop={handleDropKeybutton}
                            handleClick={() => props.onClick(key)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NumpadLayout;