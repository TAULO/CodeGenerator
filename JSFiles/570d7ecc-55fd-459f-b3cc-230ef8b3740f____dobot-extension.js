/**
 * Created by Riven on 2018/1/24.
 * Change by Gmii on 2018/2/27.
 */

let echoType = 0;
let queuedCmdIndex = 0;

var DobotExtension = function () {
};

const buildCmd = (id, rw, isQueued, param) => {
    id = id & 0xff;
    let ctrl = 0;
    if (rw){
        ctrl += 0x1;
    }
    if (isQueued){
        ctrl += 0x2;
    }
    let cmdlen = 2;
    let header = [0xaa, 0xaa];
    let buf = [id, ctrl]; // default buffer header
    if (param && (param instanceof Array)){
        cmdlen += param.length;
        buf = buf.concat(param);
    }
    let sum = buf.reduce((a, b) => a + b, 0);
    let checkSum = 256 - sum & 0xFF;
    buf.push(checkSum);
    buf = header.concat(cmdlen).concat(buf);
    return buf;
};

DobotExtension.prototype.getInfo = function () {
    return {
        id: 'Dobot',

        name: 'Dobot',
        color1: '#6A7782',
        color2: '#424A51',
        color3: '#424A51',

        parser: 'parseRaw',
        blocks: [
//Move
            {//initialPosition
                opcode: 'initialPosition',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Home',
                arguments: {},
                func: 'initialPosition'
            },
            {//clearAllAlarm
                opcode: 'clearAllAlarm',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Clear All Alarm',
                arguments: {},
                func: 'clearAllAlarm'
            },
            {//AllCmdClear
                opcode: 'AllCmdClear',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'All Cmd Clear',
                arguments: {},
                func: 'AllCmdClear'
            },
            {//delaySec
                opcode: 'delaySec',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Delay [TIME]s',
                arguments: {
                    TIME: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 1
                    }
                },
                func: 'delaySec'
            },
            {//moveToXYZR
                opcode: 'moveToXYZR',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Move Type[TYPE] X[X] Y[Y] Z[Z] R[R]',
                arguments: {
                    TYPE: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'LINEAR',
                        menu: 'moveType'
                    },
                    X: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 250
                    },
                    Y: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0
                    },
                    Z: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0
                    },
                    R: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0
                    }
                },
                func: 'moveToXYZR'
            },
            {//moveToAngle
                opcode: 'moveToAngle',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Move Type[TYPE] joint 1[J1] joint 2[J2] joint 3[J3] joint 4[J4]',
                arguments: {
                    TYPE: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'LINEAR',
                        menu: 'moveType'
                    },
                    J1: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0
                    },
                    J2: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 45
                    },
                    J3: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 45
                    },
                    J4: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0
                    }
                },
                func: 'moveToAngle'
            },
            {//increXYZR
                opcode: 'increXYZR',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Increment Type[TYPE] X[X] Y[Y] Z[Z] R[R]',
                arguments: {
                    TYPE: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'LINEAR',
                        menu: 'increType'
                    },
                    X: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 5
                    },
                    Y: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0
                    },
                    Z: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0
                    },
                    R: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0
                    }
                },
                func: 'increXYZR'
            },
            {//increAngle
                opcode: 'increAngle',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Increment joint 1[J1] joint 2[J2] joint 3[J3] joint 4[J4]',
                arguments: {
                    J1: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 5
                    },
                    J2: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0
                    },
                    J3: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0
                    },
                    J4: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0
                    }
                },
                func: 'increAngle'
            },
            {//moveArc
                opcode: 'moveArc',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'ARC Move X[X1] Y[Y1] Z[Z1] R[R1] to X[X2] Y[Y2] Z[Z2] R[R2]',
                arguments: {
                    X1: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 250
                    },
                    Y1: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0
                    },
                    Z1: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0
                    },
                    R1: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0
                    },
                    X2: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 270
                    },
                    Y2: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0
                    },
                    Z2: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0
                    },
                    R2: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0
                    }
                },
                func: 'moveArc'
            },
            {//doPump
                opcode: 'doPump',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Pump [TAKEPUT]',
                arguments: {
                    TAKEPUT: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'TAKE',
                        menu: 'takeput'
                    }
                },
                func: 'doPump'
            },
			{//doLaser
                opcode: 'doLaser',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Laser [ONOFF]',
                arguments: {
                    ONOFF: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'ON',
                        menu: 'onoff'
                    }
                },
                func: 'doLaser'
            },//*/
            {//SetMotor
                opcode: 'SetMotor',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Set Motor[MOTOR] Speed[SPEED] pulse/s',
                arguments: {
                    MOTOR: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'STEEPER1',
                        menu: 'motorport'
                    },
                    SPEED: {
                    	type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 10000
                    }
                },
                func: 'SetMotor'
            },
            {//extMotorDistance
                opcode: 'extMotorDistance',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Ext Motor Motor[MOTOR] Speed[SPEED] pulse/s Distance[DISTANCE] pulse',
                arguments: {
                    MOTOR: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'STEEPER1',
                        menu: 'motorport'
                    },
                    SPEED: {
                    	type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 10000
                    },
                    DISTANCE: {
                    	type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 10000
                    }
                },
                func: 'extMotorDistance'
            },
            {//checkLostStep
                opcode: 'checkLostStep',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Check Lost Step',
                arguments: {},
                func: 'checkLostStep'
            },
//Set
            {//setLinearRail
                opcode: 'setLinearRail',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Set Linear Rail [ONOFF]',
                arguments: {
                    ONOFF: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'ON',
                        menu: 'onoff'
                    }
                },
                func: 'setLinearRail'
            },
            {//moveLinearRail
                opcode: 'moveLinearRail',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Move Linear Rail to [POS]',
                arguments: {
                    POS: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0
                    }
                },
                func: 'moveLinearRail'
            },
            /*{//SetExtIO
				opcode: 'SetExtIO',
				blockType: Scratch.BlockType.COMMAND,
				blockAllThreads: false,
				text: 'Set ExtIO Type[TYPE] [EIO]',
				arguments: {
					TYPE: {
						type: Scratch.ArgumentType.STRING,
						defaultValue: 'Dummy',
						menu: 'eiotype'
					},
					EIO: {
						type: Scratch.ArgumentType.STRING,
						defaultValue: 'EIO 1',
						menu: 'eioioport'
					}
				},
				func: 'SetExtIO'
			},//*/
            {//SetExtIO_IO3V3
				opcode: 'SetExtIO_IO3V3',
				blockType: Scratch.BlockType.COMMAND,
				blockAllThreads: false,
				text: 'Set [EIO] is [TYPE] 3.3V',
				arguments: {
					TYPE: {
						type: Scratch.ArgumentType.STRING,
						defaultValue: 'INPUT',
						menu: 'eio3v3type'
					},
					EIO: {
						type: Scratch.ArgumentType.STRING,
						defaultValue: 'EIO 1',
						menu: 'eioio3v3port'
					}
				},
				func: 'SetExtIO_IO3V3'
			},
            {//SetExtIO_InputADC
				opcode: 'SetExtIO_InputADC',
				blockType: Scratch.BlockType.COMMAND,
				blockAllThreads: false,
				text: 'Set [EIO] is Input ADC',
				arguments: {
					EIO: {
						type: Scratch.ArgumentType.STRING,
						defaultValue: 'EIO 1',
						menu: 'eioiadport'
					}
				},
				func: 'SetExtIO_InputADC'
			},
            {//SetExtIO_Output5V
				opcode: 'SetExtIO_Output5V',
				blockType: Scratch.BlockType.COMMAND,
				blockAllThreads: false,
				text: 'Set [EIO] is Output 5V',
				arguments: {
					EIO: {
						type: Scratch.ArgumentType.STRING,
						defaultValue: 'EIO 10',
						menu: 'eioo5vport'
					}
				},
				func: 'SetExtIO_Output5V'
			},
            {//SetExtIO_Output12V
				opcode: 'SetExtIO_Output12V',
				blockType: Scratch.BlockType.COMMAND,
				blockAllThreads: false,
				text: 'Set [EIO] is Output 12V',
				arguments: {
					EIO: {
						type: Scratch.ArgumentType.STRING,
						defaultValue: 'EIO 2',
						menu: 'eioo12vport'
					}
				},
				func: 'SetExtIO_Output12V'
			},
            {//SetExtIO_OutputPWM
				opcode: 'SetExtIO_OutputPWM',
				blockType: Scratch.BlockType.COMMAND,
				blockAllThreads: false,
				text: 'Set [EIO] is Output PWM',
				arguments: {
					EIO: {
						type: Scratch.ArgumentType.STRING,
						defaultValue: 'EIO 4',
						menu: 'eioopwmport'
					}
				},
				func: 'SetExtIO_OutputPWM'
			},
            {//SetExtIODO
                opcode: 'SetExtIODO',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Set ExtIODO [EIO] Level[VALUE]',
                arguments: {
                    EIO: {
						type: Scratch.ArgumentType.STRING,
						defaultValue: 'EIO 1',
						menu: 'eioioport'
                    },
                    VALUE: {
						type: Scratch.ArgumentType.STRING,
						defaultValue: '0',
						menu: 'eiodolevel'
                    }
                },
                func: 'SetExtIODO'
            },
			{//SetExtIOPWM
                opcode: 'SetExtIOPWM',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Set ExtIOPWM[EIO] Frequency[HZ]Hz DutyCycle[PWM]%',
                arguments: {
                    EIO: {
						type: Scratch.ArgumentType.STRING,
						defaultValue: 'EIO 4',
						menu: 'eioopwmport'
                    },
                    HZ: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 1
					},
                    PWM: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 40
                    }
                },
                func: 'SetExtIOPWM'
            },//*/
            {//colorsensorSet
                opcode: 'colorsensorSet',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Set Color Sensor [ONOFF] port[IOPORT]',
                arguments: {
                    ONOFF: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'ON',
                        menu: 'onoff'
                    },
                    IOPORT: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'GP1',
                        menu: 'ioport'
                    }
                },
                func: 'colorsensorSet'
            },
            {//IRSwitchSet
                opcode: 'IRSwitchSet',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Set IR Switch [ONOFF] port[IRPORT]',
                arguments: {
                    ONOFF: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'ON',
                        menu: 'onoff'
                    },
                    IRPORT: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'GP1',
                        menu: 'irport'
                    }
                },
                func: 'IRSwitchSet'
            },
            {//setMotionSpeedRatio
                opcode: 'setMotionSpeedRatio',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Set Motion Speed Ratio Velocity Ratio[VRATIO] Acceleration Ratio[ARATIO]',
                arguments: {
                    VRATIO: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 20
                    },
                    ARATIO: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 50
                    }
                },
                func: 'setMotionSpeedRatio'
            },
            {//setJointSpeed
                opcode: 'setJointSpeed',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Set Joint Speed Velocity[VELOCITY] Acceleration[ACCELERATION]',
                arguments: {
                    VELOCITY: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 20
                    },
                    ACCELERATION: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 50
                    }
                },
                func: 'setJointSpeed'
            },
            {//setCoordinateSpeed
                opcode: 'setCoordinateSpeed',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Set Coordinate Speed Velocity[VELOCITY] Acceleration[ACCELERATION]',
                arguments: {
                    VELOCITY: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 20
                    },
                    ACCELERATION: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 50
                    }
                },
                func: 'setCoordinateSpeed'
            },
            {//setArcSpeed
                opcode: 'setArcSpeed',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Set Arc Speed Velocity[VELOCITY] Acceleration[ACCELERATION]',
                arguments: {
                    VELOCITY: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 20
                    },
                    ACCELERATION: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 50
                    }
                },
                func: 'setArcSpeed'
            },
            {//setLinearRailSpeed
                opcode: 'setLinearRailSpeed',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Set Linear Rail Speed Velocity[VELOCITY] Acceleration[ACCELERATION]',
                arguments: {
                    VELOCITY: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 20
                    },
                    ACCELERATION: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 50
                    }
                },
                func: 'setLinearRailSpeed'
            },
            {//setJumpHeight
                opcode: 'setJumpHeight',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Set Jump Height Height[HEIGHT] Z Limit[ZLIMIT]',
                arguments: {
                    HEIGHT: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 20
                    },
                    ZLIMIT: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 150
                    }
                },
                func: 'setJumpHeight'
            },
            {//setLostStep
                opcode: 'setLostStep',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'Set Lost Step[LOST]',
                arguments: {
                    LOST: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 1
                    }
                },
                func: 'setLostStep'
            },
//Read
            {//getPositon
                opcode: 'getPositon',
                blockType: Scratch.BlockType.REPORTER,
                blockAllThreads: false,
                text: 'Get Position [POS]',
                arguments: {
                    POS: {
                        type: Scratch.ArgumentType.STRING,
                        defaultValue: 'x',
                        menu: 'position'
                    }
                },
                func: 'getPositon',
                sepafter: 36
            },
            {//ReadExtIODI
                opcode: 'ReadExtIODI',
                blockType: Scratch.BlockType.REPORTER,
                blockAllThreads: false,
                text: 'Read ExtIODI[EIO]',
                arguments: {
                    EIO: {
						type: Scratch.ArgumentType.STRING,
						defaultValue: 'EIO 1',
						menu: 'eioio3v3port'
                    }
                },
                func: 'ReadExtIODI'
            },
            {//ReadExtIOADC
                opcode: 'ReadExtIOADC',
                blockType: Scratch.BlockType.REPORTER,
                blockAllThreads: false,
                text: 'Read ExtIO ADC[EIO]',
                arguments: {
                    EIO: {
						type: Scratch.ArgumentType.STRING,
						defaultValue: 'EIO 1',
						menu: 'eioiadport'
                    }
                },
                func: 'ReadExtIOADC'
            },
            {//colorsensorRead
                opcode: 'colorsensorRead',
                blockType: Scratch.BlockType.REPORTER,
                blockAllThreads: false,
                text: 'Read Color Sensor',
                arguments: {},
                func: 'colorsensorRead'
            },
            {//IRSwitchRead
                opcode: 'IRSwitchRead',
                blockType: Scratch.BlockType.REPORTER,
                blockAllThreads: false,
                text: 'Read IR Switch',
                arguments: {},
                func: 'IRSwitchRead'
            },
//Others
            /*{//SetQueuedCmdStartExec240
                opcode: 'SetQueuedCmdStartExec240',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'SetQueuedCmdStartExec240',
                arguments: {},
                func: 'SetQueuedCmdStartExec240'
            },//*/
            /*{//SetQueuedCmdStopExec241
                opcode: 'SetQueuedCmdStopExec241',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'SetQueuedCmdStopExec241',
                arguments: {},
                func: 'SetQueuedCmdStopExec241'
            },//*/
            /*{//SetQueuedCmdForceStopExe242
                opcode: 'SetQueuedCmdForceStopExe242',
                blockType: Scratch.BlockType.COMMAND,
                blockAllThreads: false,
                text: 'SetQueuedCmdForceStopExe242',
                arguments: {},
                func: 'SetQueuedCmdForceStopExe242'
            },//*/
            /*{//GetQueuedCmdCurrentIndex246
                opcode: 'GetQueuedCmdCurrentIndex246',
                blockType: Scratch.BlockType.REPORTER,
                blockAllThreads: false,
                text: 'GetQueuedCmdCurrentIndex246',
                arguments: {},
                func: 'GetQueuedCmdCurrentIndex246'
            },//*/
        ],
        menus: {
            moveType: ['JUMP', 'JOINT', 'LINEAR'],
            increType: ['LINEAR', 'JOINT'],
            position: ['x', 'y', 'z', 'r', 'joint 1', 'joint 2', 'joint 3', 'joint 4'],
			takeput: ['TAKE', 'PUT', 'STOP'],
            eiotype: ['Dummy', 'OUTPUT', 'PWM', 'INPUT', 'ADC'],
			eio3v3type: ['INPUT', 'OUTPUT'],
//			eiotype: ['Dummy', 'OUTPUT 3.3V', 'OUTPUT 5V', 'OUTPUT 12V', 'OUTPUT PWM', 'INPUT 3.3V', 'INPUT AD'],
			eioioport: ['EIO 1', 'EIO 2', 'EIO 3', 'EIO 4', 'EIO 5', 'EIO 6', 'EIO 7', 'EIO 8', 'EIO 9', 'EIO 10', 'EIO 11', 'EIO 12', 'EIO 13', 'EIO 14', 'EIO 15', 'EIO 16/SW 1', 'EIO 17/SW 2', 'EIO 18', 'EIO 19', 'EIO 20'],
			eioio3v3port: ['EIO 1', 'EIO 4', 'EIO 5', 'EIO 6', 'EIO 7', 'EIO 8', 'EIO 9', 'EIO 11', 'EIO 12', 'EIO 14', 'EIO 15', 'EIO 18', 'EIO 19', 'EIO 20'],
			eioo5vport: ['EIO 10', 'EIO 13'],
			eioo12vport: ['EIO 2', 'EIO 3', 'EIO 16/SW 1', 'EIO 17/SW 2'],
			eioopwmport: ['EIO 4', 'EIO 6', 'EIO 8', 'EIO 11', 'EIO 14'],
			eioiadport: ['EIO 1', 'EIO 5', 'EIO 7', 'EIO 9', 'EIO 12', 'EIO 15'],
			eiodolevel: ['0', '1'],
			onoff: ['ON', 'OFF'],
			motorport: ['STEEPER1', 'STEEPER2'],
			ioport: ['GP1', 'GP2', 'GP4', 'GP5'],
			irport: ['GP1', 'GP2']
        },
        translation_map: {
            zh: {
                'initialPosition': '??????',
				'AllCmdClear': '????????????',
                'clearAllAlarm': '??????????????????',
				'delaySec': '?????? [TIME]???',
                'getPositon': '???????????? [POS]',
				'moveToXYZR': '?????? ??????[TYPE] X[X] Y[Y] Z[Z] R[R]',
				'moveToAngle': '?????? ??????[TYPE] ??????1[J1] ??????2[J2] ??????3[J3] ??????4[J4]',
                'increXYZR': '???????????? ??????[TYPE] X[X] Y[Y] Z[Z] R[R]',
				'increAngle': '???????????? ??????1[J1] ??????2[J2] ??????3[J3] ??????4[J4]',
				'moveArc': '???????????? ???X[X1] Y[Y1] Z[Z1] R[R1] ???X[X2] Y[Y2] Z[Z2] R[R2]',
				'setLinearRail': '???????????? ??????[ONOFF]',
				'moveLinearRail': '???????????????[POS]',
                'doPump': '??????[TAKEPUT]',
				'doLaser': '??????[ONOFF]',
				'SetExtIO': '????????????IO??????[TYPE] [EIO]',
				'SetExtIO_IO3V3': '?????? [EIO] ??? [TYPE] 3.3V',
				'SetExtIO_InputADC': '?????? [EIO] ??? ?????? ADC',
				'SetExtIO_Output5V': '?????? [EIO] ??? ?????? 5V',
				'SetExtIO_Output12V': '?????? [EIO] ??? ?????? 12V',
				'SetExtIO_OutputPWM': '?????? [EIO] ??? ?????? PWM',
				'SetExtIODO': '??????IO???????????????[EIO] ??????[VALUE]',
				'SetExtIOPWM': '??????IO PWM??????[EIO] ??????[HZ]Hz ?????????[PWM]%',
				'ReadExtIODI': '??????IO????????????[EIO]',
				'ReadExtIOADC': '??????IO ADC???[EIO]',
				'SetMotor': '????????????[MOTOR] ??????[SPEED]??????/???',
				'extMotorDistance': '????????????[MOTOR] ??????[SPEED]??????/??? ??????[DISTANCE]??????',
				'colorsensorSet': '?????????????????????[ONOFF] Port[IOPORT]',
				'colorsensorRead': '???????????????????????????',
				'IRSwitchSet': '?????????????????????[ONOFF] Port[IRPORT]',
				'IRSwitchRead': '???????????????????????????',
				'setMotionSpeedRatio': '?????????????????? ????????????[VRATIO] ???????????????[ARATIO]',
				'setJointSpeed': '??????????????? ??????[VELOCITY] ?????????[ACCELERATION]',
				'setCoordinateSpeed': '????????????????????? ??????[VELOCITY] ?????????[ACCELERATION]',
				'setArcSpeed': '?????????????????? ??????[VELOCITY] ?????????[ACCELERATION]',
				'setLinearRailSpeed': '?????????????????? ??????[VELOCITY] ?????????[ACCELERATION]',
				'setJumpHeight': '?????????????????? ??????[HEIGHT] Z??????[ZLIMIT]',
				'setLostStep': '??????????????????[LOST]???',
				'checkLostStep': '????????????',
                'moveType': {'JUMP': '??????', 'JOINT': '??????', 'LINEAR': '??????'},
				'takeput': {'TAKE': '???', 'PUT': '???', 'STOP': '???'},
				'eiotype': {'Dummy': '???????????????', 'OUTPUT': 'IO?????? ', 'PWM': 'PWM??????', 'INPUT': 'IO??????', 'ADC': 'AD??????'},
				'eio3v3type': {'INPUT': '??????', 'OUTPUT': '??????'},
				'onoff': {'ON': '???', 'OFF': '???'}
            },
            'zh-Hans': {
                'initialPosition': '??????',
				'AllCmdClear': '????????????',
                'clearAllAlarm': '??????????????????',
				'delaySec': '?????? [TIME]???',
                'getPositon': '???????????? [POS]',
				'moveToXYZR': '?????? ??????[TYPE] X[X] Y[Y] Z[Z] R[R]',
				'moveToAngle': '?????? ??????[TYPE] ??????1[J1] ??????2[J2] ??????3[J3] ??????4[J4]',
                'increXYZR': '???????????? ??????[TYPE] X[X] Y[Y] Z[Z] R[R]',
				'increAngle': '???????????? ??????1[J1] ??????2[J2] ??????3[J3] ??????4[J4]',
				'moveArc': '???????????? ???X[X1] Y[Y1] Z[Z1] R[R1] ???X[X2] Y[Y2] Z[Z2] R[R2]',
				'setLinearRail': '???????????? ??????[ONOFF]',
				'moveLinearRail': '???????????????[POS]',
                'doPump': '?????? [TAKEPUT]',
				'doLaser': '??????[ONOFF]',
				'SetExtIO': '????????????IO??????[TYPE] [EIO]',
				'SetExtIO_IO3V3': '?????? [EIO] ??? [TYPE] 3.3V',
				'SetExtIO_InputADC': '?????? [EIO] ??? ?????? ADC',
				'SetExtIO_Output5V': '?????? [EIO] ??? ?????? 5V',
				'SetExtIO_Output12V': '?????? [EIO] ??? ?????? 12V',
				'SetExtIO_OutputPWM': '?????? [EIO] ??? ?????? PWM',
				'SetExtIODO': '??????IO???????????????[EIO] ??????[VALUE]',
				'SetExtIOPWM': '??????IO PWM??????[EIO] ??????[HZ]Hz ?????????[PWM]%',
				'ReadExtIODI': '??????IO????????????[EIO]',
				'ReadExtIOADC': '??????IO ADC???[EIO]',
				'SetMotor': '???????????????[MOTOR] ??????[SPEED]??????/???',
				'extMotorDistance': '???????????????[MOTOR] ??????[SPEED]??????/??? ??????[DISTANCE]??????',
				'colorsensorSet': '?????????????????????[ONOFF] Port[IOPORT]',
				'colorsensorRead': '???????????????????????????',
				'IRSwitchSet': '?????????????????????[ONOFF] Port[IRPORT]',
				'IRSwitchRead': '???????????????????????????',
				'setMotionSpeedRatio': '?????????????????? ????????????[VRATIO] ???????????????[ARATIO]',
				'setJointSpeed': '??????????????? ??????[VELOCITY] ?????????[ACCELERATION]',
				'setCoordinateSpeed': '????????????????????? ??????[VELOCITY] ?????????[ACCELERATION]',
				'setArcSpeed': '?????????????????? ??????[VELOCITY] ?????????[ACCELERATION]',
				'setLinearRailSpeed': '?????????????????? ??????[VELOCITY] ?????????[ACCELERATION]',
				'setJumpHeight': '?????????????????? ??????[HEIGHT] Z??????[ZLIMIT]',
				'setLostStep': '??????????????????[LOST]???',
				'checkLostStep': '????????????',
                'moveType': {'JUMP': '??????', 'JOINT': '??????', 'LINEAR': '??????'},
				'takeput': {'TAKE': '???', 'PUT': '???', 'STOP': '???'},
				'eiotype': {'Dummy': '???????????????', 'OUTPUT': 'IO?????? ', 'PWM': 'PWM??????', 'INPUT': 'IO??????', 'ADC': 'AD??????'},
				'eio3v3type': {'INPUT': '??????', 'OUTPUT': '??????'},
				'onoff': {'ON': '???', 'OFF': '???'}
            }
        }
    };
};

const moveTypeMap = {JUMP: 0, JOINT: 1, LINEAR: 2};
const moveAngleTypeMap = {JUMP: 3, JOINT: 4, LINEAR: 5};
const increTypeMap = {LINEAR: 7, JOINT: 8};
const positionMap = {'x': 0, 'y': 1, 'z': 2, 'r': 3, 'joint 1': 4, 'joint 2': 5, 'joint 3': 6, 'joint 4': 7};
const eioTypeMap = {'Dummy': 0, 'OUTPUT': 1, 'PWM': 2, 'INPUT': 3, 'ADC': 4};	//const eioTypeMap = {'Dummy': 0, 'OUTPUT 3.3V': 1, 'OUTPUT 5V': 1, 'OUTPUT 12V': 1, 'OUTPUT PWM': 2, 'INPUT 3.3V': 3, 'INPUT AD': 4};
const eioioportMap= {'EIO 1': 1, 'EIO 2': 2, 'EIO 3': 3, 'EIO 4': 4, 'EIO 5': 5, 'EIO 6': 6, 'EIO 7': 7, 'EIO 8': 8, 'EIO 9': 9, 'EIO 10': 10, 'EIO 11': 11, 'EIO 12': 12, 'EIO 13': 13, 'EIO 14': 14, 'EIO 15': 15, 'EIO 16/SW 1': 16, 'EIO 17/SW 2': 17, 'EIO 18': 18, 'EIO 19': 19, 'EIO 20': 20};
const eiodolevelMap= {'0': 0, '1': 1};
const onoffMap = {'ON': 1, 'OFF': 0};
const motorportMap = {'STEEPER1': 0, 'STEEPER2': 1};
const ioportMap = {'GP1': 0, 'GP2': 1, 'GP4': 2, 'GP5': 3};
const irportMap = {'GP1': 0, 'GP2': 1};

DobotExtension.prototype.initialPosition = function (args) {
    const cmd = buildCmd(31, 1, 1, null);
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

DobotExtension.prototype.clearAllAlarm = function (args) {
    const cmd = buildCmd(20, 1, 0, null);
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

DobotExtension.prototype.SetQueuedCmdStartExec240 = function (args) {
    const cmd = buildCmd(240, 1, 0, null);
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};//*/

DobotExtension.prototype.SetQueuedCmdStopExec241 = function (args) {
    const cmd = buildCmd(241, 1, 0, null);
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};//*/

DobotExtension.prototype.SetQueuedCmdForceStopExe242 = function (args) {
    const cmd = buildCmd(242, 1, 0, null);
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};//*/

DobotExtension.prototype.AllCmdClear = function (args) {
    const cmd = buildCmd(245, 1, 0, null);
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

DobotExtension.prototype.GetQueuedCmdCurrentIndex246 = function (args) {
    const cmd = buildCmd(246, 0, 0, null);
	return {devmsg: 1, type: 'report', cmd: cmd, parser: 'Dobot.parser'};
    //return {devmsg: 1, type: 'cmd', cmd: cmd};
};//*/

DobotExtension.prototype.delaySec = function (args) {
    let time = new Uint32Array(1);
    time[0] = args.TIME * 1000;
    const ary = new Uint8Array(time.buffer);
    let param = Array.from(ary);
    const cmd = buildCmd(110, 1, 1, param);
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

DobotExtension.prototype.getPositon = function (args) {
    echoType = positionMap[args.POS];
    const cmd = buildCmd(10, 0, 0, null);
    return {devmsg: 1, type: 'report', cmd: cmd, parser: 'Dobot.parser'};
};

DobotExtension.prototype.moveToXYZR = function (args) {
    let cord = new Float32Array(4);
    cord[0] = args.X;
    cord[1] = args.Y;
    cord[2] = args.Z;
    cord[3] = args.R;
    const ary = new Uint8Array(cord.buffer);
    let param = [moveTypeMap[args.TYPE]].concat(Array.from(ary));
    const cmd = buildCmd(84, 1, 1, param);
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};//*/

/*DobotExtension.prototype.moveToXYZR = function (args) {	//report demo
    let cord = new Float32Array(4);
    cord[0] = args.X;
    cord[1] = args.Y;
    cord[2] = args.Z;
    cord[3] = args.R;
    const ary = new Uint8Array(cord.buffer);
    let param = [moveTypeMap[args.TYPE]].concat(Array.from(ary));
    const cmd = buildCmd(84, 1, 1, param);
	return {devmsg: 1, type: 'report', cmd: cmd, parser: 'Dobot.parser'};
};//*/

DobotExtension.prototype.moveToAngle = function (args) {
    let angle = new Float32Array(4);
    angle[0] = args.J1;
    angle[1] = args.J2;
    angle[2] = args.J3;
    angle[3] = args.J4;
    const ary = new Uint8Array(angle.buffer);
    let param = [moveAngleTypeMap[args.TYPE]].concat(Array.from(ary));
    const cmd = buildCmd(84, 1, 1, param);

    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

DobotExtension.prototype.increXYZR = function (args) {
    let cord = new Float32Array(4);
    cord[0] = args.X;
    cord[1] = args.Y;
    cord[2] = args.Z;
    cord[3] = args.R;
    const ary = new Uint8Array(cord.buffer);
    let param = [increTypeMap[args.TYPE]].concat(Array.from(ary));
    const cmd = buildCmd(84, 1, 1, param);

    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

DobotExtension.prototype.increAngle = function (args) {
    let angle = new Float32Array(4);
    angle[0] = args.J1;
    angle[1] = args.J2;
    angle[2] = args.J3;
    angle[3] = args.J4;
    const ary = new Uint8Array(angle.buffer);
    let param = [6].concat(Array.from(ary));
    const cmd = buildCmd(84, 1, 1, param);
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

DobotExtension.prototype.moveArc = function (args) {
    let tmp = new Float32Array(8);
    tmp[0] = args.X1;
    tmp[1] = args.Y1;
    tmp[2] = args.Z1;
    tmp[3] = args.R1;
    tmp[4] = args.X2;
    tmp[5] = args.Y2;
    tmp[6] = args.Z2;
    tmp[7] = args.R2;
    const ary = new Uint8Array(tmp.buffer);
    let param = Array.from(ary);
    const cmd = buildCmd(101, 1, 1, param);

    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

DobotExtension.prototype.setLinearRail = function (args) {
	const cmd = buildCmd(3, 0, 0, [onoffMap[args.ONOFF]]);
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

DobotExtension.prototype.moveLinearRail = function (args) {
    let cord = new Float32Array(5);
    cord[0] = 0;
    cord[1] = 0;
    cord[2] = 0;
    cord[3] = 0;
    cord[4] = args.POS;
    const ary = new Uint8Array(cord.buffer);
    let param = [1].concat(Array.from(ary));
    const cmd = buildCmd(86, 1, 1, param);

    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

DobotExtension.prototype.doPump = function (args) {
	if (args.TAKEPUT === 'TAKE') {
		param = [1, 1];
	}
	else if (args.TAKEPUT === 'PUT') {
		param = [1, 0];
	}
	else {
		param = [0, 1];
	}
    const cmd = buildCmd(63, 1, 1, param);
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

DobotExtension.prototype.doLaser = function (args) {
    let onoff = args.ONOFF === 'ON' ? 1 : 0;
    let param = [onoff, onoff];
    const cmd = buildCmd(61, 1, 1, param);
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};//*/

DobotExtension.prototype.SetExtIO = function (args) {
    let param = [eioioportMap[args.EIO], eioTypeMap[args.TYPE]];
    const cmd = buildCmd(130, 1, 1, param);
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

DobotExtension.prototype.SetExtIO_IO3V3 = function (args) {
    let param = [eioioportMap[args.EIO], eioTypeMap[args.TYPE]];
    const cmd = buildCmd(130, 1, 1, param);
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

DobotExtension.prototype.SetExtIO_InputADC = function (args) {
    let param = [eioioportMap[args.EIO], 4];
    const cmd = buildCmd(130, 1, 1, param);
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

DobotExtension.prototype.SetExtIO_Output5V = function (args) {
    let param = [eioioportMap[args.EIO], 1];
    const cmd = buildCmd(130, 1, 1, param);
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

DobotExtension.prototype.SetExtIO_Output12V = function (args) {
    let param = [eioioportMap[args.EIO], 1];
    const cmd = buildCmd(130, 1, 1, param);
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

DobotExtension.prototype.SetExtIO_OutputPWM = function (args) {
    let param = [eioioportMap[args.EIO], 2];
    const cmd = buildCmd(130, 1, 1, param);
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

DobotExtension.prototype.SetExtIODO = function (args) {
    let param = [eioioportMap[args.EIO], eiodolevelMap[args.VALUE]];
    const cmd = buildCmd(131, 1, 1, param);
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

DobotExtension.prototype.SetExtIOPWM = function (args) {
    let tmp = new Float32Array(2);
    tmp[0] = args.HZ;
    tmp[1] = args.PWM;
    const ary = new Uint8Array(tmp.buffer);
	let param = [eioioportMap[args.EIO]].concat(Array.from(ary));
    const cmd = buildCmd(132, 1, 1, param);
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};//*/

DobotExtension.prototype.ReadExtIODI = function (args) {
    const cmd = buildCmd(133, 0, 0, [eioioportMap[args.EIO], 0]);
    return {devmsg: 1, type: 'report', cmd: cmd, parser: 'Dobot.parser'};
};

DobotExtension.prototype.ReadExtIOADC = function (args) {
    const cmd = buildCmd(134, 0, 0, [eioioportMap[args.EIO], 0, 0]);
    return {devmsg: 1, type: 'report', cmd: cmd, parser: 'Dobot.parser'};
};

DobotExtension.prototype.SetMotor = function (args) {
	let tmp = new Int32Array(1);
	tmp[0] = args.SPEED;
	const ary = new Uint8Array(tmp.buffer);
    let param = [motorportMap[args.MOTOR], 1].concat(Array.from(ary));
    const cmd = buildCmd(135, 1, 1, param);
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

DobotExtension.prototype.extMotorDistance = function (args) {
    let Speed_tmp = new Int32Array(1);
    Speed_tmp[0] = args.SPEED;
	let Distance_tmp = new Uint32Array(1);
    Distance_tmp[0] = args.DISTANCE;
    const Speed_ary = new Uint8Array(Speed_tmp.buffer);
	const Distance_ary = new Uint8Array(Distance_tmp.buffer);
    let param = [motorportMap[args.MOTOR], 1].concat(Array.from(Speed_ary)).concat(Array.from(Distance_ary));
    const cmd = buildCmd(136, 1, 1, param);
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

DobotExtension.prototype.colorsensorSet = function (args) {
	let param = [onoffMap[args.ONOFF], ioportMap[args.IOPORT]];
    const cmd = buildCmd(137, 1, 1, param);
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

DobotExtension.prototype.colorsensorRead = function (args) {
    const cmd = buildCmd(137, 0, 0, null);
    return {devmsg: 1, type: 'report', cmd: cmd, parser: 'Dobot.parser'};
};

DobotExtension.prototype.IRSwitchSet = function (args) {
	let param = [onoffMap[args.ONOFF], irportMap[args.IRPORT]];
    const cmd = buildCmd(138, 1, 1, param);
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

DobotExtension.prototype.IRSwitchRead = function (args) {
    const cmd = buildCmd(138, 0, 0, null);
    return {devmsg: 1, type: 'report', cmd: cmd, parser: 'Dobot.parser'};
};

DobotExtension.prototype.setMotionSpeedRatio = function (args) {
    let tmp = new Float32Array(2);
    tmp[0] = args.VRATIO;
    tmp[1] = args.ARATIO;
    const ary = new Uint8Array(tmp.buffer);
    let param = Array.from(ary);
    const cmd = buildCmd(83, 1, 1, param);
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

DobotExtension.prototype.setJointSpeed = function (args) {
    let tmp = new Float32Array(8);
    tmp[0] = args.VELOCITY;
    tmp[1] = args.VELOCITY;
    tmp[2] = args.VELOCITY;
    tmp[3] = args.VELOCITY;
    tmp[4] = args.ACCELERATION;
    tmp[5] = args.ACCELERATION;
    tmp[6] = args.ACCELERATION;
    tmp[7] = args.ACCELERATION;
    const ary = new Uint8Array(tmp.buffer);
    let param = Array.from(ary);
    const cmd = buildCmd(80, 1, 0, param);
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

DobotExtension.prototype.setCoordinateSpeed = function (args) {
    let tmp = new Float32Array(8);
    tmp[0] = args.VELOCITY;
    tmp[1] = args.VELOCITY;
    tmp[2] = args.VELOCITY;
    tmp[3] = args.VELOCITY;
    tmp[4] = args.ACCELERATION;
    tmp[5] = args.ACCELERATION;
    tmp[6] = args.ACCELERATION;
    tmp[7] = args.ACCELERATION;
    const ary = new Uint8Array(tmp.buffer);
    let param = Array.from(ary);
    const cmd = buildCmd(81, 1, 0, param);
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

DobotExtension.prototype.setArcSpeed = function (args) {
	let tmp = new Float32Array(4);
    tmp[0] = args.VELOCITY;
    tmp[1] = args.ACCELERATION;
    tmp[2] = args.VELOCITY;
    tmp[3] = args.ACCELERATION;
    const ary = new Uint8Array(tmp.buffer);
    let param = Array.from(ary);
    const cmd = buildCmd(100, 1, 0, param);
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

DobotExtension.prototype.setLinearRailSpeed = function (args) {
	let tmp = new Float32Array(2);
    tmp[0] = args.VELOCITY;
    tmp[1] = args.ACCELERATION;
    const ary = new Uint8Array(tmp.buffer);
    let param = Array.from(ary);
    const cmd = buildCmd(85, 1, 0, param);
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

DobotExtension.prototype.setJumpHeight = function (args) {

    let tmp = new Float32Array(2);
    tmp[0] = args.HEIGHT;
    tmp[1] = args.ZLIMIT;
    const ary = new Uint8Array(tmp.buffer);
    let param = Array.from(ary);
    const cmd = buildCmd(82, 1, 0, param);
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

DobotExtension.prototype.setLostStep = function (args) {
    let lost = new Float32Array(1);
    lost[0] = args.LOST;
    const ary = new Uint8Array(lost.buffer);
    let param = Array.from(ary);
    const cmd = buildCmd(170, 1, 0, param);
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

DobotExtension.prototype.checkLostStep = function (args) {
    const cmd = buildCmd(171, 1, 1, null);
    return {devmsg: 1, type: 'cmd', cmd: cmd};
};

DobotExtension.prototype.parseRaw = function (msg) {
    if (msg[0] !== 0xaa || msg[1] !== 0xaa) return;
    if (msg[3] === 10) {		// postion echo
        let payload = new Uint8Array(msg.slice(5, -1));
        let floatAry = new Float32Array(payload.buffer);
        return (floatAry[echoType].toFixed(2)) / 1;
    }
	else if (msg[3] === 133) {	//extIO
        let payload = new Uint8Array(msg.slice(5, -1));
        return payload[1];
    }
	else if (msg[3] === 134) {	//extIO adc
        let payload = new Uint8Array(msg.slice(5, -1));
        let uint16Ary = new Uint16Array(payload.buffer.slice(1));
        return uint16Ary[0];
    }
	else if (msg[3] === 137) {	//color
        let payload = new Uint8Array(msg.slice(5, -1));
        return payload[0].toString(16) + payload[1].toString(16) + payload[2].toString(16);
    }
	else if (msg[3] === 138) {	//ir
        let payload = new Uint8Array(msg.slice(5, -1));
        return payload[0];
    }
	else if (msg[3] === 246) {	//CmdIndex
        let payload = new Uint8Array(msg.slice(5, -1));
		let UintAry = new Uint32Array(payload.buffer);
        return (UintAry[queuedCmdIndex]);
    }//*/
	/*else if (msg[3] == 84) {	//ptpcmd report demo
		let payload = new Uint8Array(msg.slice(5, -1));
		let uint32Ary = new Uint32Array(payload.buffer);
		queuedCmdIndex = uint32Ary[1];
	}//*/
};


Scratch.extensions.register(new DobotExtension());
