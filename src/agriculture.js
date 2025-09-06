// Lesson 1 specific logic
let lessonDroneState = { x: 1, y: 1, z: 0, isFlying: false, direction: 0 };
let lessonTarget = { x: 10, y: 10 };
let lessonObstacles = [
    { x: 3, y: 3 },
    { x: 6, y: 2 },
    { x: 8, y: 5 }
];
let lessonChallengeDescription = "Guide the drone from Point A to Point B, avoiding the obstacles.";

function checkLessonWinCondition() {
    // Check if the drone reached the target
    return droneState.x === lessonTarget.x && droneState.y === lessonTarget.y;
}
