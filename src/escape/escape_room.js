// Puzzle Definitions
const PUZZLES = {
    beginner: [
        {
            id: 'b1',
            item: 'bulletin',
            description: 'The bulletin board shows a message that needs to be printed.',
            clue: 'The clue says: "Print the word PYTHON"',
            hint: 'Use print() with the word PYTHON in quotes',
            expectedCode: 'print("PYTHON")',
            unlockMessage: 'You solved it! The bulletin board now shows the next clue location.'
        },
        {
            id: 'b2',
            item: 'screen',
            description: 'The computer screen displays a challenge.',
            clue: 'The screen says: "Print the number 42"',
            hint: 'Use print() with just the number 42 (no quotes)',
            expectedCode: 'print(42)',
            unlockMessage: 'Perfect! The screen unlocks the file cabinet.'
        },
        {
            id: 'b3',
            item: 'cabinet',
            description: 'Inside the file cabinet is a locked box.',
            clue: 'A note says: "If 10 is greater than 5, print KEY"',
            hint: 'Use an if statement to check if 10 > 5, then print("KEY")',
            expectedCode: 'if 10 > 5:\n    print("KEY")',
            unlockMessage: 'The box opens! You found the key to escape!'
        }
    ],
    intermediate: [
        {
            id: 'i1',
            item: 'bulletin',
            description: 'The bulletin board shows an important message.',
            clue: 'Print "HELLO WORLD"',
            hint: 'Remember to use print() with quotes around the text',
            expectedCode: 'print("HELLO WORLD")',
            unlockMessage: 'Great! This unlocks the next puzzle location.'
        },
        {
            id: 'i2',
            item: 'screen',
            description: 'A challenge appears on the computer screen.',
            clue: 'If x equals 5, print "CORRECT". Otherwise print "WRONG". Set x = 5.',
            hint: 'Use: x = 5, then if x == 5: print("CORRECT") else: print("WRONG")',
            expectedCode: 'x = 5\nif x == 5:\n    print("CORRECT")\nelse:\n    print("WRONG")',
            unlockMessage: 'Excellent! You can now access the file cabinet.'
        },
        {
            id: 'i3',
            item: 'cabinet',
            description: 'The file cabinet contains a puzzle box.',
            clue: 'Check if the string "python" contains the letter "p". If yes, print "FOUND".',
            hint: 'Check if "p" is in "python", then print("FOUND") if true',
            expectedCode: 'if "p" in "python":\n    print("FOUND")',
            unlockMessage: 'The box opens! You can now access the desk drawer.'
        },
        {
            id: 'i4',
            item: 'desk',
            description: 'Inside the desk drawer is a code lock.',
            clue: 'If the length of "CODE" is 4, print "ESCAPE".',
            hint: 'Use len("CODE") and check if it equals 4',
            expectedCode: 'if len("CODE") == 4:\n    print("ESCAPE")',
            unlockMessage: 'The lock opens! You found the key to escape!'
        }
    ],
    advanced: [
        {
            id: 'a1',
            item: 'bulletin',
            description: 'A complex problem is posted on the bulletin board.',
            clue: 'Loop 3 times and print the numbers 0, 1, 2.',
            hint: 'Use for i in range(3): then print(i)',
            expectedCode: 'for i in range(3):\n    print(i)',
            unlockMessage: 'Correct! Access to the computer screen is now granted.'
        },
        {
            id: 'a2',
            item: 'screen',
            description: 'An algorithmic challenge appears on screen.',
            clue: 'Print the squares of numbers 1 through 3 (1, 4, 9).',
            hint: 'Use a for loop: for i in range(1, 4): print(i * i)',
            expectedCode: 'for i in range(1, 4):\n    print(i * i)',
            unlockMessage: 'Impressive! The file cabinet is now accessible.'
        },
        {
            id: 'a3',
            item: 'cabinet',
            description: 'A multi-step logic puzzle is found here.',
            clue: 'If x is between 5 and 10, print "IN RANGE". Otherwise print "OUT OF RANGE". Set x = 7.',
            hint: 'Use: x = 7, then if x > 5 and x < 10: print("IN RANGE") else: print("OUT OF RANGE")',
            expectedCode: 'x = 7\nif x > 5 and x < 10:\n    print("IN RANGE")\nelse:\n    print("OUT OF RANGE")',
            unlockMessage: 'Excellent logic! You can now access the desk drawer.'
        },
        {
            id: 'a4',
            item: 'desk',
            description: 'A loop-based challenge is locked in the desk drawer.',
            clue: 'Print the sum of 1, 2, and 3 using a loop.',
            hint: 'Use total = 0, then loop and add: total += i, then print(total)',
            expectedCode: 'total = 0\nfor i in range(1, 4):\n    total += i\nprint(total)',
            unlockMessage: 'Great work! Almost there!'
        },
        {
            id: 'a5',
            item: 'exit',
            description: 'The exit door has a final code lock.',
            clue: 'Count how many even numbers are between 0 and 10. Print the count.',
            hint: 'Loop through range(0, 11), check if i % 2 == 0, count them, then print the count',
            expectedCode: 'count = 0\nfor i in range(0, 11):\n    if i % 2 == 0:\n        count += 1\nprint(count)',
            unlockMessage: 'Perfect! You solved all puzzles and found the key to escape!'
        }
    ]
};

// Game State
let gameState = {
    difficulty: null,
    currentPuzzleIndex: 0,
    solvedPuzzles: [],
    attempts: {},
    usedHints: {},
    unlockedItems: ['whiteboard'],
    gameWon: false,
    currentPuzzle: null
};

// Initialize game
function startGame(difficulty) {
    gameState.difficulty = difficulty;
    gameState.currentPuzzleIndex = 0;
    gameState.solvedPuzzles = [];
    gameState.attempts = {};
    gameState.usedHints = {};
    gameState.unlockedItems = ['whiteboard'];
    gameState.gameWon = false;

    document.getElementById('difficultyScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');
    
    updateProgress();
    updateItemStates();
}

// Return to menu
function returnToMenu() {
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('victoryModal').classList.remove('active');
    document.getElementById('clueModal').classList.remove('active');
    document.getElementById('codeModal').classList.remove('active');
    document.getElementById('difficultyScreen').classList.remove('hidden');
    
    gameState = {
        difficulty: null,
        currentPuzzleIndex: 0,
        solvedPuzzles: [],
        attempts: {},
        usedHints: {},
        unlockedItems: ['whiteboard'],
        gameWon: false,
        currentPuzzle: null
    };
}

// Get current puzzle
function getCurrentPuzzle() {
    const puzzles = PUZZLES[gameState.difficulty];
    if (gameState.currentPuzzleIndex < puzzles.length) {
        return puzzles[gameState.currentPuzzleIndex];
    }
    return null;
}

// Get puzzle by item
function getPuzzleByItem(itemName) {
    const puzzles = PUZZLES[gameState.difficulty];
    return puzzles.find(p => p.item === itemName);
}

// Update item states (locked/unlocked)
function updateItemStates() {
    const items = ['whiteboard', 'bulletin', 'screen', 'cabinet', 'desk', 'exit'];
    items.forEach(item => {
        const element = document.getElementById(`item-${item}`);
        if (!element) return;

        if (item === 'exit') {
            // Exit only clickable when game is won
            if (gameState.gameWon) {
                element.classList.remove('locked');
            } else {
                element.classList.add('locked');
            }
        } else if (gameState.unlockedItems.includes(item)) {
            element.classList.remove('locked');
        } else {
            element.classList.add('locked');
        }
    });
}

// Click item handler
function clickItem(itemName) {
    // Check if item is locked
    if (itemName === 'exit') {
        if (!gameState.gameWon) {
            showLockedMessage('The exit door is locked. You need to find the key first by solving all puzzles.');
            return;
        } else {
            showVictory();
            return;
        }
    }

    if (itemName !== 'whiteboard' && !gameState.unlockedItems.includes(itemName)) {
        const currentPuzzle = getCurrentPuzzle();
        if (currentPuzzle && currentPuzzle.item === itemName) {
            showClueModal(currentPuzzle);
        } else {
            const nextItem = currentPuzzle ? currentPuzzle.item : 'the next area';
            showLockedMessage(`You need to solve the current puzzle first. Work on: ${nextItem}`);
        }
        return;
    }

    // Show clue
    if (itemName === 'whiteboard') {
        showWhiteboardClue();
    } else {
        const puzzle = getPuzzleByItem(itemName);
        if (puzzle) {
            showClueModal(puzzle);
        }
    }
}

// Show whiteboard (always free clue)
function showWhiteboardClue() {
    document.getElementById('clueTitle').textContent = 'Whiteboard';
    document.getElementById('clueText').textContent = 'You see notes on the whiteboard about Python basics. You can always come back here for reference. Look around the room for items to interact with!';
    document.getElementById('codeButton').style.display = 'none';
    document.getElementById('clueModal').classList.add('active');
}

// Show clue modal
function showClueModal(puzzle) {
    document.getElementById('clueTitle').textContent = `${puzzle.item.charAt(0).toUpperCase() + puzzle.item.slice(1)} - Clue`;
    document.getElementById('clueText').textContent = puzzle.clue;
    
    const codeButton = document.getElementById('codeButton');
    codeButton.style.display = 'inline-block';
    codeButton.onclick = () => showCodeModal(puzzle);
    
    document.getElementById('clueModal').classList.add('active');
}

// Close clue modal
function closeClueModal(event) {
    if (event && event.target !== event.currentTarget) return;
    document.getElementById('clueModal').classList.remove('active');
}

// Show code modal
function showCodeModal(puzzle) {
    if (!puzzle) {
        puzzle = getCurrentPuzzle();
    }

    closeClueModal();

    document.getElementById('puzzleDescription').textContent = puzzle.description;
    document.getElementById('codeInput').value = '';
    document.getElementById('errorMessage').classList.remove('show');
    document.getElementById('successMessage').classList.remove('show');
    document.getElementById('hintBox').classList.remove('show');

    // Initialize attempts if first time
    if (!gameState.attempts[puzzle.id]) {
        gameState.attempts[puzzle.id] = 0;
        gameState.usedHints[puzzle.id] = false;
    }

    updateAttemptDisplay(puzzle.id);
    document.getElementById('codeModal').classList.add('active');

    // Store current puzzle for submission
    document.getElementById('codeModal').dataset.puzzleId = puzzle.id;
    gameState.currentPuzzle = puzzle;
}

// Update attempt display
function updateAttemptDisplay(puzzleId) {
    const attempts = gameState.attempts[puzzleId];
    const indicator = document.getElementById('attemptIndicator');
    
    // Update classes
    indicator.classList.remove('attempts-0', 'attempts-1', 'attempts-2', 'attempts-3');
    indicator.classList.add(`attempts-${Math.min(attempts, 3)}`);
    
    document.getElementById('attemptCount').textContent = attempts;

    // Show hint button if 3 attempts made and hint not shown
    const hintButton = document.getElementById('hintButtonContainer');
    if (attempts >= 3 && !gameState.usedHints[puzzleId]) {
        hintButton.style.display = 'block';
    } else {
        hintButton.style.display = 'none';
    }
}

// Show hint
function showHint() {
    const puzzleId = document.getElementById('codeModal').dataset.puzzleId;
    const puzzle = PUZZLES[gameState.difficulty].find(p => p.id === puzzleId);
    
    if (puzzle) {
        document.getElementById('hintText').textContent = puzzle.hint;
        document.getElementById('hintBox').classList.add('show');
        gameState.usedHints[puzzleId] = true;
        document.getElementById('hintButtonContainer').style.display = 'none';
    }
}

// Submit code
function submitCode() {
    const puzzleId = document.getElementById('codeModal').dataset.puzzleId;
    const puzzle = PUZZLES[gameState.difficulty].find(p => p.id === puzzleId);
    const code = document.getElementById('codeInput').value;

    // Increment attempts
    gameState.attempts[puzzleId]++;
    updateAttemptDisplay(puzzleId);

    // Validate code (exact match, trim whitespace)
    if (code.trim() === puzzle.expectedCode.trim()) {
        // Success
        document.getElementById('successMessage').classList.add('show');
        document.getElementById('errorMessage').classList.remove('show');
        document.getElementById('codeInput').disabled = true;
        document.getElementById('codeInput').style.opacity = '0.5';

        // Unlock next item
        gameState.solvedPuzzles.push(puzzle.id);
        gameState.currentPuzzleIndex++;

        // Get next puzzle to unlock its item
        const nextPuzzle = getCurrentPuzzle();
        if (nextPuzzle) {
            if (!gameState.unlockedItems.includes(nextPuzzle.item)) {
                gameState.unlockedItems.push(nextPuzzle.item);
            }
        } else {
            // All puzzles solved - player can exit
            gameState.gameWon = true;
        }

        updateItemStates();
        updateProgress();

        // Auto-close after 2 seconds
        setTimeout(() => {
            closeCodeModal();
            document.getElementById('codeInput').disabled = false;
            document.getElementById('codeInput').style.opacity = '1';
        }, 2000);
    } else {
        // Failure
        document.getElementById('errorMessage').classList.add('show');
        document.getElementById('successMessage').classList.remove('show');
        document.getElementById('errorText').textContent = 'Check your syntax and try again.';
    }
}

// Close code modal
function closeCodeModal(event) {
    if (event && event.target !== event.currentTarget) return;
    document.getElementById('codeModal').classList.remove('active');
    document.getElementById('codeInput').disabled = false;
    document.getElementById('codeInput').style.opacity = '1';
}

// Show locked message
function showLockedMessage(message) {
    document.getElementById('lockedMessage').textContent = message;
    document.getElementById('lockedModal').classList.add('active');
}

// Close locked modal
function closeLockedModal(event) {
    if (event && event.target !== event.currentTarget) return;
    document.getElementById('lockedModal').classList.remove('active');
}

// Show victory
function showVictory() {
    document.getElementById('victoryModal').classList.add('active');
}

// Update progress bar
function updateProgress() {
    const puzzles = PUZZLES[gameState.difficulty];
    const progress = (gameState.solvedPuzzles.length / puzzles.length) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('progressText').textContent = `${gameState.solvedPuzzles.length} / ${puzzles.length} puzzles solved`;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Page initialized
});
