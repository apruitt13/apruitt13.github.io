// Define the toolbox XML (outside the event listener)
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
            <block type="drone_turn_left"></block>
            <block type="drone_turn_right"></block>
        </category>
        <category name="Loops" colour="#FFD700">
            <block type="controls_repeat_ext">
                <value name="TIMES">
                    <shadow type="math_number">
                        <field name="NUM">3</field>
                    </shadow>
                </value>
            </block>
            <block type="drone_continue_until"></block>
        </category>
        <category name="Logic" colour="#ADD8E6">
            <block type="logic_boolean"></block>
        </category>
        <category name="Sensing" colour="#A64D79">
            <block type="drone_obstacle_detected"></block>
        </category>
    </xml>
`;

// Define custom blocks (outside the event listener)
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

Blockly.Blocks['drone_continue_until'] = {
    init: function() {
        this.appendValueInput("CONDITION")
            .setCheck("Boolean")
            .appendField("continue until");
        this.appendStatementInput("DO")
            .setCheck(null)
            .appendField("do");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(120);
        this.setTooltip("Continues executing the code block until the condition is true.");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['drone_obstacle_detected'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("obstacle detected");
        this.setOutput(true, "Boolean");
        this.setColour(210);
        this.setTooltip("Returns true if an obstacle is detected in front of the drone.");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['drone_turn_left'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("turn left");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("Turns the drone left.");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['drone_turn_right'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("turn right");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("Turns the drone right.");
        this.setHelpUrl("");
    }
};

// Define JavaScript generators (outside the event listener)
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

Blockly.JavaScript['controls_repeat_ext'] = function(block) {
    const repeats = Blockly.JavaScript.valueToCode(block, 'TIMES', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    const branch = Blockly.JavaScript.statementToCode(block, 'DO');
    let code = `for (let i = 0; i < ${repeats}; i++) {\n${branch}}\n`;
    return code;
};

Blockly.JavaScript['drone_continue_until'] = function(block) {
    const condition = Blockly.JavaScript.valueToCode(block, 'CONDITION', Blockly.JavaScript.ORDER_NONE) || 'false';
    const branch = Blockly.JavaScript.statementToCode(block, 'DO');
    const code = `while (!(${condition})) {\n${branch}}\n`;
    return code;
};

Blockly.JavaScript['drone_obstacle_detected'] = function(block) {
    //  This is a placeholder.  You'll need to implement the actual obstacle detection logic.
    const code = 'drone.isObstacleDetected()';
    return [code, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['drone_turn_left'] = function(block) {
    const code = 'await drone.turnLeft();\n';
    return code;
};

Blockly.JavaScript['drone_turn_right'] = function(block) {
    const code = 'await drone.turnRight();\n';
    return code;
};

document.addEventListener('DOMContentLoaded', async () => {
    // Function to determine the current HTML file
    function getCurrentHTMLFile() {
        const path = window.location.pathname;
        const parts = path.split('/');
        const filename = parts[parts.length - 1];
        return filename;
    }

    const currentHTMLFile = getCurrentHTMLFile();
    console.log("Current HTML file:", currentHTMLFile);

    // Main application logic
    const workspace = Blockly.inject('blocklyDiv', {
        toolbox: toolbox,
        scrollbars: true,
        trashcan: true,
    });

    // Load lesson script based on the current HTML file
    async function loadLesson() {
        let lessonFile = null;
        if (currentHTMLFile === 'agriculture.html') {
            lessonFile = 'agriculture.js';
        }

        if (lessonFile) {
            try {
                const script = document.createElement('script');
                script.src = lessonFile;
                script.type = 'text/javascript';
                script.async = false; // Ensure the script is executed immediately after loading
                document.head.appendChild(script);

                // Wait for the script to load and execute
                await new Promise((resolve, reject) => {
                    script.onload = resolve;
                    script.onerror = reject;
                });

                console.log(`Lesson ${lessonFile} loaded successfully.`);
            } catch (error) {
                console.error(`Failed to load lesson ${lessonFile}:`, error);
            }
        }
    }

    await loadLesson();

    // Drone state and simulation variables
    const canvas = document.getElementById('simulationCanvas');
    const runButton = document.getElementById('runButton');
    const resetButton = document.getElementById('resetButton');
    const ctx = canvas.getContext('2d');
    const gridSize = 25; // Units in pixels
    const tileCount = 12;

    // Default challenge parameters
    let droneState = { x: 6, y: 6, z: 0, isFlying: false, direction: 0 }; // Default for index.html
    let target = null;
    let obstacles = [];
    let challengeDescription = "Experiment with the blocks and fly the drone!";

    // Override defaults if lesson parameters are defined
    if (typeof lessonDroneState !== 'undefined') {
        droneState.x = lessonDroneState.x;
        droneState.y = lessonDroneState.y;
        droneState.z = lessonDroneState.z;
        droneState.isFlying = lessonDroneState.isFlying;
        droneState.direction = lessonDroneState.direction;
    }
    if (typeof lessonTarget !== 'undefined') {
        target = lessonTarget;
    }
    if (typeof lessonObstacles !== 'undefined') {
        obstacles = lessonObstacles;
    }
    if (typeof lessonChallengeDescription !== 'undefined') {
        challengeDescription = lessonChallengeDescription;
    }

    // Function to draw the grid and the drone
    const drawGrid = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#e0e0e0';

        // Draw grid lines
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

        // Draw obstacles (if any)
        if (obstacles) {
            obstacles.forEach(obstacle => {
                const obstacleX = obstacle.x * (canvas.width / tileCount);
                const obstacleY = obstacle.y * (canvas.height / tileCount);
                const obstacleSize = canvas.width / tileCount;

                ctx.fillStyle = '#8B4513'; // Brown color for obstacles
                ctx.fillRect(obstacleX, obstacleY, obstacleSize, obstacleSize);
            });
        }

        // Draw target (if any)
        if (target) {
            const targetX = target.x * (canvas.width / tileCount);
            const targetY = target.y * (canvas.height / tileCount);
            const targetSize = canvas.width / tileCount;

            ctx.fillStyle = '#00FF00'; // Green color for target
            ctx.fillRect(targetX, targetY, targetSize, targetSize);
        }
    };

    // Updated function to draw a triangle drone shape
    const drawDrone = () => {
        const realX = droneState.x * (canvas.width / tileCount) + (canvas.width / (2 * tileCount));
        const realY = droneState.y * (canvas.height / tileCount) + (canvas.height / (2 * tileCount));
        const droneColor = droneState.isFlying ? '#4CAF50' : '#FF5722';

        ctx.save();
        ctx.translate(realX, realY);
        ctx.rotate(droneState.direction * Math.PI / 2); // Rotate based on direction

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
    const move = (distance) => {
        let dx = 0;
        let dy = 0;

        switch (droneState.direction) {
            case 0: // Up
                dy = -distance;
                break;
            case 1: // Right
                dx = distance;
                break;
            case 2: // Down
                dy = distance;
                break;
            case 3: // Left
                dx = -distance;
                break;
        }
        return new Promise(resolve => {
            let currentStep = 0;
            const totalSteps = 100; // Increase this value to slow down the movement
            const stepX = (dx) / totalSteps;
            const stepY = (dy) / totalSteps;

            const animateMove = () => {
                if (currentStep < totalSteps) {
                    droneState.x += stepX;
                    droneState.y += stepY;

                    // Constrain drone position within grid boundaries
                    if (droneState.x < 0) droneState.x = 0;
                    if (droneState.x >= tileCount) droneState.x = tileCount - 1;
                    if (droneState.y < 0) droneState.y = 0;
                    if (droneState.y >= tileCount) droneState.y = tileCount - 1;

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
            await move(distance);
        },
        moveBackward: async (distance) => {
            if (!droneState.isFlying) { console.error('Drone must be flying to move.'); return; }
            await move(-distance);
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
        },
        turnLeft: async () => {
            droneState.direction = (droneState.direction + 3) % 4; // Rotate left (counter-clockwise)
            console.log('Drone turning left. New direction:', droneState.direction);
            drawGrid();
            drawDrone();
        },

        turnRight: async () => {
            droneState.direction = (droneState.direction + 1) % 4; // Rotate right (clockwise)
            console.log('Drone turning right. New direction:', droneState.direction);
            drawGrid();
            drawDrone();
        },
        isObstacleDetected: () => {
            const nextX = droneState.x;
            const nextY = droneState.y - 1; // Assuming forward is up

            // Check if the next position is within the grid bounds
            if (nextX < 0 || nextX >= tileCount || nextY < 0 || nextY >= tileCount) {
                return true; // Treat grid boundaries as obstacles
            }

            // Check if there is an obstacle at the next position
            return obstacles.some(obstacle => obstacle.x === nextX && obstacle.y === nextY);
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

            // Check win condition
            if (currentHTMLFile === 'agriculture.html') {
                let win = false;
                if (typeof checkLessonWinCondition === 'function') {
                    win = checkLessonWinCondition();
                }

                if (win) {
                    alert('Congratulations! You completed the challenge!');
                } else {
                    alert('Try again!');
                }
            }
        } catch (error) {
            console.error('Error during code execution:', error);
        } finally {
            runButton.disabled = false;
            resetButton.disabled = false;
        }
    });

    // Handle "Reset" button click
    resetButton.addEventListener('click', () => {
        // Reset drone state to initial values
        if (typeof lessonDroneState !== 'undefined') {
            droneState.x = lessonDroneState.x;
            droneState.y = lessonDroneState.y;
            droneState.direction = lessonDroneState.direction;
            droneState.isFlying = lessonDroneState.isFlying;
        } else {
            console.log("Resetting to default values");
            droneState.x = 6;
            droneState.y = 6;
            droneState.direction = 0;
            droneState.isFlying = false;
        }
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

    // Set challenge description
    const challengeDescriptionElement = document.getElementById('challengeDescription');
    if (challengeDescriptionElement) {
        challengeDescriptionElement.textContent = challengeDescription;
    }
});

// Function to determine the current HTML file
function getCurrentHTMLFile() {
    const path = window.location.pathname;
    const parts = path.split('/');
    const filename = parts[parts.length - 1];
    return filename;
}

// Load lesson script based on the current HTML file
async function loadLesson() {
    const currentHTMLFile = getCurrentHTMLFile();
    let lessonFile = null;
    if (currentHTMLFile === 'agriculture.html') {
        lessonFile = 'agriculture.js';
    }

    if (lessonFile) {
        try {
            const script = document.createElement('script');
            script.src = lessonFile;
            script.type = 'text/javascript';
            script.async = false; // Ensure the script is executed immediately after loading
            document.head.appendChild(script);

            // Wait for the script to load and execute
            await new Promise((resolve, reject) => {
                script.onload = resolve;
                script.onerror = reject;
            });

            console.log(`Lesson ${lessonFile} loaded successfully.`);
        } catch (error) {
            console.error(`Failed to load lesson ${lessonFile}:`, error);
        }
    }
}

// Default challenge parameters
let defaultDroneState = { x: 6, y: 6, z: 0, isFlying: false, direction: 0 }; // Default for index.html
droneState = typeof droneState !== 'undefined' ? droneState : defaultDroneState;

let defaultTarget = null;
target = typeof target !== 'undefined' ? target : defaultTarget;

let defaultObstacles = [];
obstacles = typeof obstacles !== 'undefined' ? obstacles : defaultObstacles;

challengeDescription = typeof challengeDescription !== 'undefined' ? challengeDescription : "Experiment with the blocks and fly the drone!";
