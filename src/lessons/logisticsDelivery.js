// --- Agriculture Lesson Parameters ---

// Define the initial state of the drone for this lesson
const lessonDroneState = { x: 6, y: 6, z: 0, isFlying: false, direction: 1 }; // Start at bottom-left, facing right

// Define the target location for the drone
const lessonTarget = { x: 0, y: 0 };

// Define the positions of obstacles on the grid
const lessonObstacles = [
    { x: 2, y: 3 },
    { x: 4, y: 11 },
    { x: 4, y: 1 },
    { x: 7, y: 9 },
    { x: 9, y: 0 },
    { x: 9, y: 4 }
];

// Define the "survey" locations that must be visited
const lessonSurveyPoints = [
    { x: 2, y: 4 },
    { x: 3, y: 11 },
    { x: 4, y: 0 },
    { x: 7, y: 10 },
    { x: 9, y: 5 }
];

// Keep track of which survey points have been visited.
// This is now specific to this lesson and not in index.js
let visitedSurveyPoints = [];

/**
 * Checks if the win condition for this lesson has been met.
 * @param {object} currentDroneState - The current state of the drone (x, y, z, etc.).
 * @param {object} currentTarget - The target object for the lesson.
 * @param {Array} currentObstacles - The list of obstacle coordinates.
 * @returns {boolean} - True if the drone has completed the objective.
 */
function checkLessonWinCondition(currentDroneState, currentTarget, currentObstacles) {
    // Check if the drone has reached the final target
    const atTarget = currentDroneState.x === currentTarget.x && currentDroneState.y === currentTarget.y;

    // The function will now return 'true' if the drone is at the target, regardless of survey points.
    return atTarget;
}

/**
 * Checks if the drone's current position is a survey point and records the visit.
 * This function overrides the generic onDroneMove() in index.js.
 */
function onDroneMove() {
    const dronePosition = { x: droneState.x, y: droneState.y };
    const pointIndex = lessonSurveyPoints.findIndex(point => point.x === dronePosition.x && point.y === dronePosition.y);

    if (pointIndex !== -1) {
        const point = lessonSurveyPoints[pointIndex];
        const alreadyVisited = visitedSurveyPoints.some(visitedPoint => visitedPoint.x === point.x && visitedPoint.y === point.y);
        if (!alreadyVisited) {
            visitedSurveyPoints.push(point);
            console.log(`Visited a survey point at (${point.x}, ${point.y})!`);
        }
    }
}

/**
 * Resets the lesson-specific state, overriding the generic resetLessonState() in index.js.
 */
function resetLessonState() {
    // Clear the array of visited points.
    visitedSurveyPoints = [];
}

/**
 * Draws the survey points on the canvas.
 * This function overrides the generic drawLessonElements() in index.js.
 */
function drawLessonElements() {
    // Check if the lesson has defined survey points.
    if (typeof lessonSurveyPoints !== 'undefined' && lessonSurveyPoints.length > 0) {
        ctx.fillStyle = 'rgba(255, 255, 0, 0.4)'; // A semi-transparent yellow
        lessonSurveyPoints.forEach(point => {
            const x = (point.x - 1) * 50;
            const y = (GRID_SIZE - point.y) * 50;
            ctx.fillRect(x, y, 50, 50); // Draw a filled rectangle for the point
        });
    }
}