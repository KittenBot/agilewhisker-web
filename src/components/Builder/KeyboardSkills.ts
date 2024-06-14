import { Skill, SkillOpenUrl } from "./skill";


export enum SkillAccessType {
    BUTTON = 'BUTTON',
    ENCODER = 'ENCODER',
    OLED = 'OLED',
}

export interface SKillMenu {
    name: string;
    icon?: any;
    skills: SkillItem[];
    description?: string;
}

export interface SkillItem {
    type: string;
    param?: any;
    icon?: any;
    accessType?: SkillAccessType;
    description: string;
}

const skillMenus: SKillMenu[] = [
    {
        name: 'PC Events',
        icon: 'img/event.png',
        description: 'Trigger an event on PC',
        skills: [
            {
                type: 'SkillOpenUrl',
                param: {'$URL': 'https://example.com'},
                description: 'Open a URL',
            },
            {
                type: 'SkillStartApp',
                param: {'$APP': '/path/to/app'},
                description: 'Open a app',
            },
            {
                type: 'SkillSendText',
                param: {'$TXT': 'Hello World'},
                description: 'Send text to device',
            },
            {
                type: 'SkillAiService',
                param: {'$SCRIPT': 'my_script', '$PARAMS': 'param1=value1&param2=value2'},
                description: 'Run AI script',
            }
        ],
    },
    {
        name: 'Animation',
        icon: 'img/animation.png',
        skills: [
            {
                type: 'PatternSnake',
                description: 'Snake',
            },
            {
                type: 'PatternSparkle',
                description: 'Sparkle effect on random LEDs',
            },
            {
                type: 'PatternRandom',
                description: 'Random color on random LEDs',
            },
        ]
    },
    {
        name: 'System Info OLED',
        icon: 'img/oled_sysinfo.png',
        description: 'Display system information to OLED',
        skills: [
            {
                type: 'CpuRamUsage',
                description: 'Get CPU Usage',
            },
            {
                type: 'NetworkInfo',
                description: 'Get device info',
            },
            {
                type: 'SkillGetTransportInfo',
                description: 'Get transport info',
            },
        ]
    },
    {
        name: 'Media Control',
        icon: 'img/mediacontrol.png',
        description: 'Control media on PC',
        skills: [
            {
                type: 'SkillMediaControl',
                param: {
                    '$ACTION': 'play',
                    '$CCW': 'volume_up',
                    '$CW': 'volume_down',
                },
                description: 'Media control by Encoder',
            },
        ]
    },


]

export default skillMenus;