// --- Agriculture Lesson Parameters ---

// Define the initial state of the drone for this lesson
const lessonDroneState = { x: 3, y: 11, z: 0, isFlying: false, direction: 1 }; // Start at bottom-left, facing right

// Define the target location for the drone
const lessonTarget = { x: 10, y: 1 };

// Define the positions of obstacles on the grid
const lessonObstacles = [
    { x: 3, y: 10 },
    { x: 3, y: 9 },
    { x: 3, y: 8 },
    { x: 3, y: 7 },
    { x: 6, y: 2 },
    { x: 6, y: 3 },
    { x: 6, y: 4 },
    { x: 8, y: 5 }
];

// Define the "survey" locations that must be visited
const lessonSurveyPoints = [
    { x: 5, y: 8 },
    { x: 5, y: 6 },
    { x: 7, y: 4 }
];

// Keep track of which survey points have been visited.
// This is now specific to this lesson and not in index.js
let visitedSurveyPoints = [];

// Define the challenge description for the UI
const lessonChallengeDescription = "Agriculture Challenge: Program the drone to survey the entire field. Start at the bottom-left, navigate around the obstacles, visit the three highlighted crop squares, and land at the target in the top-right.";

/**
 * Checks if the win condition for this lesson has been met.
 * @param {object} currentDroneState - The current state of the drone (x, y, z, etc.).
 * @param {object} currentTarget - The target object for the lesson.
 * @param {Array} currentObstacles - The list of obstacle coordinates.
 * @returns {boolean} - True if the drone has completed the objective.
 */
function checkLessonWinCondition(currentDroneState, currentTarget, currentObstacles) {
    // Check if the drone has reached the final targetF
    const atTarget = currentDroneState.x === currentTarget.x && currentDroneState.y === currentTarget.y;

    // Check if all survey points have been visited
    const allSurveyed = lessonSurveyPoints.every(point => {
        return visitedSurveyPoints.some(visitedPoint => visitedPoint.x === point.x && visitedPoint.y === point.y);
    });

    return atTarget && allSurveyed;
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