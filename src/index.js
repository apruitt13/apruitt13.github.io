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
            <block type="drone_increase_altitude">
                <value name="AMOUNT">
                    <shadow type="math_number">
                        <field name="NUM">1</field>
                    </shadow>
                </value>
            </block>
            <block type="drone_decrease_altitude">
                <value name="AMOUNT">
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

Blockly.Blocks['drone_increase_altitude'] = {
    init: function() {
        this.appendValueInput("AMOUNT").setCheck("Number").appendField("increase altitude by");
        this.appendDummyInput().appendField("feet");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
        this.setTooltip("Increases the drone's altitude by a specified amount");
    }
};

Blockly.Blocks['drone_decrease_altitude'] = {
    init: function() {
        this.appendValueInput("AMOUNT").setCheck("Number").appendField("decrease altitude by");
        this.appendDummyInput().appendField("feet");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
        this.setTooltip("Decreases the drone's altitude by a specified amount");
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

Blockly.JavaScript['drone_increase_altitude'] = function(block) {
    const amount = Blockly.JavaScript.valueToCode(block, 'AMOUNT', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    return `await drone.increaseAltitude(${amount});\n`;
};

Blockly.JavaScript['drone_decrease_altitude'] = function(block) {
    const amount = Blockly.JavaScript.valueToCode(block, 'AMOUNT', Blockly.JavaScript.ORDER_ATOMIC) || '0';
    return `await drone.decreaseAltitude(${amount});\n`;
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
    let surveys = [];
    let challengeDescription = "Experiment with the blocks and fly the drone!";

    // Lesson-provided images (optional runtime-loaded assets)
    const images = { background: null, obstacle: null, survey: null, target: null };

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
        // Normalize obstacles to include altitude (z) in the range (5, 300)
        obstacles = (lessonObstacles || []).map(o => {
            const oz = typeof o.z === 'number' ? Math.max(5, Math.min(300, o.z)) : 300; // default high if missing
            return { ...o, z: oz };
        });
    }

    if (typeof lessonSurveyPoints !== 'undefined') {
        surveys = lessonSurveyPoints;
    }

    if (typeof lessonChallengeDescription !== 'undefined') {
        challengeDescription = lessonChallengeDescription;
    }

    // Lesson-specific images (optional)
    function loadImage(src, key) {
        const img = new Image();
        img.src = src;
        img.onload = () => { try { drawGrid(); drawDrone(); } catch (e) {} };
        img.onerror = () => console.warn('Failed to load image for', key, 'from', src);
        images[key] = img;
    }
    if (typeof lessonImages !== 'undefined' && lessonImages) {
        ['background', 'obstacle', 'survey', 'target'].forEach(key => {
            if (lessonImages[key]) {
                loadImage(lessonImages[key], key);
            }
        });
    }

    // Function to draw the grid and the drone
    const drawGrid = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#e0e0e0';

        // Draw background (if any)
        if (images.background) {
            ctx.drawImage(images.background, 0, 0, canvas.width, canvas.height);
        }

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

                if (images.obstacle) {
                    ctx.drawImage(images.obstacle, obstacleX, obstacleY, obstacleSize, obstacleSize);
                } else {
                    ctx.fillStyle = '#000000ff'; // Black color for obstacles
                    ctx.fillRect(obstacleX, obstacleY, obstacleSize, obstacleSize);
                }

                // Draw obstacle height label (in feet) above or inside the tile
                const oz = (typeof obstacle.z === 'number') ? obstacle.z : 300;
                const label = `${Math.round(oz)} ft`;
                const labelX = obstacleX + obstacleSize / 2;
                let labelY = obstacleY + 10;

                ctx.font = '12px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';

                // If near the top edge, place inside the tile
                if (labelY < 12) labelY = obstacleY + Math.min(14, obstacleSize - 2);

                // Background rectangle for readability
                const metrics = ctx.measureText(label);
                const padding = 2;
                const bgWidth = metrics.width + padding * 2;
                const bgHeight = 14;
                ctx.fillStyle = 'rgba(255,255,255,0.85)';
                ctx.fillRect(labelX - bgWidth / 2, labelY - bgHeight, bgWidth, bgHeight);

                // Text
                ctx.fillStyle = '#111827';
                ctx.fillText(label, labelX, labelY - 2);
            });
        }

        // Draw surveys (if any)
        if (surveys) {
            surveys.forEach(survey => {
                const surveyX = survey.x * (canvas.width / tileCount);
                const surveyY = survey.y * (canvas.height / tileCount);
                const surveySize = canvas.width / tileCount;

                if (images.survey) {
                    ctx.drawImage(images.survey, surveyX, surveyY, surveySize, surveySize);
                } else {
                    ctx.fillStyle = '#fffb00ff'; // Yellow color for surveys
                    ctx.fillRect(surveyX, surveyY, surveySize, surveySize);
                }
            });
        }

        // Draw target (if any)
        if (target) {
            const targetX = target.x * (canvas.width / tileCount);
            const targetY = target.y * (canvas.height / tileCount);
            const targetSize = canvas.width / tileCount;

            if (images.target) {
                ctx.drawImage(images.target, targetX, targetY, targetSize, targetSize);
            } else {
                ctx.fillStyle = '#00FF00'; // Green color for target
                ctx.fillRect(targetX, targetY, targetSize, targetSize);
            }
        }
    };

    // Show a temporary message over the simulation grid
    function showGridMessage(message) {
        const container = document.getElementById('simulationContainer');
        if (!container) return;
        container.style.position = 'relative';
        let msg = document.getElementById('gridMessage');
        if (!msg) {
            msg = document.createElement('div');
            msg.id = 'gridMessage';
            msg.style.position = 'absolute';
            msg.style.top = '8px';
            msg.style.left = '50%';
            msg.style.transform = 'translateX(-50%)';
            msg.style.background = 'rgba(220,38,38,0.9)'; // red-ish
            msg.style.color = '#ffffff';
            msg.style.padding = '6px 10px';
            msg.style.borderRadius = '8px';
            msg.style.fontSize = '12px';
            msg.style.fontWeight = '600';
            msg.style.zIndex = '5';
            msg.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
            container.appendChild(msg);
        }
        msg.textContent = message;
        msg.style.display = 'block';
        clearTimeout(showGridMessage._t);
        showGridMessage._t = setTimeout(() => { msg.style.display = 'none'; }, 1500);
    }

    // Function to update the altitude display
    const updateAltitudeDisplay = () => {
        const altitudeElement = document.getElementById('altitudeDisplay');
        const flightStatusElement = document.getElementById('flightStatus');
        
        if (altitudeElement) {
            altitudeElement.textContent = `${droneState.z} feet`;
        }
        
        if (flightStatusElement) {
            if (droneState.isFlying) {
                flightStatusElement.textContent = 'Flying';
                flightStatusElement.className = 'text-sm font-semibold text-green-600';
            } else {
                flightStatusElement.textContent = 'Landed';
                flightStatusElement.className = 'text-sm font-semibold text-red-600';
            }
        }
        drawAltitudeGauge();
    };

    // Draw the altitude indicator gauge
    function drawAltitudeGauge() {
        const gauge = document.getElementById('altitudeGauge');
        if (!gauge) return;
        const ctxGauge = gauge.getContext('2d');

        // Resize canvas to match CSS size
        const rect = gauge.getBoundingClientRect();
        gauge.width = rect.width;
        gauge.height = rect.height;

        const w = gauge.width;
        const h = gauge.height;

        // Background
        ctxGauge.clearRect(0, 0, w, h);
        ctxGauge.fillStyle = '#f9fafb';
        ctxGauge.fillRect(0, 0, w, h);

        // Border
        ctxGauge.strokeStyle = '#e5e7eb';
        ctxGauge.lineWidth = 1;
        ctxGauge.strokeRect(0.5, 0.5, w - 1, h - 1);

        // Axis (left vertical line)
        const leftPadding = 30;
        const rightPadding = 20;
        const topPadding = 10;
        const bottomPadding = 20;

        const axisX = leftPadding;
        const axisTop = topPadding;
        const axisBottom = h - bottomPadding;
        const axisHeight = axisBottom - axisTop;

        ctxGauge.strokeStyle = '#9ca3af';
        ctxGauge.lineWidth = 2;
        ctxGauge.beginPath();
        ctxGauge.moveTo(axisX, axisTop);
        ctxGauge.lineTo(axisX, axisBottom);
        ctxGauge.stroke();

        // Ticks every 10 feet, labels every 50 feet
        const maxAltitude = 300;
        for (let feet = 0; feet <= maxAltitude; feet += 10) {
            const ratio = feet / maxAltitude; // 0 at ground, 1 at top
            const y = axisBottom - ratio * axisHeight;
            const tickLength = (feet % 50 === 0) ? 12 : 6;

            ctxGauge.strokeStyle = '#9ca3af';
            ctxGauge.lineWidth = 1;
            ctxGauge.beginPath();
            ctxGauge.moveTo(axisX - tickLength, y);
            ctxGauge.lineTo(axisX, y);
            ctxGauge.stroke();

            if (feet % 50 === 0) {
                ctxGauge.fillStyle = '#374151';
                ctxGauge.font = '12px sans-serif';
                ctxGauge.textAlign = 'left';
                ctxGauge.textBaseline = 'middle';
                ctxGauge.fillText(`${feet} ft`, axisX + 6, y);
            }
        }

        // Labels top and bottom
        ctxGauge.fillStyle = '#111827';
        ctxGauge.font = '12px sans-serif';
        ctxGauge.textAlign = 'center';
        // Draw top and bottom labels for clarity
        ctxGauge.textBaseline = 'bottom';
        ctxGauge.textBaseline = 'top';

        // Current altitude marker
        const clampedZ = Math.max(0, Math.min(maxAltitude, droneState.z));
        const currentRatio = clampedZ / maxAltitude;
        const currentY = axisBottom - currentRatio * axisHeight;

        // Draw a horizontal marker line
        ctxGauge.strokeStyle = '#2563eb';
        ctxGauge.lineWidth = 2;
        ctxGauge.beginPath();
        ctxGauge.moveTo(axisX - 15, currentY);
        ctxGauge.lineTo(w - rightPadding, currentY);
        ctxGauge.stroke();

        // Draw a small circle at the axis for emphasis
        ctxGauge.fillStyle = '#2563eb';
        ctxGauge.beginPath();
        ctxGauge.arc(axisX - 2, currentY, 3, 0, 2 * Math.PI);
        ctxGauge.fill();
    }

    // Ensure there is a playable video element for drone animations
    function ensureDroneVideoElement() {
        let video = document.getElementById('droneMedia');
        if (!video) {
            const placeholderImg = document.querySelector('img[alt="Drone"]');
            video = document.createElement('video');
            video.id = 'droneMedia';
            video.className = 'rounded-xl mb-4 shadow-sm w-[200px] h-[150px]';
            video.setAttribute('poster', '../images/drone.png');
            video.setAttribute('playsinline', '');
            video.muted = true;
            if (placeholderImg && placeholderImg.parentNode) {
                placeholderImg.parentNode.insertBefore(video, placeholderImg);
                placeholderImg.remove();
            } else {
                const simCol = document.getElementById('simulationContainer')?.parentNode;
                if (simCol) simCol.insertBefore(video, simCol.firstChild);
            }
        }
        return video;
    }

    // Play context-specific drone animations and revert to poster when finished
    function playDroneAnimation(type) {
        const sources = {
            increase: '../videos/increaseAltitude.mp4',
            decrease: '../videos/decreaseAltitude.mp4',
            takeoff: '../videos/flying.mp4'
        };
        const src = sources[type];
        if (!src) return;
        const video = ensureDroneVideoElement();
        if (!video) return;
        try {
            video.onended = null;
            video.loop = false;
            video.src = src;
            video.load();
            video.play().catch(() => {});
            video.onended = () => {
                video.pause();
                if (droneState.isFlying) {
                    playFlyingLoop();
                } else {
                    video.removeAttribute('src');
                    video.load(); // shows poster again
                }
            };
        } catch (e) {
            console.warn('Unable to play drone animation', e);
        }
    }

    // Flying loop video (plays whenever drone is in the air)
    function playFlyingLoop() {
        const video = ensureDroneVideoElement();
        if (!video) return;
        try {
            video.onended = null;
            video.loop = true;
            if (video.src && video.src.includes('videos/flying.mp4') && !video.paused) {
                return; // already playing
            }
            video.src = 'videos/flying.mp4';
            video.load();
            video.play().catch(() => {});
        } catch (e) {
            console.warn('Unable to start flying loop', e);
        }
    }

    // Ensure the flying loop is active if the drone is airborne
    function ensureFlyingLoop() {
        if (droneState.isFlying) {
            playFlyingLoop();
        }
    }

    // Draw a fixed-size triangle drone (original look)
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
            const directionMultiplier = distance > 0 ? 1 : -1; // New: This determines forward (1) or backward (-1) movement

            while (steps > 0) {
                let nextX = droneState.x;
                let nextY = droneState.y;

                switch (droneState.direction) {
                    case 0: // Up
                        nextY -= directionMultiplier; // Updated
                        break;
                    case 1: // Right
                        nextX += directionMultiplier; // Updated
                        break;
                    case 2: // Down
                        nextY += directionMultiplier; // Updated
                        break;
                    case 3: // Left
                        nextX -= directionMultiplier; // Updated
                        break;
                }
                
                // Check grid boundaries before moving
                if (nextX < 0 || nextX >= tileCount || nextY < 0 || nextY >= tileCount) {
                    console.error('Movement stopped: Boundary reached.');
                    showGridMessage('Boundary reached: cannot move outside the grid');
                    break;
                }

                // Check for obstacles before moving
                if (droneApi.isObstacleDetected(nextX, nextY)) {
                    console.error('Movement stopped: Obstacle detected.');
                    showGridMessage('You hit an obstacle, please go around or above');
                    break;
                }

                droneState.x = nextX;
                droneState.y = nextY;

                if (typeof window.onDroneMove === 'function') {
                    window.onDroneMove(droneState);
                }

                drawGrid();
                drawDrone();

                await new Promise(r => setTimeout(r, 250));
                steps--;
            }

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

        // Check if the next position is an obstacle that blocks at current altitude
        const blocking = obstacles.some(obstacle => {
            if (obstacle.x !== nextX || obstacle.y !== nextY) return false;
            // If obstacle has a height (z), drone can fly over only if strictly above it
            return droneState.z <= (typeof obstacle.z === 'number' ? obstacle.z : 300);
        });
        if (blocking) {
            obstacleDetected = true;
            console.log('Obstacle detected at:', nextX, nextY, 'at or above current altitude');
        } else {
            console.log('No blocking obstacle at:', nextX, nextY);
        }

        return obstacleDetected;
    }

    const droneApi = {
        takeoff: async () => {
            droneState.isFlying = true;
            // Ensure initial hover altitude is at least 5 ft (and not above max)
            droneState.z = Math.min(300, Math.max(droneState.z, 5));
            playDroneAnimation('takeoff');
            drawDrone();
            updateAltitudeDisplay();
            await new Promise(r => setTimeout(r, 500));
            console.log('Drone is now flying.');
        },
        land: async () => {
            droneState.isFlying = false;
            const video = document.getElementById('droneMedia');
            if (video) {
                try {
                    video.onended = null;
                    video.loop = false;
                    video.pause();
                    video.removeAttribute('src');
                    video.load(); // show poster
                } catch(_) {}
            }
            drawDrone();
            updateAltitudeDisplay();
            await new Promise(r => setTimeout(r, 500));
            console.log('Drone has landed.');
        },
        // UPDATED: Added a forward function for the loop to call
        forward: async (distance) => {
            if (!droneState.isFlying) { console.error('Drone must be flying to move.'); return; }
            ensureFlyingLoop();
            await move(distance);
        },
        moveForward: async (distance) => {
            if (!droneState.isFlying) { console.error('Drone must be flying to move.'); return; }
            ensureFlyingLoop();
            await move(distance);
        },
        moveBackward: async (distance) => {
            if (!droneState.isFlying) { console.error('Drone must be flying to move.'); return; }
            ensureFlyingLoop();
            await move(-distance);
        },
        moveUp: async () => {
            if (!droneState.isFlying) { console.error('Drone must be flying to move.'); return; }
            if (droneState.z >= 300) {
                showGridMessage('Max altitude (300 ft) reached');
                return;
            }
            droneState.z = Math.min(300, droneState.z + 1);
            updateAltitudeDisplay();
            console.log(`Drone altitude: ${droneState.z}`);
        },
        moveDown: async () => {
            if (!droneState.isFlying) { console.error('Drone must be flying to move.'); return; }
            if (droneState.z <= 0) {
                showGridMessage('Ground level reached');
                return;
            }
            droneState.z = Math.max(0, droneState.z - 1);
            updateAltitudeDisplay();
            console.log(`Drone altitude: ${droneState.z}`);
        },
        turnLeft: async () => {
            droneState.direction = (droneState.direction + 3) % 4; // Rotate left (counter-clockwise)
            console.log('Drone turning left. New direction:', droneState.direction);
            drawGrid();
            drawDrone();
            ensureFlyingLoop();
        },

        turnRight: async () => {
            droneState.direction = (droneState.direction + 1) % 4; // Rotate right (clockwise)
            console.log('Drone turning right. New direction:', droneState.direction);
            drawGrid();
            drawDrone();
            ensureFlyingLoop();
        },
        increaseAltitude: async (amount) => {
            if (!droneState.isFlying) { console.error('Drone must be flying to change altitude.'); return; }
            const newAltitude = droneState.z + amount;
            if (newAltitude > 300) {
                droneState.z = 300; // Cap at maximum altitude
                showGridMessage('Max altitude (300 ft) reached');
                console.log(`Maximum altitude reached! Altitude capped at 300 feet.`);
            } else {
                droneState.z = newAltitude;
                console.log(`Drone altitude increased by ${amount}. Current altitude: ${droneState.z} feet`);
            }
            updateAltitudeDisplay();
            playDroneAnimation('increase');
            drawDrone(); // Redraw to update size
            await new Promise(r => setTimeout(r, 250));
        },
        decreaseAltitude: async (amount) => {
            if (!droneState.isFlying) { console.error('Drone must be flying to change altitude.'); return; }
            droneState.z -= amount;
            if (droneState.z < 0) {
                droneState.z = 0; // Prevent negative altitude
                showGridMessage('Ground level reached');
            }
            updateAltitudeDisplay();
            playDroneAnimation('decrease');
            drawDrone(); // Redraw to update size
            console.log(`Drone altitude decreased by ${amount}. Current altitude: ${droneState.z} feet`);
            await new Promise(r => setTimeout(r, 250));
        },
        isObstacleDetected: (x, y) => {
            // Blocking only if obstacle exists at (x,y) with height >= current altitude
            return obstacles.some(obstacle => {
                if (obstacle.x !== x || obstacle.y !== y) return false;
                const height = (typeof obstacle.z === 'number') ? obstacle.z : 300; // default high
                return droneState.z <= height;
            });
        }
    };

    // Expose the drone API to the generated code
    const drone = droneApi;


    // Add a generic function that can be overridden by individual lessons
    function onDroneMove() {
        // This is an empty placeholder function.
        // Individual lesson JS files can override this to add custom behavior
        // like checking for visited points.
    }

    // Add a generic function for resetting lesson-specific state
    function resetLessonState() {
        // This is also an empty placeholder.
        // Individual lesson files will provide their own reset logic.
    }

    runButton.addEventListener('click', async () => {
        runButton.disabled = true;
        resetButton.disabled = true;

        const code = Blockly.JavaScript.workspaceToCode(workspace);
        try {
            const asyncCode = `(async () => { ${code} })();`;
            await eval(asyncCode);
            console.log('Code execution finished.');

            // --- Generic win condition check ---
            if (typeof window.checkLessonWinCondition === 'function') {
                // Pass the correct arguments: current drone state, target, and obstacles
                if (window.checkLessonWinCondition(droneState, target, obstacles)) {
                    showGridMessage('Congratulations! You completed the challenge! 🥳');
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
        
        // Call the lesson reset function if provided
        if (typeof window.resetLessonState === 'function') {
            window.resetLessonState();
        }
        
        drawGrid();
        drawDrone();
        updateAltitudeDisplay();
        console.log('Drone position reset.');
    });

    // Initial draw
    drawGrid();
    drawDrone();
    updateAltitudeDisplay();
    drawAltitudeGauge();

    // Resize handler
    // --- UPDATED CODE: Add Blockly.svgResize here too ---
    window.addEventListener('resize', () => {
        drawGrid();
        drawDrone();
        drawAltitudeGauge();
        // Tell Blockly to resize as well when the window changes size
        Blockly.svgResize(workspace);
    });

    // Set challenge description
    const challengeDescriptionElement = document.getElementById('challengeDescription');
    if (challengeDescriptionElement) {
        challengeDescriptionElement.textContent = challengeDescription;
    }
});