Blockly.JavaScript['drone_takeoff'] = function(block) {
    return 'await drone.takeoff();\n';
};

Blockly.JavaScript['drone_land'] = function(block) {
    return 'await drone.land();\n';
};

Blockly.JavaScript['drone_forward'] = function(block) {
    const distance = Blockly.JavaScript.valueToCode(block, 'DISTANCE', Blockly.JavaScript.ORDER_ATOMIC) || 0;
    return `await drone.moveForward(${distance});\n`;
};

Blockly.JavaScript['drone_backward'] = function(block) {
    const distance = Blockly.JavaScript.valueToCode(block, 'DISTANCE', Blockly.JavaScript.ORDER_ATOMIC) || 0;
    return `await drone.moveBackward(${distance});\n`;
};

Blockly.JavaScript['drone_left'] = function(block) {
    const distance = Blockly.JavaScript.valueToCode(block, 'DISTANCE', Blockly.JavaScript.ORDER_ATOMIC) || 0;
    return `await drone.moveLeft(${distance});\n`;
};

Blockly.JavaScript['drone_right'] = function(block) {
    const distance = Blockly.JavaScript.valueToCode(block, 'DISTANCE', Blockly.JavaScript.ORDER_ATOMIC) || 0;
    return `await drone.moveRight(${distance});\n`;
};

Blockly.JavaScript['drone_up'] = function(block) {
    const distance = Blockly.JavaScript.valueToCode(block, 'DISTANCE', Blockly.JavaScript.ORDER_ATOMIC) || 0;
    return `await drone.moveUp(${distance});\n`;
};

Blockly.JavaScript['drone_down'] = function(block) {
    const distance = Blockly.JavaScript.valueToCode(block, 'DISTANCE', Blockly.JavaScript.ORDER_ATOMIC) || 0;
    return `await drone.moveDown(${distance});\n`;
};

Blockly.JavaScript['drone_delay'] = function(block) {
    const time = Blockly.JavaScript.valueToCode(block, 'TIME', Blockly.JavaScript.ORDER_ATOMIC) || 0;
    return `await new Promise(resolve => setTimeout(resolve, ${time}));\n`;
};
