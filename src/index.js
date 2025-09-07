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
            
        </category>
        <category name="Logic" colour="#ADD8E6">
            <block type="logic_boolean"></block>
        </category>
        <category name="Sensing" colour="#A64D79">
            <block type="drone_continue_until">
                <value name="CONDITION">
                    <block type="drone_obstacle_detected"></block>
                </value>
            </block>
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

// UPDATED: Corrected the colour and removed the second duplicate block
Blockly.Blocks['drone_continue_until'] = {
    init: function() {
        this.appendValueInput("CONDITION")
            .setCheck("Boolean")
            .appendField("fly until");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(20);
        this.setTooltip("Flies forward one step at a time until the condition is met.");
    }
};

// UPDATED: Corrected the colour and removed the second duplicate block
Blockly.Blocks['drone_obstacle_detected'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("obstacle detected");
        this.setOutput(true, "Boolean");
        this.setColour("#A64D79");
        this.setTooltip("Checks if there is an obstacle one square in front of the drone.");
        this.setHelpUrl("");
    }
};

Blockly.JavaScript['drone_obstacle_detected'] = function(block) {
    const code = 'await checkObstacleAhead()';
    return [code, Blockly.JavaScript.ORDER_FUNCTION_CALL];
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

// UPDATED: Keep this version for the "fly until" loop
Blockly.JavaScript['drone_continue_until'] = function(block) {
    const condition = Blockly.JavaScript.valueToCode(block, 'CONDITION', Blockly.JavaScript.ORDER_ATOMIC) || 'false';
    const code = `
        while (!(${condition})) {
            await droneApi.forward(1);
            await new Promise(r => setTimeout(r, 250)); // Delay for animation
        }
    `;
    return code;
};

Blockly.JavaScript['drone_turn_left'] = function(block) {
    const code = 'await drone.turnLeft();\n';
    return code;
};

Blockly.JavaScript['drone_turn_right'] = function(block) {
    const code = 'await drone.turnRight();\n';
    return code;
};

window.addEventListener('load', async () => {
    // Function to determine the current HTML file
    function getCurrentHTMLFile() {
        const path = window.location.pathname;
        const parts = path.split('/');
        const filename = parts[parts.length - 1] || 'index.html'; // Default to index.html if path ends in /
        return filename;
    }

    // Function to load a lesson script
    async function loadLesson(lessonName) {
        if (!lessonName) return;

        const lessonFile = `${lessonName}.js`;
        try {
            const script = document.createElement('script');
            script.src = lessonFile;
            script.type = 'text/javascript';
            document.head.appendChild(script);

            await new Promise((resolve, reject) => {
                script.onload = resolve;
                script.onerror = reject;
            });

            console.log(`Lesson ${lessonFile} loaded successfully.`);
        } catch (error) {
            console.error(`Failed to load lesson ${lessonFile}:`, error);
        }
    }

    // Determine and load the current lesson
    const currentHTMLFile = getCurrentHTMLFile();
    const lessonName = currentHTMLFile.replace('.html', '');
    if (lessonName !== 'index') {
        await loadLesson(lessonName);
    }
    
    // Main application logic
    const workspace = Blockly.inject('blocklyDiv', {
        toolbox: toolbox,
        scrollbars: false,
        trashcan: true,
    });

    //setTimeout(() => Blockly.svgResize(workspace), 100); // Add this line

    // --- NEW CODE: Add a listener to fix the grey area bug ---
    workspace.addChangeListener(function(event) {
        if (event.type === Blockly.Events.TOOLBOX_ITEM_SELECT || event.type === Blockly.Events.VIEWPORT_CHANGE) {
            // Use a short timeout to allow the DOM to update before resizing
            setTimeout(() => Blockly.svgResize(workspace), 50);
        }
    });

    // Drone state and simulation variables
    const canvas = document.getElementById('simulationCanvas');
    const runButton = document.getElementById('runButton');
    const resetButton = document.getElementById('resetButton');
    const ctx = canvas.getContext('2d');
    const gridSize = 25; // Units in pixels
    const tileCount = 12;

    // --- Default challenge parameters ---
    let droneState = { x: 6, y: 6, z: 0, isFlying: false, direction: 0 };
    let initialDroneState = { ...droneState }; // Store the initial state for resetting
    let target = null;
    let obstacles = [];
    let challengeDescription = "Experiment with the blocks and fly the drone!";

    // --- Override defaults if lesson parameters are defined ---
    // The loaded lesson.js file is expected to define these variables globally.
    if (typeof lessonDroneState !== 'undefined') {
        droneState = { ...lessonDroneState };
        initialDroneState = { ...lessonDroneState }; // Update initial state for the lesson
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
    // ... (code for the move function)
    const move = (distance) => {
        return new Promise(async resolve => {
            let steps = Math.abs(distance);
            while (steps > 0) {
                // Calculate the drone's NEXT position
                let nextX = droneState.x;
                let nextY = droneState.y;

                switch (droneState.direction) {
                    case 0: // Up
                        nextY--;
                        break;
                    case 1: // Right
                        nextX++;
                        break;
                    case 2: // Down
                        nextY++;
                        break;
                    case 3: // Left
                        nextX--;
                        break;
                }

                // If no obstacle, update the drone's position
                if (!droneApi.isObstacleDetected(nextX, nextY)) {
                    droneState.x = nextX;
                    droneState.y = nextY;
                }
                
                // Redraw the scene to show the new position
                drawGrid();
                drawDrone();
                
                // Wait for a short duration to animate the movement
                await new Promise(r => setTimeout(r, 250));
                
                steps--;
            }
            // Ensure the final state is drawn
            drawGrid();
            drawDrone();
            resolve();
        });
    };

    /**
     * Asynchronously checks if there is an obstacle in the drone's path.
     * @returns {Promise<boolean>} A promise that resolves to true if an obstacle is ahead, false otherwise.
     */
    async function checkObstacleAhead() {
        // Determine the next position based on the current direction
        let nextX = droneState.x;
        let nextY = droneState.y;
        let obstacleDetected = false;

        // Use a small delay to allow the UI to update and not freeze
        await new Promise(resolve => setTimeout(resolve, 10));

        switch (droneState.direction) {
            case 0: // Up (North)
                nextY--;
                break;
            case 1: // Right (East)
                nextX++;
                break;
            case 2: // Down (South)
                nextY++;
                break;
            case 3: // Left (West)
                nextX--;
                break;
        }

        // Check if the next position is an obstacle
        if (obstacles.some(obstacle => obstacle.x === nextX && obstacle.y === nextY)) {
            obstacleDetected = true;
            console.log('Obstacle detected at:', nextX, nextY);
        } else {
            console.log('No obstacle detected at:', nextX, nextY);
        }

        return obstacleDetected;
    }

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
        // UPDATED: Added a forward function for the loop to call
        forward: async (distance) => {
            if (!droneState.isFlying) { console.error('Drone must be flying to move.'); return; }
            await move(distance);
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
        isObstacleDetected: (x, y) => {
            // Check if the given coordinates (x, y) match any obstacle
            return obstacles.some(obstacle => obstacle.x === x && obstacle.y === y);
        }
    };

    // Expose the drone API to the generated code
    const drone = droneApi;

    // Handle "Run" button click
    runButton.addEventListener('click', async () => {
        runButton.disabled = true;
        resetButton.disabled = true;

        const code = Blockly.JavaScript.workspaceToCode(workspace);
        try {
            const asyncCode = `(async () => { ${code} })();`;
            await eval(asyncCode);
            console.log('Code execution finished.');

            // --- Generic win condition check ---
            // Check if a lesson-specific win condition function exists and run it.
            if (typeof checkLessonWinCondition === 'function') {
                if (checkLessonWinCondition(droneState, target, obstacles)) {
                    alert('Congratulations! You completed the challenge! 🥳');
                } else {
                    alert('Not quite! Check your code and try again. 🤔');
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
        // Reset drone state to the initial state for the current lesson or default
        droneState = { ...initialDroneState };
        drawGrid();
        drawDrone();
        console.log('Drone position reset.');
    });

    // Initial draw
    drawGrid();
    drawDrone();

    // Resize handler
    // --- UPDATED CODE: Add Blockly.svgResize here too ---
    window.addEventListener('resize', () => {
        drawGrid();
        drawDrone();
        // Tell Blockly to resize as well when the window changes size
        Blockly.svgResize(workspace);
    });

    // Set challenge description
    const challengeDescriptionElement = document.getElementById('challengeDescription');
    if (challengeDescriptionElement) {
        challengeDescriptionElement.textContent = challengeDescription;
    }
});