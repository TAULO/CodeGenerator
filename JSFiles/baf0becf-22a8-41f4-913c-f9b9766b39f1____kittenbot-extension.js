/**
 * Created by Riven on 17/9/24.
 */


var KittenbotExtension = function () {
};


/**
 * @return {object} This extension's metadata.
 */
KittenbotExtension.prototype.getInfo = function () {
    return {
        id: 'KittenBot',

        name: 'KittenBot',

        color1: '#DE5277',
        color2: '#AA3F5B',
        color3: '#AA3F5B',

        parser: 'parseCmd',

        blocks: [
            {
                opcode: 'motorspeed',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Motor [MOTOR] Move [SPEED]',
                arguments: {
                    MOTOR: {
                        type: Scratch.ArgumentType.STRING,
                        menu: 'motorIndex',
                        defaultValue: 'M1A'
                    },
                    SPEED: {
                        type: Scratch.ArgumentType.SLIDER,
                        defaultValue: 100
                    }
                },
                func: 'motorSpeed'
            },
            {
                opcode: 'motordual',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Motor M1A[SPDM1A] M1B[SPDM1B]',
                arguments: {
                    SPDM1A: {
                        type: Scratch.ArgumentType.SLIDER,
                        defaultValue: 100
                    },
                    SPDM1B: {
                        type: Scratch.ArgumentType.SLIDER,
                        defaultValue: 100
                    }
                },
                func: 'motordual'
            },
            {
                opcode: 'motordualdelay',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Motor M1A[SPDM1A] M1B[SPDM1B] Delay[DELAY]ms',
                arguments: {
                    SPDM1A: {
                        type: Scratch.ArgumentType.SLIDER,
                        defaultValue: 100
                    },
                    SPDM1B: {
                        type: Scratch.ArgumentType.SLIDER,
                        defaultValue: 100
                    },
                    DELAY: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 500
                    }
                },
                func: 'motordualdelay'
            },
            {
                opcode: 'motorfour',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Motor M1A[SPDM1A] M1B[SPDM1B] M2A[SPDM2A] M2B[SPDM2B]',
                arguments: {
                    SPDM1A: {
                        type: Scratch.ArgumentType.SLIDER,
                        defaultValue: 50
                    },
                    SPDM1B: {
                        type: Scratch.ArgumentType.SLIDER,
                        defaultValue: 50
                    },
                    SPDM2A: {
                        type: Scratch.ArgumentType.SLIDER,
                        defaultValue: -50
                    },
                    SPDM2B: {
                        type: Scratch.ArgumentType.SLIDER,
                        defaultValue: -50
                    }
                },
                func: 'motorfour'
            },
            {
                opcode: 'omniwheel',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Omni X[SPDX] Y[SPDY] R[SPDR]',
                arguments: {
                    SPDX: {
                        type: Scratch.ArgumentType.SLIDER,
                        defaultValue: 100
                    },
                    SPDY: {
                        type: Scratch.ArgumentType.SLIDER,
                        defaultValue: 100
                    },
                    SPDR: {
                        type: Scratch.ArgumentType.SLIDER,
                        defaultValue: 0
                    }
                },
                func: 'omniwheel'
            },
            {
                opcode: 'stop',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Motor Stop',
                func: 'motorStop',
                sepafter: 36
            },
            {
                opcode: 'stepperline',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Stepper Draw Line [DISTANCE]cm',
                arguments: {
                    DISTANCE: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 20
                    }
                },
                func: 'stepperLine'
            },
            {
                opcode: 'stepperturn',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Stepper Turn Degree [DEGREE]',
                arguments: {
                    DEGREE: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 90
                    }
                },
                func: 'stepperTurn'
            },
            {
                opcode: 'stepperppm',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Stepper Pulse Per Meter [PPM]',
                arguments: {
                    PPM: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 14124
                    }
                },
                func: 'stepperppm'
            },
            {
                opcode: 'stepperwheelbase',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Stepper Wheel Base [WHEELBASE] M',
                arguments: {
                    WHEELBASE: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0.124
                    }
                },
                func: 'stepperwheelbase'
            },
            {
                opcode: 'stepperarc',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Stepper Arc Diameter [DIAMETER] Degree [DEGREE]',
                arguments: {
                    DIAMETER: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 20
                    },
                    DEGREE: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 90
                    }
                },
                func: 'stepperArc',
                sepafter: 36
            },
            /*
            {
                opcode: 'steppermove',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Stepper [STEPPER] DEGREE [DEGREE] RPM [RPM]',
                arguments: {
                    STEPPER: {
                        type: Scratch.ArgumentType.STRING,
                        menu: 'stepperIndex',
                        defaultValue: 'M1'
                    },
                    DEGREE: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 360
                    },
                    RPM: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 11
                    }
                },
                func: 'steppermove',
                sepafter: 36
            },
            */
            {
                opcode: 'pinmode',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Pin Mode [PIN] [MODE]',
                arguments: {
                    PIN: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: '13',
                        menu: 'rosbotPin'
                    },
                    MODE: {
                        type: Scratch.ArgumentType.STRING,
                        menu: 'pinMode',
                        defaultValue: 'OUTPUT'
                    }
                },
                func: 'pinMode'
            },
            {
                opcode: 'digitalwrite',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Digital Write [PIN] [VALUE]',
                arguments: {
                    PIN: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: '13',
                        menu: 'rosbotPin'
                    },
                    VALUE: {
                        type: Scratch.ArgumentType.NUMBER,
                        menu: 'level',
                        defaultValue: 'HIGH'
                    }
                },
                func: 'digitalWrite'
            },
            {
                opcode: 'analogwrite',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Analog Write [PIN] [VALUE]',
                arguments: {
                    PIN: {
                        type: Scratch.ArgumentType.STRING,
                        menu: 'analogWritePin',
                        defaultValue: '11'
                    },
                    VALUE: {
                        type: Scratch.ArgumentType.SLIDERANALOGWR,
                        defaultValue: 120
                    }
                },
                func: 'analogWrite'
            },
            {
                opcode: 'digitalread',
                blockType: Scratch.BlockType.BOOLEAN,
                blockAllThreads: false,
                text: 'Digital Read [PIN]',
                arguments: {
                    PIN: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: '3',
                        menu: 'rosbotPin'
                    }
                },
                func: 'digitalRead'
            },
            {
                opcode: 'analogread',
                blockType: Scratch.BlockType.REPORTER,
                blockAllThreads: false,
                text: 'Analog Read [PIN]',
                arguments: {
                    PIN: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'A0',
                        menu: 'analogPin'
                    }
                },
                func: 'analogRead'
            },
            {
                opcode: 'led',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'LED [PIN] [VALUE]',
                arguments: {
                    PIN: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: '13',
                        menu: 'rosbotPin'
                    },
                    VALUE: {
                        type: Scratch.ArgumentType.STRING,
                        menu: 'onoff',
                        defaultValue: 'ON'
                    }
                },
                func: 'led',
                sepafter: 36

            },
            {
                opcode: 'button',
                blockType: Scratch.BlockType.BOOLEAN,
                blockAllThreads: false,
                text: 'Button [PIN]',
                arguments: {
                    PIN: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: '4',
                        menu: 'rosbotPin'
                    }
                },
                func: 'button'
            },
            {
                opcode: 'servo',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Servo pin[PIN] degree[DEGREE]',
                arguments: {
                    PIN: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: '4',
                        menu: 'extPin'
                    },
                    DEGREE: {
                        type: Scratch.ArgumentType.SLIDERSERVO,
                        defaultValue: 90
                    }
                },
                func: 'servo'
            },
            {
                opcode: 'tone',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Tone [PIN] [FREQ]hz [DURATION]ms',
                arguments: {
                    PIN: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'A0',
                        menu: 'rosbotPin'
                    },
                    FREQ: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 200
                    },
                    DURATION: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 500
                    }
                },
                func: 'tone'
            },
            {
                opcode: 'rgb-brightness',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'RGB Brightness [VALUE]',
                arguments: {
                    VALUE: {
                        type: Scratch.ArgumentType.SLIDERANALOGWR,
                        defaultValue: 100
                    }
                },
                func: 'rgbbrightness'
            },
            {
                opcode: 'rgb-pick',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'RGB Pin[PIN] Pixel[PIX] [COLOR]',
                arguments: {
                    PIN: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: '4',
                        menu: 'rosbotPin'
                    },
                    PIX: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 1,
                        menu: 'rgbPix'
                    },
                    COLOR: {
                        type: Scratch.ArgumentType.COLOR
                    }
                },
                func: 'rgbpick'
            },
            {
                opcode: 'rgb',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'RGB Pin[PIN] Pixel[PIX] R[RED] G[GREEN] B[BLUE]',
                arguments: {
                    PIN: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: '4',
                        menu: 'rosbotPin'
                    },
                    PIX: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 1,
                        menu: 'rgbPix'
                    },
                    RED: {
                        type: Scratch.ArgumentType.SLIDERANALOGWR,
                        defaultValue: 100
                    },
                    GREEN: {
                        type: Scratch.ArgumentType.SLIDERANALOGWR,
                        defaultValue: 150
                    },
                    BLUE: {
                        type: Scratch.ArgumentType.SLIDERANALOGWR,
                        defaultValue: 0
                    }
                },
                func: 'rgb'
            },
            {
                opcode: 'rgb-off',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'RGB [PIN] Off',
                arguments: {
                    PIN: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: '4',
                        menu: 'rosbotPin'
                    }
                },
                func: 'rgboff'
            },
            {
                opcode: 'distance',
                blockType: Scratch.BlockType.REPORTER,
                blockAllThreads: false,
                text: 'Distance [PIN]',
                arguments: {
                    PIN: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: '2',
                        menu: 'rosbotPin'
                    }
                },
                func: 'distance'
            },
            {
                opcode: 'power',
                blockType: Scratch.BlockType.REPORTER,
                blockAllThreads: false,
                text: 'Power',
                func: 'power',
                sepafter: 36
            },
            {
                opcode: 'ps2init',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'PS2 Init',
                func: 'ps2init'
            },
            {
                opcode: 'ps2axis',
                blockType: Scratch.BlockType.REPORTER,
                blockAllThreads: false,
                text: 'PS2 Axis [AXIS]',
                arguments: {
                    AXIS: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'L-X',
                        menu: 'axisList'
                    }
                },
                func: 'ps2axis'
            },
            {
                opcode: 'ps2button',
                blockType: Scratch.BlockType.REPORTER,
                blockAllThreads: false,
                text: 'PS2 Button [BUTTON]',
                arguments: {
                    BUTTON: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: '▲',
                        menu: 'buttonList'
                    }
                },
                func: 'ps2button',
                sepafter: 36
            },
            {
                opcode: 'ledstring',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'LED Matrix [STR]',
                arguments: {
                    STR: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'hello world'
                    }
                },
                func: 'ledstring'
            },
            {
                opcode: 'ledmatrix',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'LED Matrix [MAT]',
                arguments: {
                    MAT: {
                        type: Scratch.ArgumentType.LEDMATRIX,
                        defaultValue: '00000000024000000000042003c00000'
                    }
                },
                func: 'ledmatrix'
            },
            {
                opcode: 'ledmatrixclear',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'LED Matrix Clear',
                func: 'ledmatrixclear'
            },
            {
                opcode: 'mp3play',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'MP3 Play [IO1] [IO2]',
                arguments: {
                    IO1: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: '4',
                        menu: 'rosbotPin'
                    },
                    IO2: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: '7',
                        menu: 'rosbotPin'
                    }
                },
                func: 'mp3play'
            },
            {
                opcode: 'mp3loop',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'MP3 [DIR]',
                arguments: {
                    DIR: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'NEXT',
                        menu: 'mp3direction'
                    }
                },
                func: 'mp3loop'
            },
            {
                opcode: 'mp3volumn',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'MP3 Volumn [VOLUMN]',
                arguments: {
                    VOLUMN: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'UP',
                        menu: 'volumnList'
                    }
                },
                func: 'mp3volumn',
                sepafter: 36
            }
        ],
        menus: {
            pinMode: ['INPUT', 'OUTPUT', 'INPUT_PULLUP'],
            level: ['HIGH', 'LOW'],
            onoff: ['ON', 'OFF'],
            motorIndex: ['M1A', 'M1B', 'M2A', 'M2B'],
            stepperIndex: ['M1', 'M2'],
            rosbotPin: ['2', '3', '4', '7', '8', '11', '12', '13', 'A0', 'A1', 'A2', 'A3', 'A4', 'A5'],
            extPin: ['4', '7', '8', '11', '12', '13', 'A0', 'A1', 'A2', 'A3'],
            rgbPix: ['ALL', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'],
            analogPin: ['A0', 'A1', 'A2', 'A3', 'A4', 'A5'],
            analogWritePin: ['11'],
            sensorList: ['Light', 'Voice'],
            colorList: ['RED', 'GREEN', 'BLUE'],
            axisList: ['L-X', 'L-Y', 'R-X', 'R-Y'],
            buttonList: [
                '→', '↑', '↓', '←', '▲', '●', '×', '■', 'L1', 'L2', 'R1', 'R2'
            ],
            volumnList: ['UP', 'DOWN'],
            mp3direction: ['NEXT', 'PREVIOUS']
        },
        translation_map: {
            zh: {
                'motorspeed': '电机 [MOTOR] 运动 [SPEED]',
                'motordual': '双电机 M1A[SPDM1A] M1B[SPDM1B]',
                'motordualdelay': '双电机 M1A[SPDM1A] M1B[SPDM1B] 延时[DELAY]毫秒',
                'motorfour': '四电机 M1A[SPDM1A] M1B[SPDM1B] M2A[SPDM2A] M2B[SPDM2B]',
                'stop': '电机停止',
                'stepperline': '步进电机 直线 [DISTANCE]cm',
                'stepperturn': '步进电机 转向 [DEGREE]',
                'stepperarc': '步进电机 弧线 直径 [DIAMETER] 角度 [DEGREE]',
                'steppermove': '步进电机转动 [STEPPER] 角度 [DEGREE] RPM [RPM]',
                'stepperppm': '步进电机 脉冲/米 [PPM]',
                'stepperwheelbase': '步进电机 轮距 [WHEELBASE]米',
                'pinmode': '引脚模式 [PIN] [MODE]',
                'digitalwrite': '数字写 [PIN] [VALUE]',
                'analogwrite': '模拟写 [PIN] [VALUE]',
                'digitalread': '数字读 [PIN]',
                'led': 'LED灯 [PIN] [VALUE]',
                'analogread': '模拟读 [PIN]',
                'button': '按键 引脚[PIN]',
                'servo': '舵机 引脚[PIN] 角度[DEGREE]',
                'tone': '蜂鸣器 [PIN] [FREQ]hz [DURATION]毫秒',
                'rgb-pick': '灯环RGB 引脚[PIN] 像素[PIX] [COLOR]',
                'rgb': '灯环RGB 引脚[PIN] 像素[PIX] 红[RED] 绿[GREEN] 蓝[BLUE]',
                'rgb-brightness': '灯环RGB 亮度 [VALUE]',
                'rgb-off': '灯环RGB [PIN] 关闭',
                'distance': '超声波距离 [PIN]',
                'power': '电源电压',
                'temp18b20': '18B20 温度 [PIN]',
                'colorSensor': '颜色传感器 [COLOR]',
                'ps2init': 'PS2模块初始化',
                'ps2axis': 'PS2手柄 轴 [AXIS]',
                'ps2button': 'PS2手柄 按钮 [BUTTON]',
                'ledstring': 'LED矩阵 [STR]',
                'ledmatrix': 'LED矩阵 [MAT]',
                'ledmatrixclear': 'LED矩阵 清屏',
                'pinMode': {'INPUT': '输入', 'OUTPUT': '输出', 'INPUT_PULLUP': '上拉输入'},
                'mp3play': 'MP3 播放 [IO1] [IO2]',
                'mp3volumn': 'MP3 音量 [VOLUMN]',
                'mp3loop': 'MP3 [DIR]',
                'mp3direction': {'NEXT': '下一首', 'PREVIOUS': '上一首'}
            },
            'zh-Hans': {
                'motorspeed': '馬達 [MOTOR] 速度 [SPEED]',
                'motordual': '移動 M1A[SPDM1A] M1B[SPDM1B]',
                'motordualdelay': '移動 M1A[SPDM1A] M1B[SPDM1B] 時間[DELAY]毫秒',
                'motorfour': '四輪驅動 M1A[SPDM1A] M1B[SPDM1B] M2A[SPDM2A] M2B[SPDM2B]',
                'stop': '停止移動',
                'stepperline': '步進電機 直行 [DISTANCE]cm',
                'stepperturn': '步進電機 車身轉向 [DEGREE]',
                'stepperarc': '步進電機 弧線移動 直徑 [DIAMETER] 角度 [DEGREE]',
                'steppermove': '步進電機轉動 [STEPPER] 角度 [DEGREE] RPM [RPM]',
                'stepperppm': '步進電機 脈衝/米 [PPM]',
                'stepperwheelbase': '步進電機 輪距 [WHEELBASE]',
                'pinmode': '腳位模式 [PIN] [MODE]',
                'digitalwrite': '數位寫入 [PIN] [VALUE]',
                'analogwrite': '類比寫入 [PIN] [VALUE]',
                'digitalread': '數位讀取 [PIN]',
                'led': 'LED燈 [PIN] [VALUE]',
                'analogread': '類比讀取 [PIN]',
                'button': '按鍵 腳位[PIN]',
                'servo': '舵機 腳位[PIN] 角度[DEGREE]',
                'tone': '蜂鳴器 [PIN] [FREQ]hz [DURATION]毫秒',
                'rgb-pick': '燈環RGB 腳位[PIN] 像素[PIX] [COLOR]',
                'rgb': '燈環RGB 腳位[PIN] 像素[PIX] 紅[RED] 綠[GREEN] 藍[BLUE]',
                'rgb-brightness': '燈環RGB 亮度 [VALUE]',
                'rgb-off': '燈環RGB 腳位[PIN] 關閉',
                'distance': '超音波距離 [PIN]',
                'power': '電源電壓',
                'temp18b20': '18B20 溫度 [PIN]',
                'colorSensor': '顏色感應器 [COLOR]',
                'ps2init': 'PS2模組初始化',
                'ps2axis': 'PS2手柄 軸 [AXIS]',
                'ps2button': 'PS2手柄 按鈕 [BUTTON]',
                'ledstring': 'LED矩陣 [STR]',
                'ledmatrix': 'LED矩陣 [MAT]',
                'ledmatrixclear': 'LED矩陣 清屏',
                'pinMode': {'INPUT': '輸入', 'OUTPUT': '輸出', 'INPUT_PULLUP': '上拉輸入'},
                'mp3play': 'MP3 播放 [IO1] [IO2]',
                'mp3volumn': 'MP3 音量 [VOLUMN]',
                'mp3loop': 'MP3 [DIR]',
                'mp3direction': {'NEXT': '下一首', 'PREVIOUS': '上一首'}
            }
        }
    };
};

const motorIndexMap = {M1A: 0, M1B: 1, M2A: 2, M2B: 3};

const hexToRgb = hex => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

KittenbotExtension.prototype.noop = function () {
};

KittenbotExtension.prototype.motorSpeed = function (args) {
    let cmd = 'M200 ' + motorIndexMap[args.MOTOR] + ' ' + args.SPEED + '\r\n';
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

KittenbotExtension.prototype.motordual = function (args) {
    const cmd = `M204 ${args.SPDM1A} ${args.SPDM1B} 0\r\n`;
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

KittenbotExtension.prototype.motordualdelay = function (args) {
    const cmd = `M204 ${args.SPDM1A} ${args.SPDM1B} ${args.DELAY}\r\n`;
    return {devmsg: 1, type: 'report', cmd: cmd,  parser: 'KittenBot.parser', retry: 0};
};

KittenbotExtension.prototype.motorfour = function (args) {
    const cmd = `M205 ${args.SPDM1A} ${args.SPDM1B} ${args.SPDM2A} ${args.SPDM2B}\r\n`;
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

KittenbotExtension.prototype.omniwheel = function (args) {
    const cmd = `M209 ${args.SPDX} ${args.SPDY} ${args.SPDR}\r\n`;
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

KittenbotExtension.prototype.motorStop = function (args) {
    let cmd = 'M203 \r\n';
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

KittenbotExtension.prototype.steppermove = function (args) {
    if (args.STEPPER === 'M1'){
        args.STEPPER = 1;
    } else {
        args.STEPPER = 2;
    }
    const cmd = `M100 ${args.STEPPER} ${args.DEGREE} ${args.RPM}\r\n`;
    return {devmsg: 1, type: 'report', cmd: cmd, parser: 'KittenBot.parser', retry: 0};
};

KittenbotExtension.prototype.stepperLine = function (args) {
    const cmd = `M101 ${args.DISTANCE}\r\n`;
    return {devmsg: 1, type: 'report', cmd: cmd, parser: 'KittenBot.parser', retry: 0};
};

KittenbotExtension.prototype.stepperTurn = function (args) {
    const cmd = `M102 ${args.DEGREE}\r\n`;
    return {devmsg: 1, type: 'report', cmd: cmd, parser: 'KittenBot.parser', retry: 0};
};

KittenbotExtension.prototype.stepperppm = function (args) {
    const cmd = `M104 ${args.PPM}\r\n`;
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

KittenbotExtension.prototype.stepperwheelbase = function (args) {
    const cmd = `M105 ${args.WHEELBASE}\r\n`;
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

KittenbotExtension.prototype.stepperArc = function (args) {
    var cmd = 'M103 ' + args.DIAMETER + ' ' + args.DEGREE + '\r\n';
    return {devmsg: 1, type: 'report', cmd: cmd, parser: 'KittenBot.parser'};
};

KittenbotExtension.prototype.button = function (args) {
    let cmd = 'M10 ' + args.PIN + '\r\n';
    return {devmsg: 1, type: 'report', cmd: cmd, parser: 'KittenBot.parser'};
};

KittenbotExtension.prototype.rgb = function (args) {
    if (args.PIX === 'ALL'){
        args.PIX = 0;
    }
    let cmd = 'M9 ' + args.PIN +  ' ' + args.PIX + ' ' + args.RED + ' ' + args.GREEN + ' ' + args.BLUE + '\r\n';
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

KittenbotExtension.prototype.rgbbrightness = function (args) {
    const cmd = `M11 ${args.VALUE}\r\n`;
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

KittenbotExtension.prototype.rgbpick = function (args) {
    if (args.PIX === 'ALL'){
        args.PIX = 0;
    }
    const color = hexToRgb(args.COLOR);
    let cmd = 'M9 ' + args.PIN + ' ' + args.PIX + ' ' + color.r + ' ' + color.g + ' ' + color.b + '\r\n';
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

KittenbotExtension.prototype.rgboff = function (args) {
    const cmd = `M9 ${args.PIN} 0 0 0 0\r\n`;
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};


const pinModeMap = {INPUT: 0, OUTPUT: 1, INPUT_PULLUP: 2};
const levelMap = {HIGH: 1, LOW: 0};
const onoffMap = {ON: 0, OFF: 1};

KittenbotExtension.prototype.pinMode = function (args) {
    let cmd = 'M1 ' + args.PIN + ' ' + pinModeMap[args.MODE] + '\r\n';
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

KittenbotExtension.prototype.digitalWrite = function (args) {
    if (isNaN(args.VALUE)){
        args.VALUE = levelMap[args.VALUE];
    }
    let cmd = 'M2 ' + args.PIN + ' ' + args.VALUE + '\r\n';
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

KittenbotExtension.prototype.led = function (args) {
    if (isNaN(args.VALUE)){
        args.VALUE = onoffMap[args.VALUE];
    }
    let cmd = 'M2 ' + args.PIN + ' ' + args.VALUE + '\r\n';
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

KittenbotExtension.prototype.analogWrite = function (args) {
    let cmd = 'M4 ' + args.PIN + ' ' + args.VALUE + '\r\n';
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

KittenbotExtension.prototype.digitalRead = function (args) {
    let cmd = 'M3 ' + args.PIN + '\r\n';
    return {devmsg: 1, type: 'report', cmd: cmd, parser: 'KittenBot.parser'};
};

KittenbotExtension.prototype.analogRead = function (args) {
    let cmd = 'M5 ' + args.PIN + '\r\n';
    return {devmsg: 1, type: 'report', cmd: cmd, parser: 'KittenBot.parser'};
};


KittenbotExtension.prototype.distance = function (args) {
    let cmd = 'M250 ' + args.PIN + ' 99\r\n';
    return {devmsg: 1, type: 'report', cmd: cmd, parser: 'KittenBot.parser'};
};

KittenbotExtension.prototype.power = function (args) {
    let cmd = 'M8 \r\n';
    return {devmsg: 1, type: 'report', cmd: cmd, parser: 'KittenBot.parser'};
};

KittenbotExtension.prototype.servo = function (args) {
    const pinIndexMap = {
        '4': 0, '7': 1, '8': 2, '11': 3, '12': 4, '13': 5, 'A0': 6, 'A1': 7, 'A2': 8, 'A3': 9
    };
    let cmd = 'M212 ' + pinIndexMap[args.PIN] + ' ' + args.DEGREE + '\r\n';
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

KittenbotExtension.prototype.tone = function (args) {
    let cmd = 'M6 ' + args.PIN + ' ' + args.FREQ + ' ' + args.DURATION + '\r\n';
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

KittenbotExtension.prototype.temp18b20 = function (args) {
    let cmd = `M214 ${args.PIN}\r\n`;
    return {devmsg: 1, type: 'report', cmd: cmd, parser: 'KittenBot.parser'};
};

KittenbotExtension.prototype.dht11 = function (args) {
    let fun;
    if (args.FUN === 'Temperature'){
        fun = 1;
    } else {
        fun = 2;
    }
    let cmd = `M215 ${args.PIN} ${fun}\r\n`;
    return {devmsg: 1, type: 'report', cmd: cmd, parser: 'KittenBot.parser'};
};

KittenbotExtension.prototype.colorSensor = function (args) {
    const cmd = `M217 \r\n`;
    return {devmsg: 1, type: 'report', cmd: cmd, parser: 'KittenBot.parser'};
};

KittenbotExtension.prototype.ledstring = function (args) {
    let cmd = `M20 ${args.STR}\r\n`;
    return {devmsg: 1, type: 'report', cmd: cmd, parser: 'KittenBot.parser', retry: 0};
};

KittenbotExtension.prototype.ledmatrix = function (args) {
    let cmd = `M21 ${args.MAT}\r\n`;
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

KittenbotExtension.prototype.ledmatrixclear = function (args) {
    let cmd = `M21 00000000000000000000000000000000\r\n`;
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

KittenbotExtension.prototype.sensorread = function (args) {
    let sensor;
    if (args.SENSOR === 'Light'){
        sensor = 1;
    } else {
        sensor = 2;
    }
    const cmd = `M218 ${args.PIN} ${sensor}\r\n`;
    return {devmsg: 1, type: 'report', cmd: cmd, parser: 'KittenBot.parser'};
};

KittenbotExtension.prototype.ps2init = function (args) {
    let cmd = `M220\r\n`;
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

KittenbotExtension.prototype.ps2axis = function (args) {
    const axisMap = {'L-X': 7, 'L-Y': 8, 'R-X': 5, 'R-Y': 6};
    const cmd = `M221 ${axisMap[args.AXIS]}\r\n`;
    return {devmsg: 1, type: 'report', cmd: cmd, parser: 'KittenBot.parser'};
};

KittenbotExtension.prototype.ps2button = function (args) {
    const buttonMap = {'→': 9, '↑': 11, '↓': 12, '←': 10, '▲': 13, '●': 14,
        '×': 15, '■': 16, 'L2': 19, 'R2': 20, 'L1': 17, 'R1': 18};
    let cmd = `M222 ${buttonMap[args.BUTTON]}\r\n`;
    return {devmsg: 1, type: 'report', cmd: cmd, parser: 'KittenBot.parser'};
};


KittenbotExtension.prototype.mp3play = function (args) {

    let cmd = `M31 ${args.IO1} ${args.IO2} 100\r\n`;
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

KittenbotExtension.prototype.mp3loop = function (args) {
    let cmd = `M30 0 1 100\r\n`;
    if (args.DIR === 'PREVIOUS'){
        cmd = `M30 1 0 100\r\n`;
    }
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

KittenbotExtension.prototype.mp3volumn = function (args) {
    let cmd = `M30 0 1 500\r\n`;
    if (args.VOLUMN === 'UP'){
        cmd = `M30 1 0 500\r\n`;
    }
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};


KittenbotExtension.prototype.parseCmd = function (msg) {
    let tmp = msg.trim().split(' ');
    tmp = tmp.filter(n => { return n !== ''});
    if (tmp[0].indexOf('M100') > -1 || tmp[0].indexOf('M101') > -1 ||
        tmp[0].indexOf('M102') > -1 || tmp[0].indexOf('M103') > -1){
        return null;
    } else if (tmp[0].indexOf('M3') > -1){
        return parseInt(tmp[2], 10);
    } else if (tmp[0].indexOf('M5') > -1){
        return parseInt(tmp[2], 10);
    } else if (tmp[0].indexOf('M10') > -1){
        return parseInt(tmp[2], 10);
    } else if (tmp[0].indexOf('M20') > -1){
        return null;
    } else if (tmp[0].indexOf('M222') > -1){
        return parseInt(tmp[1], 10);
    } else if (tmp[0].indexOf('M8') > -1){
        return parseFloat(tmp[1]);
    } else if (tmp[0].indexOf('M214') > -1){
        return parseFloat(tmp[1]);
    } else if (tmp[0].indexOf('M215') > -1){
        return parseFloat(tmp[1]);
    } else if (tmp[0].indexOf('M218') > -1){
        return parseInt(tmp[1], 10);
    } else if (tmp[0].indexOf('M217') > -1){
        return tmp[1];
    } else if (tmp[0].indexOf('M221') > -1){
        return tmp[1];
    } else if (tmp[0].indexOf('M250') > -1){
        return tmp[1];
    }
};


Scratch.extensions.register(new KittenbotExtension());
