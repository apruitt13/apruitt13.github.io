// --- Agriculture Lesson Parameters ---

// Define the initial state of the drone for this lesson
const lessonDroneState = { x: 1, y: 10, z: 0, isFlying: false, direction: 1 }; // Start at bottom-left, facing right

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

// Define the challenge description for the UI
const lessonChallengeDescription = "Agriculture Challenge: Program the drone to survey the entire field. Start at the bottom-left, navigate around the obstacles, and land at the target in the top-right.";

/**
 * Checks if the win condition for the agriculture lesson has been met.
 * @param {object} currentDroneState - The current state of the drone (x, y, z, etc.).
 * @param {object} currentTarget - The target object for the lesson.
 * @returns {boolean} - True if the drone is at the target location.
 */
function checkLessonWinCondition(currentDroneState, currentTarget) {
    // The win condition is met if the drone's final x and y coordinates match the target's.
    return currentDroneState.x === currentTarget.x && currentDroneState.y === currentTarget.y;
}