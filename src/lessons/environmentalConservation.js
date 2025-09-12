// --- Agriculture Lesson Parameters ---

// Define the initial state of the drone for this lesson
const lessonDroneState = { x: 0, y: 0, z: 0, isFlying: false, direction: 1 }; // Start at bottom-left, facing right

// Define the target location for the drone
const lessonTarget = { x: 11, y: 6 };

// Define the positions of obstacles on the grid
const lessonObstacles = [
    { x: 1, y: 5 },
    { x: 3, y: 8 },
    { x: 4, y: 1 },
    { x: 7, y: 7 },
    { x: 7, y: 0 },
    { x: 9, y: 4 }
];

// Define the "survey" locations that must be visited
const lessonSurveyPoints = [
    { x: 0, y: 10 },
    { x: 2, y: 4 },
    { x: 5, y: 11 },
    { x: 11, y: 11 },
    { x: 5, y: 0 },
    { x: 8, y: 6 },
    { x: 11, y: 0 }
];

// Keep track of which survey points have been visited.
// This is now specific to this lesson and not in index.js
let visitedSurveyPoints = [];
// Define the challenge description for the UI
const lessonChallengeDescription = "Agriculture Challenge: Program the drone to survey the entire field. Start at the bottom-left, navigate around the obstacles, visit the three highlighted crop squares, and land at the target in the top-right.";

// Lesson-specific images (optional)
// Paths are relative to the lesson HTML file (e.g., src/lessons/agriculture.html)
const lessonImages = {
    // Only override obstacle and survey visuals for this lesson
    obstacle: '../images/tree.png',
    survey: '../images/elephant.png',
    target: '../images/target.png'
};

/**
 * Checks if the win condition for this lesson has been met.
 * @param {object} currentDroneState - The current state of the drone (x, y, z, etc.).
 * @param {object} currentTarget - The target object for the lesson.
 * @param {Array} currentObstacles - The list of obstacle coordinates.
 * @returns {boolean} - True if the drone has completed the objective.
 */
function ensureSurveyProgressUI() {
    let el = document.getElementById('surveyProgress');
    if (!el) {
        el = document.createElement('div');
        el.id = 'surveyProgress';
        el.style.position = 'absolute';
        el.style.top = '10px';
        el.style.right = '10px';
        el.style.padding = '6px 10px';
        el.style.background = 'rgba(0,0,0,0.6)';
        el.style.color = '#fff';
        el.style.borderRadius = '6px';
        el.style.fontFamily = 'Arial, sans-serif';
        el.style.fontSize = '14px';
        el.style.zIndex = '1000';
        document.body.appendChild(el);
    }
    return el;
}

function updateSurveyProgressUI() {
    const el = ensureSurveyProgressUI();
    el.textContent = `Survey points: ${visitedSurveyPoints.length} / ${lessonSurveyPoints.length}`;
}

// Initialize the HUD on load
updateSurveyProgressUI();

window.checkLessonWinCondition = function(currentDroneState, currentTarget, currentObstacles) {
    // Must reach the target AND visit all survey points
    const atTarget = currentDroneState.x === currentTarget.x && currentDroneState.y === currentTarget.y;
    const allSurveysVisited = visitedSurveyPoints.length === lessonSurveyPoints.length;
    return atTarget && allSurveysVisited;
}

/**
 * Checks if the drone's current position is a survey point and records the visit.
 * This function overrides the generic onDroneMove() in index.js.
 */
window.onDroneMove = function(currentState) {
    const dronePosition = { x: currentState.x, y: currentState.y };
    const pointIndex = lessonSurveyPoints.findIndex(point => point.x === dronePosition.x && point.y === dronePosition.y);

    if (pointIndex !== -1) {
        const point = lessonSurveyPoints[pointIndex];
        const alreadyVisited = visitedSurveyPoints.some(visitedPoint => visitedPoint.x === point.x && visitedPoint.y === point.y);
        if (!alreadyVisited) {
            visitedSurveyPoints.push(point);
            console.log(`Visited a survey point at (${point.x}, ${point.y})!`);
            updateSurveyProgressUI();
        }
    }
}

/**
 * Resets the lesson-specific state, overriding the generic resetLessonState() in index.js.
 */
window.resetLessonState = function() {
    // Clear the array of visited points.
    visitedSurveyPoints = [];
    updateSurveyProgressUI();
}
