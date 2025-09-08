Blockly.Blocks['drone_takeoff'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("take off");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("Commands the drone to take off");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['drone_land'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("land");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("Commands the drone to land");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['drone_forward'] = function(block) {
  const distance = block.getFieldValue('DISTANCE');
  const code = `moveForward(${distance});\nonDroneMove();\n`; // Call the new generic hook
  return code;
};

Blockly.JavaScript['drone_backward'] = function(block) {
  const distance = block.getFieldValue('DISTANCE');
  const code = `moveBackward(${distance});\nonDroneMove();\n`; // Call the new generic hook
  return code;
};

Blockly.Blocks['drone_left'] = {
    init: function() {
        this.appendValueInput("DISTANCE")
            .setCheck("Number")
            .appendField("fly left");
        this.appendDummyInput()
            .appendField("units");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
        this.setTooltip("Flies the drone left by a specified number of units");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['drone_right'] = {
    init: function() {
        this.appendValueInput("DISTANCE")
            .setCheck("Number")
            .appendField("fly right");
        this.appendDummyInput()
            .appendField("units");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
        this.setTooltip("Flies the drone right by a specified number of units");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['drone_up'] = {
    init: function() {
        this.appendValueInput("DISTANCE")
            .setCheck("Number")
            .appendField("fly up");
        this.appendDummyInput()
            .appendField("units");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
        this.setTooltip("Flies the drone up by a specified number of units");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['drone_down'] = {
    init: function() {
        this.appendValueInput("DISTANCE")
            .setCheck("Number")
            .appendField("fly down");
        this.appendDummyInput()
            .appendField("units");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
        this.setTooltip("Flies the drone down by a specified number of units");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['drone_delay'] = {
    init: function() {
        this.appendValueInput("TIME")
            .setCheck("Number")
            .appendField("wait for");
        this.appendDummyInput()
            .appendField("milliseconds");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(290);
        this.setTooltip("Pauses the drone for a specified amount of time");
        this.setHelpUrl("");
    }
};
