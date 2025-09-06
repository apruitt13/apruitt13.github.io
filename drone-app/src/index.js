document.addEventListener('DOMContentLoaded', () => {
    // Define the toolbox XML
    const toolbox = `
        <xml>
            <category name="Movement" colour="#4C97FF">
                <block type="drone_takeoff"></block>
                <block type="drone_land"></block>
                <block type="drone_forward">
                    <value name="DISTANCE">
                        <shadow type="math_number">
                            <field name="NUM">1</field>
                        </shadow>
                    </value>
                </block>
                <block type="drone_backward">
                    <value name="DISTANCE">
                        <shadow type="math_number">
                            <field name="NUM">1</field>
                        </shadow>
                    </value>
                </block>
                <block type="drone_left">
                    <value name="DISTANCE">
                        <shadow type="math_number">
                            <field name="NUM">1</field>
                        </shadow>
                    </value>
                </block>
                <block type="drone_right">
                    <value name="DISTANCE">
                        <shadow type="math_number">
                            <field name="NUM">1</field>
                        </shadow>
                    </value>
                </block>
            </category>
            <category name="Loops" colour="#FFD700">
                <block type="controls_repeat_ext">
                    <value name="TIMES">
                        <shadow type="math_number">
                            <field name="NUM">3</field>
                        </shadow>
                    </value>
                </block>
            </category>
        </xml>
    `;

    // Define custom blocks
    Blockly.Blocks['drone_takeoff'] = {
        init: function() {
            this.appendDummyInput().appendField("take off");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip("Commands the drone to take off");
        }
    };

    Blockly.Blocks['drone_land'] = {
        init: function() {
            this.appendDummyInput().appendField("land");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip("Commands the drone to land");
        }
    };

    Blockly.Blocks['drone_forward'] = {
        init: function() {
            this.appendValueInput("DISTANCE").setCheck("Number").appendField("fly forward");
            this.appendDummyInput().appendField("units");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("Flies the drone forward by a specified number of units");
        }
    };
    
    Blockly.Blocks['drone_backward'] = {
        init: function() {
            this.appendValueInput("DISTANCE").setCheck("Number").appendField("fly backward");
            this.appendDummyInput().appendField("units");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("Flies the drone backward by a specified number of units");
        }
    };
    
    Blockly.Blocks['drone_left'] = {
        init: function() {
            this.appendValueInput("DISTANCE").setCheck("Number").appendField("fly left");
            this.appendDummyInput().appendField("units");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("Flies the drone left by a specified number of units");
        }
    };
    
    Blockly.Blocks['drone_right'] = {
        init: function() {
            this.appendValueInput("DISTANCE").setCheck("Number").appendField("fly right");
            this.appendDummyInput().appendField("units");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(160);
            this.setTooltip("Flies the drone right by a specified number of units");
        }
    };
    
    // Define JavaScript generators
    Blockly.JavaScript['drone_takeoff'] = function(block) {
        return 'await drone.takeoff();\n';
    };

    Blockly.JavaScript['drone_land'] = function(block) {
        return 'await drone.land();\n';
    };

    Blockly.JavaScript['drone_forward'] = function(block) {
        const distance = Blockly.JavaScript.valueToCode(block, 'DISTANCE', Blockly.JavaScript.ORDER_ATOMIC) || '0';
        return `await drone.moveForward(${distance});\n`;
    };
    
    Blockly.JavaScript['drone_backward'] = function(block) {
        const distance = Blockly.JavaScript.valueToCode(block, 'DISTANCE', Blockly.JavaScript.ORDER_ATOMIC) || '0';
        return `await drone.moveBackward(${distance});\n`;
    };
    
    Blockly.JavaScript['drone_left'] = function(block) {
        const distance = Blockly.JavaScript.valueToCode(block, 'DISTANCE', Blockly.JavaScript.ORDER_ATOMIC) || '0';
        return `await drone.moveLeft(${distance});\n`;
    };
    
    Blockly.JavaScript['drone_right'] = function(block) {
        const distance = Blockly.JavaScript.valueToCode(block, 'DISTANCE', Blockly.JavaScript.ORDER_ATOMIC) || '0';
        return `await drone.moveRight(${distance});\n`;
    };
    
    Blockly.JavaScript['controls_repeat_ext'] = function(block) {
        const repeats = Blockly.JavaScript.valueToCode(block, 'TIMES', Blockly.JavaScript.ORDER_ATOMIC) || '0';
        const branch = Blockly.JavaScript.statementToCode(block, 'DO');
        let code = `for (let i = 0; i < ${repeats}; i++) {\n${branch}}\n`;
        return code;
    };

    // Main application logic
    const workspace = Blockly.inject('blocklyDiv', {
        toolbox: toolbox,
        scrollbars: true,
        trashcan: true,
    });

    // Drone state and simulation variables
    const canvas = document.getElementById('simulationCanvas');
    const runButton = document.getElementById('runButton');
    const resetButton = document.getElementById('resetButton');
    const ctx = canvas.getContext('2d');
    const gridSize = 25; // Units in pixels
    const tileCount = 12;

    let droneState = {
        x: tileCount / 2,
        y: tileCount / 2,
        z: 0,
        isFlying: false
    };

    // Function to draw the grid and the drone
    const drawGrid = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#e0e0e0';
        for (let i = 0; i <= tileCount; i++) {
            // Vertical lines
            ctx.beginPath();
            ctx.moveTo(i * (canvas.width / tileCount), 0);
            ctx.lineTo(i * (canvas.width / tileCount), canvas.height);
            ctx.stroke();

            // Horizontal lines
            ctx.beginPath();
            ctx.moveTo(0, i * (canvas.height / tileCount));
            ctx.lineTo(canvas.width, i * (canvas.height / tileCount));
            ctx.stroke();
        }
    };
    
    // Updated function to draw a triangle drone shape
    const drawDrone = () => {
        const realX = droneState.x * (canvas.width / tileCount) + (canvas.width / (2 * tileCount));
        const realY = droneState.y * (canvas.height / tileCount) + (canvas.height / (2 * tileCount));
        const droneColor = droneState.isFlying ? '#4CAF50' : '#FF5722';

        ctx.save();
        ctx.translate(realX, realY);
        
        const droneSize = 20;

        ctx.beginPath();
        // Point of the triangle
        ctx.moveTo(0, -droneSize / 2);
        // Bottom-right point
        ctx.lineTo(droneSize / 2, droneSize / 2);
        // Bottom-left point
        ctx.lineTo(-droneSize / 2, droneSize / 2);
        ctx.closePath();
        
        ctx.fillStyle = droneColor;
        ctx.fill();

        ctx.restore();
    };

    // Drone movement functions
    const move = (dx, dy) => {
        return new Promise(resolve => {
            let currentStep = 0;
            const totalSteps = 10;
            const stepX = (dx * (canvas.width / tileCount)) / totalSteps;
            const stepY = (dy * (canvas.height / tileCount)) / totalSteps;

            const animateMove = () => {
                if (currentStep < totalSteps) {
                    droneState.x += dx / totalSteps;
                    droneState.y += dy / totalSteps;
                    drawGrid();
                    drawDrone();
                    currentStep++;
                    requestAnimationFrame(animateMove);
                } else {
                    droneState.x = Math.round(droneState.x);
                    droneState.y = Math.round(droneState.y);
                    drawGrid();
                    drawDrone();
                    resolve();
                }
            };
            requestAnimationFrame(animateMove);
        });
    };

    const droneApi = {
        takeoff: async () => {
            droneState.isFlying = true;
            drawDrone();
            await new Promise(r => setTimeout(r, 500));
            console.log('Drone is now flying.');
        },
        land: async () => {
            droneState.isFlying = false;
            drawDrone();
            await new Promise(r => setTimeout(r, 500));
            console.log('Drone has landed.');
        },
        moveForward: async (distance) => {
            if (!droneState.isFlying) { console.error('Drone must be flying to move.'); return; }
            await move(0, -distance);
        },
        moveBackward: async (distance) => {
            if (!droneState.isFlying) { console.error('Drone must be flying to move.'); return; }
            await move(0, distance);
        },
        moveLeft: async (distance) => {
            if (!droneState.isFlying) { console.error('Drone must be flying to move.'); return; }
            await move(-distance, 0);
        },
        moveRight: async (distance) => {
            if (!droneState.isFlying) { console.error('Drone must be flying to move.'); return; }
            await move(distance, 0);
        },
        moveUp: async () => {
            if (!droneState.isFlying) { console.error('Drone must be flying to move.'); return; }
            droneState.z += 1;
            console.log(`Drone altitude: ${droneState.z}`);
        },
        moveDown: async () => {
            if (!droneState.isFlying) { console.error('Drone must be flying to move.'); return; }
            droneState.z -= 1;
            console.log(`Drone altitude: ${droneState.z}`);
        }
    };
    
    // Handle "Run" button click
    runButton.addEventListener('click', async () => {
        runButton.disabled = true;
        resetButton.disabled = true;
        
        const code = Blockly.JavaScript.workspaceToCode(workspace);
        try {
            const asyncCode = `(async () => { ${code} })();`;
            await eval(asyncCode);
            console.log('Code execution finished.');
        } catch (error) {
            console.error('Error during code execution:', error);
        } finally {
            runButton.disabled = false;
            resetButton.disabled = false;
        }
    });

    // Handle "Reset" button click
    resetButton.addEventListener('click', () => {
        droneState.x = tileCount / 2;
        droneState.y = tileCount / 2;
        droneState.isFlying = false;
        drawGrid();
        drawDrone();
        console.log('Drone position reset.');
    });

    // Expose the drone API to the generated code
    const drone = droneApi;
    
    // Initial draw
    drawGrid();
    drawDrone();
    
    // Resize handler
    window.addEventListener('resize', () => {
        drawGrid();
        drawDrone();
    });
});
