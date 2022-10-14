const ColorBlock = '#52D6F4';

// DC Motor

Blockly.Blocks['makerbit_move_motor'] = {
  init: function() {
    this.jsonInit(
      {
        "type": "makerbit_move_motor",
        "message0": "%1 di chuyển %2 với tốc độ %3 (0-100)",
        "args0": [
          {
            "type": "field_image",
            "src": "https://ohstem-public.s3.ap-southeast-1.amazonaws.com/extensions/AITT-VN/yolobit_extension_makerbit/images/motor_block.svg",
            "width": 20,
            "height": 20,
            "alt": "",
            "flipRtl": false
          },
          {
            "type": "field_dropdown",
            "name": "motor",
            "options": [
              [
                "M1",
                "0"
              ],
              [
                "M2",
                "1"
              ],
              [
                "M3",
                "2"
              ],
              [
                "M4",
                "3"
              ]
            ]
          },
          {
            min: 0,
            type: "input_value",
            check: "Number",
            value: 50,
            name: "speed",
          }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": ColorBlock,
        "tooltip": "",
        "helpUrl": ""
      }
    );
  }
};

Blockly.Python["makerbit_move_motor"] = function (block) {
  Blockly.Python.definitions_['import_makerbit'] = 'from makerbit import *';
  var motor = block.getFieldValue("motor");
  var speed = Blockly.Python.valueToCode(block, 'speed', Blockly.Python.ORDER_ATOMIC);
  // TODO: Assemble Python into code variable.
  var code = "motor.speed(" + motor + ", " + speed + ")\n";
  return code;
};

Blockly.Blocks['makerbit_move_stop'] = {
  init: function () {
    this.jsonInit(
      {
        "type": "makerbit_move_stop",
        "message0": "%1 dừng di chuyển",
        "args0": [
          {
            "type": "field_image",
            "src": "https://ohstem-public.s3.ap-southeast-1.amazonaws.com/extensions/AITT-VN/yolobit_extension_makerbit/images/827428.svg",
            "width": 20,
            "height": 20,
            "alt": "*",
            "flipRtl": false
          }],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": ColorBlock,
        "tooltip": "",
        "helpUrl": ""

      }
    );
  }
};

Blockly.Python["makerbit_move_stop"] = function (block) {
  Blockly.Python.definitions_['import_makerbit'] = 'from makerbit import *';
  // TODO: Assemble Python into code variable.
  var code = "motor.move(0, 0)\n";
  return code;
};

// Servo

Blockly.Blocks['makerbit_move_servo'] = {
  init: function () {
    this.jsonInit(
      {
        "type": "makerbit_move_servo",
        "message0": "%3 servo %1 xoay góc %2 (0-180)",
        "args0": [

          {
            "type": "field_dropdown",
            "name": "servo",
            "options": [
              [
                "S1",
                "0"
              ],
              [
                "S2",
                "1"
              ],
              [
                "S3",
                "2"
              ],
              [
                "S4",
                "3"
              ],
              [
                "S5",
                "4"
              ],
              [
                "S6",
                "5"
              ],
              [
                "S7",
                "6"
              ],
              [
                "S8",
                "7"
              ]
            ]
          },
          {
            "type": "input_value",
            "name": "angle",
            "check": "Number"
          },
          {
            "type": "field_image",
            "src": "https://ohstem-public.s3.ap-southeast-1.amazonaws.com/extensions/AITT-VN/yolobit_extension_makerbit/images/servo_block.webp",
            "width": 20,
            "height": 20,
            "alt": "*",
            "flipRtl": false
          }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": ColorBlock,
        "tooltip": "",
        "helpUrl": ""
      }
    );
  }
};

Blockly.Python["makerbit_move_servo"] = function (block) {
  var servo = block.getFieldValue("servo");
  var angle = Blockly.Python.valueToCode(block, 'angle', Blockly.Python.ORDER_ATOMIC);
  Blockly.Python.definitions_['import_makerbit'] = 'from makerbit import *';
  // TODO: Assemble Python into code variable.
  var code = "servo.position(" + servo + ", " + angle + ")\n";
  return code;
};

Blockly.Python["makerbit_move_servo_rotate"] = function (block) {
  Blockly.Python.definitions_['import_makerbit'] = 'from makerbit import *';
  var servo = block.getFieldValue("servo");
  var change = Blockly.Python.valueToCode(block, 'change', Blockly.Python.ORDER_ATOMIC);
  var speed = Blockly.Python.valueToCode(block, 'speed', Blockly.Python.ORDER_ATOMIC);
  var limit = Blockly.Python.valueToCode(block, 'limit', Blockly.Python.ORDER_ATOMIC);
  // TODO: Assemble Python into code variable.
  var code = "servo.rotate(" + servo + ", " + change + ", " + speed + ", " + limit + ")\n";
  return code;
};

Blockly.Blocks['makerbit_move_servo_rotate'] = {
  init: function () {
    this.jsonInit(
      {
        "type": "makerbit_move_servo_rotate",
        "message0": "%1 servo %2 xoay %3 độ tốc độ %4 (ms) giới hạn góc %5 độ",
        "args0": [
          {
            "type": "field_image",
            "src": "https://ohstem-public.s3.ap-southeast-1.amazonaws.com/extensions/AITT-VN/yolobit_extension_makerbit/images/servo_block.webp",
            "width": 20,
            "height": 20,
            "alt": "*",
            "flipRtl": false
          },
          {
            "type": "field_dropdown",
            "name": "servo",
            "options": [
              [
                "S1",
                "0"
              ],
              [
                "S2",
                "1"
              ],
              [
                "S3",
                "2"
              ],
              [
                "S4",
                "3"
              ],
              [
                "S5",
                "4"
              ],
              [
                "S6",
                "5"
              ],
              [
                "S7",
                "6"
              ],
              [
                "S8",
                "7"
              ]
            ]
          },
          {
            "type": "input_value",
            "name": "change",
            "check": "Number"
          },
          {
            "type": "input_value",
            "name": "speed",
            "check": "Number"
          },
          {
            "type": "input_value",
            "name": "limit",
            "check": "Number"
          }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": ColorBlock,
        "tooltip": "",
        "helpUrl": ""
      }
    );
  }
};

Blockly.Blocks['makerbit_move_servo270'] = {
  init: function () {
    this.jsonInit(
      {
        "type": "makerbit_move_servo270",
        "message0": "%3 servo (270°) %1 xoay góc %2 (0-270)",
        "args0": [

          {
            "type": "field_dropdown",
            "name": "servo",
            "options": [
              [
                "S1",
                "0"
              ],
              [
                "S2",
                "1"
              ],
              [
                "S3",
                "2"
              ],
              [
                "S4",
                "3"
              ],
              [
                "S5",
                "4"
              ],
              [
                "S6",
                "5"
              ],
              [
                "S7",
                "6"
              ],
              [
                "S8",
                "7"
              ]
            ]
          },
          {
            "type": "input_value",
            "name": "angle",
            "check": "Number"
          },
          {
            "type": "field_image",
            "src": "https://ohstem-public.s3.ap-southeast-1.amazonaws.com/extensions/AITT-VN/yolobit_extension_makerbit/images/servo_block.webp",
            "width": 20,
            "height": 20,
            "alt": "*",
            "flipRtl": false
          }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": ColorBlock,
        "tooltip": "",
        "helpUrl": ""
      }
    );
  }
};

Blockly.Python["makerbit_move_servo270"] = function (block) {
  Blockly.Python.definitions_['import_makerbit'] = 'from makerbit import *';
  var servo = block.getFieldValue("servo");
  var angle = Blockly.Python.valueToCode(block, 'angle', Blockly.Python.ORDER_ATOMIC);
  // TODO: Assemble Python into code variable.
  var code = "servo.position(" + servo + ", " + angle + ", max_degrees=270)\n";
  return code;
};

Blockly.Blocks['makerbit_move_servo270_rotate'] = {
  init: function () {
    this.jsonInit(
      {
        "type": "makerbit_move_servo270_rotate",
        "message0": "%1 servo (270°) %2 xoay %3 độ tốc độ %4 (ms) giới hạn góc %5 độ",
        "args0": [
          {
            "type": "field_image",
            "src": "https://ohstem-public.s3.ap-southeast-1.amazonaws.com/extensions/AITT-VN/yolobit_extension_makerbit/images/servo_block.webp",
            "width": 20,
            "height": 20,
            "alt": "*",
            "flipRtl": false
          },
          {
            "type": "field_dropdown",
            "name": "servo",
            "options": [
              [
                "S1",
                "0"
              ],
              [
                "S2",
                "1"
              ],
              [
                "S3",
                "2"
              ],
              [
                "S4",
                "3"
              ],
              [
                "S5",
                "4"
              ],
              [
                "S6",
                "5"
              ],
              [
                "S7",
                "6"
              ],
              [
                "S8",
                "7"
              ]
            ]
          },
          {
            "type": "input_value",
            "name": "change",
            "check": "Number"
          },
          {
            "type": "input_value",
            "name": "speed",
            "check": "Number"
          },
          {
            "type": "input_value",
            "name": "limit",
            "check": "Number"
          }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": ColorBlock,
        "tooltip": "",
        "helpUrl": ""
      }
    );
  }
};

Blockly.Python["makerbit_move_servo270_rotate"] = function (block) {
  Blockly.Python.definitions_['import_makerbit'] = 'from makerbit import *';
  var servo = block.getFieldValue("servo");
  var change = Blockly.Python.valueToCode(block, 'change', Blockly.Python.ORDER_ATOMIC);
  var speed = Blockly.Python.valueToCode(block, 'speed', Blockly.Python.ORDER_ATOMIC);
  var limit = Blockly.Python.valueToCode(block, 'limit', Blockly.Python.ORDER_ATOMIC);
  // TODO: Assemble Python into code variable.
  var code = "servo.rotate(" + servo + ", " + change + ", " + speed + ", " + limit + ", max_degrees=270)\n";
  return code;
};

Blockly.Blocks['makerbit_move_servo360'] = {
  init: function () {
    this.jsonInit(
      {
        "type": "makerbit_move_servo360",
        "message0": "%1 servo (360°) %2 xoay với tốc độ %3(-100 đến 100)",
        "args0": [
          {
            "type": "field_image",
            "src": "https://ohstem-public.s3.ap-southeast-1.amazonaws.com/extensions/AITT-VN/yolobit_extension_makerbit/images/servo_block.webp",
            "width": 20,
            "height": 20,
            "alt": "*",
            "flipRtl": false
          },
          {
            "type": "field_dropdown",
            "name": "servo",
            "options": [
              [
                "S1",
                "0"
              ],
              [
                "S2",
                "1"
              ],
              [
                "S3",
                "2"
              ],
              [
                "S4",
                "3"
              ],
              [
                "S5",
                "4"
              ],
              [
                "S6",
                "5"
              ],
              [
                "S7",
                "6"
              ],
              [
                "S8",
                "7"
              ]
            ]
          },
          {
            "type": "input_value",
            "name": "speed",
            "check": "Number"
          },

        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": ColorBlock,
        "tooltip": "",
        "helpUrl": ""
      }
    );
  }
};

Blockly.Python["makerbit_move_servo360"] = function (block) {
  Blockly.Python.definitions_['import_makerbit'] = 'from makerbit import *';
  var servo = block.getFieldValue("servo");
  var speed = Blockly.Python.valueToCode(block, 'speed', Blockly.Python.ORDER_ATOMIC);
  // TODO: Assemble Python into code variable.
  var code = "servo.spin(" + servo + ", " + speed + ")\n";
  return code;
};

Blockly.Blocks["makerbit_move_servo_read_position"] = {
  init: function () {
    this.jsonInit({
      colour: ColorBlock,
      tooltip: "",
      message0: "%1 servo %2 lấy vị trí hiện tại",
      args0: [
        {
          "type": "field_image",
          "src": "https://ohstem-public.s3.ap-southeast-1.amazonaws.com/extensions/AITT-VN/yolobit_extension_makerbit/images/servo_block.webp",
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        },
        {
          "type": "field_dropdown",
          "name": "servo",
          "options": [
            [
              "S1",
              "0"
            ],
            [
              "S2",
              "1"
            ],
            [
              "S3",
              "2"
            ],
            [
              "S4",
              "3"
            ],
            [
              "S5",
              "4"
            ],
            [
              "S6",
              "5"
            ],
            [
              "S7",
              "6"
            ],
            [
              "S8",
              "7"
            ]
          ]
        }
      ],
      output: "Number",
      helpUrl: ""
    });
  },
};

Blockly.Python["makerbit_move_servo_read_position"] = function (block) {
  Blockly.Python.definitions_['import_makerbit'] = 'from makerbit import *';
  var servo = block.getFieldValue("servo");
  // TODO: Assemble Python into code variable.
  var code = "servo.position(" + servo + ")";
  return [code, Blockly.Python.ORDER_NONE];
};

// Ultrasonic

Blockly.Blocks['makerbit_ultrasonic_create'] = {
  /**
   * Block for waiting.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit(
      {
        "type": "makerbit_ultrasonic_create",
        "message0": "%3 khởi tạo cảm biến khoảng cách với chân trigger %1 chân echo %2",
        "args0": [
          {
            "type": "field_dropdown",
            "name": "TRG",
            "options": [
              [
                "P3",
                "pin3"
              ],
              [
                "P0",
                "pin0"
              ],
              [
                "P1",
                "pin1"
              ],
              [
                "P2",
                "pin2"
              ],
              [
                "P4",
                "pin4"
              ],
              [
                "P5",
                "pin5"
              ],
              [
                "P6",
                "pin6"
              ],
              [
                "P7",
                "pin7"
              ],
              [
                "P8",
                "pin8"
              ],
              [
                "P9",
                "pin9"
              ],
              [
                "P10",
                "pin10"
              ],
              [
                "P11",
                "pin11"
              ],
              [
                "P12",
                "pin12"
              ],
              [
                "P13",
                "pin13"
              ],
              [
                "P14",
                "pin14"
              ],
              [
                "P15",
                "pin15"
              ],
              [
                "P16",
                "pin16"
              ],
              [
                "P19",
                "pin19"
              ],
              [
                "P20",
                "pin20"
              ]
            ]
          },
          {
            "type": "field_dropdown",
            "name": "ECH",
            "options": [
              [
                "P6",
                "pin6"
              ],
              [
                "P0",
                "pin0"
              ],
              [
                "P1",
                "pin1"
              ],
              [
                "P2",
                "pin2"
              ],
              [
                "P3",
                "pin3"
              ],
              [
                "P4",
                "pin4"
              ],
              [
                "P5",
                "pin5"
              ],
              [
                "P7",
                "pin7"
              ],
              [
                "P8",
                "pin8"
              ],
              [
                "P9",
                "pin9"
              ],
              [
                "P10",
                "pin10"
              ],
              [
                "P11",
                "pin11"
              ],
              [
                "P12",
                "pin12"
              ],
              [
                "P13",
                "pin13"
              ],
              [
                "P14",
                "pin14"
              ],
              [
                "P15",
                "pin15"
              ],
              [
                "P16",
                "pin16"
              ],
              [
                "P19",
                "pin19"
              ],
              [
                "P20",
                "pin20"
              ]
            ]
          },
          {
            "type": "field_image",
            "src": "https://ohstem-public.s3.ap-southeast-1.amazonaws.com/extensions/AITT-VN/yolobit_extension_makerbit/images/ultrasonic.png",
            "width": 20,
            "height": 20,
            "alt": "*",
            "flipRtl": false
          }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": ColorBlock,
        "tooltip": "Khởi tạo cảm biến khoảng cách với 2 chân cắm Trigger và Echo được chọn",
        "helpUrl": ""
      }
    );
  },
  getDeveloperVars: function () {
    return ['ultrasonic_makerbit'];
  }
};

Blockly.Python['makerbit_ultrasonic_create'] = function (block) {
  var dropdown_trg = block.getFieldValue('TRG');
  var dropdown_ech = block.getFieldValue('ECH');
  // TODO: Assemble Python into code variable.
  Blockly.Python.definitions_['import_yolobit'] = 'from yolobit import *';
  Blockly.Python.definitions_['import_ultrasonic'] = 'from makerbit_hcsr04 import HCSR04';
  var code = 'ultrasonic_makerbit = HCSR04(trigger_pin=' + dropdown_trg + '.pin, echo_pin=' + dropdown_ech + '.pin)\n';
  return code;
};

Blockly.Blocks['makerbit_ultrasonic_read'] = {
  init: function () {
    this.jsonInit(
      {
        "type": "makerbit_ultrasonic_read",
        "message0": "%2 đọc cảm biến khoảng cách theo %1",
        "args0": [
          {
            "type": "field_dropdown",
            "name": "TYPE",
            "options": [
              [
                "cm",
                "CM"
              ],
              [
                "mm",
                "MM"
              ]
            ]
          },
          {
            "type": "field_image",
            "src": "https://ohstem-public.s3.ap-southeast-1.amazonaws.com/extensions/AITT-VN/yolobit_extension_makerbit/images/ultrasonic.png",
            "width": 20,
            "height": 20,
            "alt": "*",
            "flipRtl": false
          }
        ],
        "output": null,
        "colour": ColorBlock,
        "tooltip": "Đọc giá trị đo được của cảm biến khoảng cách",
        "helpUrl": ""
      }
    );
  },
  getDeveloperVars: function () {
    return ['ultrasonic_makerbit'];
  }
};

Blockly.Python['makerbit_ultrasonic_read'] = function (block) {
  var dropdown_type = block.getFieldValue('TYPE');
  // TODO: Assemble Python into code variable.
  var code = '';
  if (dropdown_type == 'CM') {
    code = 'ultrasonic_makerbit.distance_cm()';
  } else {
    code = 'ultrasonic_makerbit.distance_mm()';
  }
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Blocks['makerbit_ultrasonic_checkdistance'] = {
  init: function () {
    this.jsonInit(
      {
        "type": "makerbit_ultrasonic_checkdistance",
        "message0": "%4 cảm biến khoảng cách đọc được < %1 %2 %3",
        "args0": [
          {
            "type": "input_dummy"
          },
          {
            "type": "input_value",
            "name": "DISTANCE",
            "check": "Number"
          },
          {
            "type": "field_dropdown",
            "name": "TYPE",
            "options": [
              [
                "cm",
                "CM"
              ],
              [
                "mm",
                "MM"
              ]
            ]
          },
          {
            "type": "field_image",
            "src": "https://ohstem-public.s3.ap-southeast-1.amazonaws.com/extensions/AITT-VN/yolobit_extension_makerbit/images/ultrasonic.png",
            "width": 20,
            "height": 20,
            "alt": "*",
            "flipRtl": false
          }
        ],
        "output": "Boolean",
        "colour": ColorBlock,
        "tooltip": "Kiểm tra xem khoảng cách đo được của cảm biến có lớn hơn giá trị được chọn hay không",
        "helpUrl": ""
      }
    );
  },
  getDeveloperVars: function () {
    return ['ultrasonic_makerbit'];
  }
};

Blockly.Python['makerbit_ultrasonic_checkdistance'] = function (block) {
  var value_distance = Blockly.Python.valueToCode(block, 'DISTANCE', Blockly.Python.ORDER_ATOMIC);
  var dropdown_type = block.getFieldValue('TYPE');
  // TODO: Assemble Python into code variable.
  var code = '';
  if (dropdown_type == 'CM')
    code = 'ultrasonic_makerbit.distance_cm() < ' + value_distance;
  else
    code = 'ultrasonic_makerbit.distance_mm() < ' + value_distance;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_NONE];
};

// Color Sensor

Blockly.Blocks["makerbit_input_color_sensor_read"] = {
  init: function () {
    this.jsonInit({
      colour: ColorBlock,
      tooltip: "",
      message0: "%2 cảm biến màu sắc đọc giá trị %1",
      args0: [
        {
          type: "field_dropdown",
          name: "RGB",
          options: [
            ["RED", "r"],
            ["GREEN", "g"],
            ["BLUE", "b"],
          ],
        },
        {
          "type": "field_image",
          "src": "https://ohstem-public.s3.ap-southeast-1.amazonaws.com/extensions/AITT-VN/yolobit_extension_makerbit/images/rgb.png",
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        }
      ],
      output: "Number",
      helpUrl: "",
    });
  },
};

Blockly.Blocks["makerbit_input_color_sensor_detect"] = {
  init: function () {
    this.jsonInit({
      colour: ColorBlock,
      tooltip: "",
      message0: "%2 cảm biến màu sắc phát hiện màu %1",
      args0: [
        {
          type: "field_dropdown",
          name: "color",
          options: [
            ["trắng", "w"],
            ["đen", "d"],
            ["đỏ", "r"],
            ["xanh lá (green)", "g"],
            ["xanh dương (blue)", "b"],
            ["vàng", "y"]
          ],
        },
        {
          "type": "field_image",
          "src": "https://ohstem-public.s3.ap-southeast-1.amazonaws.com/extensions/AITT-VN/yolobit_extension_makerbit/images/rgb.png",
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        }
      ],
      output: "Boolean",
      helpUrl: "",
    });
  },
};

Blockly.Python["makerbit_input_color_sensor_read"] = function (block) {
  var RGB = block.getFieldValue("RGB");
  // TODO: Assemble Python into code variable.
  Blockly.Python.definitions_['import_color_sensor'] = "from makerbit_tcs34725 import color_sensor";
  var code = "color_sensor.read('" + RGB + "')";
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python["makerbit_input_color_sensor_detect"] = function (block) {
  var color = block.getFieldValue("color");
  // TODO: Assemble Python into code variable.
  Blockly.Python.definitions_['import_color_sensor'] = "from makerbit_tcs34725 import color_sensor";
  var code = "color_sensor.detect('" + color + "')";
  return [code, Blockly.Python.ORDER_NONE];
};

// Endstop

Blockly.Blocks['makerbit_endstop'] = {
  init: function () {
    this.jsonInit(
      {
        "type": "makerbit_endstop",
        "message0": "%1 trạng thái của công tắc hành trình chân %2",
        "args0": [
          {
            "type": "field_image",
            "src": "https://ohstem-public.s3.ap-southeast-1.amazonaws.com/extensions/AITT-VN/yolobit_extension_makerbit/images/limit_switch.png",
            "width": 20,
            "height": 20,
            "alt": "*",
            "flipRtl": false
          },
          {
            "type": "field_dropdown",
            "name": "NAME",
            "options": [
              [
                "P1",
                "pin1"
              ],
              [
                "P0",
                "pin0"
              ],
              [
                "P2",
                "pin2"
              ],
              [
                "P3",
                "pin3"
              ],
              [
                "P4",
                "pin4"
              ],
              [
                "P5",
                "pin5"
              ],
              [
                "P6",
                "pin6"
              ],
              [
                "P7",
                "pin7"
              ],
              [
                "P8",
                "pin8"
              ],
              [
                "P9",
                "pin9"
              ],
              [
                "P10",
                "pin10"
              ],
              [
                "P11",
                "pin11"
              ],
              [
                "P12",
                "pin12"
              ],
              [
                "P13",
                "pin13"
              ],
              [
                "P14",
                "pin14"
              ],
              [
                "P15",
                "pin15"
              ],
              [
                "P16",
                "pin16"
              ],
              [
                "P19",
                "pin19"
              ],
              [
                "P20",
                "pin20"
              ]
            ]
          }
        ],
        "output": null,
        "colour": ColorBlock,
        "tooltip": "Trả về giá trị (0) hoặc (1) của ccông tắc hành trình",
        "helpUrl": ""
      }
    );
  }
};

Blockly.Python['makerbit_endstop'] = function (block) {
  Blockly.Python.definitions_['import_yolobit'] = 'from yolobit import *';
  var dropdown_name = block.getFieldValue('NAME');
  // TODO: Assemble Python into code variable.
  var code = dropdown_name + '.read_digital() == 0';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_NONE];
};

// IR reciever

Blockly.Blocks["makerbit_ir_recv"] = {
  init: function () {
    this.jsonInit({
      colour: ColorBlock,
      tooltip: "",
      message0: "%1 nút %2 trên remote được nhấn",
      args0: [
        {
          "type": "field_image",
          "src": "https://ohstem-public.s3.ap-southeast-1.amazonaws.com/extensions/AITT-VN/yolobit_extension_makerbit/images/remote.png",
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        },
        {
          type: "field_dropdown",
          name: "remote",
          options: [
            ["A", "A"],
            ["B", "B"],
            ["C", "C"],
            ["D", "D"],
            ["E", "E"],
            ["F", "F"],
            [
              {
                "src": "https://ohstem-public.s3.ap-southeast-1.amazonaws.com/extensions/AITT-VN/yolobit_extension_makerbit/images/forward.svg",
                "width": 15,
                "height": 15,
                "alt": "*"
              },
              "UP"
            ],
            [
              {
                "src": "https://ohstem-public.s3.ap-southeast-1.amazonaws.com/extensions/AITT-VN/yolobit_extension_makerbit/images/backward.svg",
                "width": 15,
                "height": 15,
                "alt": "*"
              },
              "DOWN"
            ],
            [
              {
                "src": "https://ohstem-public.s3.ap-southeast-1.amazonaws.com/extensions/AITT-VN/yolobit_extension_makerbit/images/turn_left.svg",
                "width": 15,
                "height": 15,
                "alt": "*"
              },
              "LEFT"
            ],
            [
              {
                "src": "https://ohstem-public.s3.ap-southeast-1.amazonaws.com/extensions/AITT-VN/yolobit_extension_makerbit/images/turn_right.svg",
                "width": 15,
                "height": 15,
                "alt": "*"
              },
              "RIGHT"
            ],
            ["Setup", "SETUP"],
            ["0", "0"],
            ["1", "1"],
            ["2", "2"],
            ["3", "3"],
            ["4", "4"],
            ["5", "5"],
            ["6", "6"],
            ["7", "7"],
            ["8", "8"],
            ["9", "9"],
          ],
        },
      ],
      output: "Boolean",
      helpUrl: "",
    });
  },
  getDeveloperVars: function () {
    return ['ir_rx'];
  }
};

Blockly.Python["makerbit_ir_recv"] = function (block) {
  Blockly.Python.definitions_['import_makerbit'] = 'from makerbit import *';
  var remote = block.getFieldValue("remote");
  // TODO: Assemble Python into code variable.
  var code = 'ir_rx.get_code() == IR_REMOTE_' + remote;
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Blocks["makerbit_ir_clear"] = {
  init: function () {
    this.jsonInit({
      colour: ColorBlock,
      tooltip: "",
      message0: "%1 xóa tín hiệu đã thu được",
      args0: [
        {
          "type": "field_image",
          "src": "https://ohstem-public.s3.ap-southeast-1.amazonaws.com/extensions/AITT-VN/yolobit_extension_makerbit/images/remote.png",
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        }
      ],
      previousStatement: null,
      nextStatement: null,
      helpUrl: "",
    });
  },
  getDeveloperVars: function () {
    return ['ir_rx'];
  }
};

Blockly.Python["makerbit_ir_clear"] = function (block) {
  Blockly.Python.definitions_['import_makerbit'] = 'from makerbit import *';
  // TODO: Assemble Python into code variable.
  var code = 'ir_rx.clear_code()\n';
  return code;
};

Blockly.Blocks["makerbit_ir_on_receive"] = {
  init: function () {
    this.jsonInit({
      colour: ColorBlock,
      message0: "nếu %1 nhận được %2 %3 %4 từ remote",
      args0: [
        {
          "type": "field_image",
          "src": "https://ohstem-public.s3.ap-southeast-1.amazonaws.com/extensions/AITT-VN/yolobit_extension_makerbit/images/remote.png",
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        },
        {
          variable: "tín hiệu",
          type: "field_variable",
          name: "message",
        },
        {
          type: "input_dummy",
        },
        {
          type: "input_statement",
          name: "ACTION",
        },
      ],
      helpUrl: "",
    });
  },
  getDeveloperVars: function () {
    return ['ir_rx'];
  }
};

Blockly.Python['makerbit_ir_on_receive'] = function (block) {
  Blockly.Python.definitions_['import_makerbit'] = 'from makerbit import *';
  var variable_message = Blockly.Python.variableDB_.getName(block.getFieldValue('message'), Blockly.Variables.NAME_TYPE);
  var statements_action = Blockly.Python.statementToCode(block, 'ACTION');

  var globals = [];
  var varName;
  var workspace = block.workspace;
  var variables = workspace.getAllVariables() || [];
  for (var i = 0, variable; variable = variables[i]; i++) {
    varName = variable.name;
    if (variable_message != Blockly.Python.variableDB_.getName(varName, Blockly.Variables.NAME_TYPE))
      globals.push(Blockly.Python.variableDB_.getName(varName,
        Blockly.Variables.NAME_TYPE));
  }
  globals = globals.length ? Blockly.Python.INDENT + 'global ' + globals.join(', ') : '';

  var cbFunctionName = Blockly.Python.provideFunction_(
    'on_ir_receive_callback',
    ['def ' + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + '(' + variable_message + ', addr, ext):',
      globals,
    statements_action || Blockly.Python.PASS
    ]);

  var code = 'ir_rx.on_received(' + cbFunctionName + ')\n';
  Blockly.Python.definitions_['on_ir_receive_callback' + '_statement'] = code;

  return '';
};

Blockly.Blocks["makerbit_ir_remote_btn"] = {
  init: function () {
    this.jsonInit({
      colour: ColorBlock,
      tooltip: "",
      message0: "nút %1",
      args0: [
        {
          type: "field_dropdown",
          name: "remote",
          options: [
            ["A", "A"],
            ["B", "B"],
            ["C", "C"],
            ["D", "D"],
            ["E", "E"],
            ["F", "F"],
            [
              {
                "src": "https://ohstem-public.s3.ap-southeast-1.amazonaws.com/extensions/AITT-VN/yolobit_extension_makerbit/images/forward.svg",
                "width": 15,
                "height": 15,
                "alt": "*"
              },
              "UP"
            ],
            [
              {
                "src": "https://ohstem-public.s3.ap-southeast-1.amazonaws.com/extensions/AITT-VN/yolobit_extension_makerbit/images/backward.svg",
                "width": 15,
                "height": 15,
                "alt": "*"
              },
              "DOWN"
            ],
            [
              {
                "src": "https://ohstem-public.s3.ap-southeast-1.amazonaws.com/extensions/AITT-VN/yolobit_extension_makerbit/images/turn_left.svg",
                "width": 15,
                "height": 15,
                "alt": "*"
              },
              "LEFT"
            ],
            [
              {
                "src": "https://ohstem-public.s3.ap-southeast-1.amazonaws.com/extensions/AITT-VN/yolobit_extension_makerbit/images/turn_right.svg",
                "width": 15,
                "height": 15,
                "alt": "*"
              },
              "RIGHT"
            ],
            ["Setup", "SETUP"],
            ["0", "0"],
            ["1", "1"],
            ["2", "2"],
            ["3", "3"],
            ["4", "4"],
            ["5", "5"],
            ["6", "6"],
            ["7", "7"],
            ["8", "8"],
            ["9", "9"],
          ],
        },
      ],
      output: "Boolean",
      helpUrl: "",
    });
  }
};

Blockly.Python["makerbit_ir_remote_btn"] = function (block) {
  Blockly.Python.definitions_['import_makerbit'] = 'from makerbit import *';
  var remote = block.getFieldValue("remote");
  // TODO: Assemble Python into code variable.
  var code = 'IR_REMOTE_' + remote;
  return [code, Blockly.Python.ORDER_NONE];
};

// Line Finder

Blockly.Blocks['makerbit_linesensor_read'] = {
  init: function() {
    this.jsonInit(
      {
        "type": "bot_input_linesensor_read",
        "message0": "%1 cảm biến dò vạch đen chân S1 %2 chân S2 %3 phát hiện %4",
        "args0": [
          {
            "type": "field_image",
            "src": "https://ohstem-public.s3.ap-southeast-1.amazonaws.com/extensions/AITT-VN/yolobit_extension_makerbit/images/line_finder.svg",
            "width": 15,
            "height": 15,
            "alt": "*",
            "flipRtl": false
          },
          {
            "type": "field_dropdown",
            "name": "S1",
            "options": [
              [
                "P0",
                "pin0"
              ],
              [
                "P1",
                "pin1"
              ],
              [
                "P2",
                "pin2"
              ],
              [
                "P3",
                "pin3"
              ],
              [
                "P4",
                "pin4"
              ],
              [
                "P5",
                "pin5"
              ],
              [
                "P6",
                "pin6"
              ],
              [
                "P7",
                "pin7"
              ],
              [
                "P8",
                "pin8"
              ],
              [
                "P9",
                "pin9"
              ],
              [
                "P10",
                "pin10"
              ],
              [
                "P11",
                "pin11"
              ],
              [
                "P12",
                "pin12"
              ],
              [
                "P13",
                "pin13"
              ],
              [
                "P14",
                "pin14"
              ],
              [
                "P15",
                "pin15"
              ],
              [
                "P16",
                "pin16"
              ],
              [
                "P19",
                "pin19"
              ],
              [
                "P20",
                "pin20"
              ]
            ]
          },
          {
            "type": "field_dropdown",
            "name": "S2",
            "options": [
              [
                "P0",
                "pin0"
              ],
              [
                "P1",
                "pin1"
              ],
              [
                "P2",
                "pin2"
              ],
              [
                "P3",
                "pin3"
              ],
              [
                "P4",
                "pin4"
              ],
              [
                "P5",
                "pin5"
              ],
              [
                "P6",
                "pin6"
              ],
              [
                "P7",
                "pin7"
              ],
              [
                "P8",
                "pin8"
              ],
              [
                "P9",
                "pin9"
              ],
              [
                "P10",
                "pin10"
              ],
              [
                "P11",
                "pin11"
              ],
              [
                "P12",
                "pin12"
              ],
              [
                "P13",
                "pin13"
              ],
              [
                "P14",
                "pin14"
              ],
              [
                "P15",
                "pin15"
              ],
              [
                "P16",
                "pin16"
              ],
              [
                "P19",
                "pin19"
              ],
              [
                "P20",
                "pin20"
              ]
            ]
          },
          {
            "type": "field_dropdown",
            "name": "status",
            "options": [
              [
                {
                  "src": "https://ohstem-public.s3.ap-southeast-1.amazonaws.com/extensions/AITT-VN/yolobit_extension_makerbit/images/line_finder_left.png",
                  "width": 15,
                  "height": 15,
                  "alt": "trái"
                },
                "0"
              ],
              [
                {
                  "src": "https://ohstem-public.s3.ap-southeast-1.amazonaws.com/extensions/AITT-VN/yolobit_extension_makerbit/images/line_finder_right.png",
                  "width": 15,
                  "height": 15,
                  "alt": "phải"
                },
                "1"
              ],
              [
                {
                  "src": "https://ohstem-public.s3.ap-southeast-1.amazonaws.com/extensions/AITT-VN/yolobit_extension_makerbit/images/line_finder_none.png",
                  "width": 15,
                  "height": 15,
                  "alt": "không bên nào"
                },
                "2"
              ],
              [
                {
                  "src": "https://ohstem-public.s3.ap-southeast-1.amazonaws.com/extensions/AITT-VN/yolobit_extension_makerbit/images/line_finder_both.png",
                  "width": 15,
                  "height": 15,
                  "alt": "cả 2 bên"
                },
                "3"
              ]
            ]
          }
        ],
        "colour": ColorBlock,
        "output": "Boolean",
        "tooltip": "",
        "helpUrl": ""
      }
    );
  }
};

Blockly.Python["makerbit_linesensor_read"] = function (block) {
  var SIG1 = block.getFieldValue('S1');
  var SIG2 = block.getFieldValue('S2');
  var status = block.getFieldValue("status");
  Blockly.Python.definitions_['import_yolobit'] = 'from yolobit import *';
  Blockly.Python.definitions_['import_linefinder'] = 'from makerbit_linefinder import *';
  Blockly.Python.definitions_["import_create_linefinder"] = 'line_finder = LineFinder(sig_1=' + SIG1 + '.pin, sig_2=' + SIG2 + '.pin)';
  // TODO: Assemble Python into code variable.
  var code = "line_finder.read() == " + status;
  return [code, Blockly.Python.ORDER_NONE];
};

// MPU6050

Blockly.Blocks["makerbit_input_mpu_get_accel"] = {
  init: function () {
    this.jsonInit({
      colour: ColorBlock,
      tooltip: "",
      message0: "%2 đọc cảm biến gia tốc %1",
      args0: [
        {
          type: "field_dropdown",
          name: "accel",
          options: [
            ["x", "x"],
            ["y", "y"],
            ["z", "z"],
          ],
        },
        {
          "type": "field_image",
          "src": "https://ohstem-public.s3.ap-southeast-1.amazonaws.com/extensions/AITT-VN/yolobit_extension_makerbit/images/xyz-axis.png",
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        }
      ],
      output: "Number",
      helpUrl: ""
    });
  },
};

Blockly.Python["makerbit_input_mpu_get_accel"] = function (block) {
  var accel = block.getFieldValue("accel");
  Blockly.Python.definitions_['import_linefinder'] = 'from makerbit_motion import motion';
  // TODO: Assemble Python into code variable.
  var code = "motion.get_accel('" + accel + "')";
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Blocks["makerbit_input_mpu_get_gyro"] = {
  init: function () {
    this.jsonInit({
      colour: ColorBlock,
      tooltip: "",
      message0: "%2 đọc cảm biến gyroscope %1",
      args0: [
        {
          type: "field_dropdown",
          name: "gyro",
          options: [
            ["roll", "roll"],
            ["pitch", "pitch"],
            ["yaw", "yaw"],
          ]
        },
        {
          "type": "field_image",
          "src": "https://ohstem-public.s3.ap-southeast-1.amazonaws.com/extensions/AITT-VN/yolobit_extension_makerbit/images/xyz-axis.png",
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        }
      ],
      output: "Number",
      helpUrl: ""
    });
  },
};

Blockly.Python["makerbit_input_mpu_get_gyro"] = function (block) {
  var gyro = block.getFieldValue("gyro");
  Blockly.Python.definitions_['import_linefinder'] = 'from makerbit_motion import motion';
  // TODO: Assemble Python into code variable.
  var code = "motion.get_gyro_"+ gyro +"()";
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Blocks["makerbit_input_mpu_is_shake"] = {
  init: function () {
    this.jsonInit({
      colour: ColorBlock,
      tooltip: "",
      message0: "%1 Makerbit Hub bị lắc",
      args0: [
        {
          "type": "field_image",
          "src": "https://ohstem-public.s3.ap-southeast-1.amazonaws.com/extensions/AITT-VN/yolobit_extension_makerbit/images/xyz-axis.png",
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        }
      ],
      output: "Boolean",
      helpUrl: ""
    });
  },
};

Blockly.Python["makerbit_input_mpu_is_shake"] = function (block) {
  var gyro = block.getFieldValue("gyro");
  Blockly.Python.definitions_['import_linefinder'] = 'from makerbit_motion import motion';
  // TODO: Assemble Python into code variable.
  var code = "motion.is_shaked()";
  return [code, Blockly.Python.ORDER_NONE];
};