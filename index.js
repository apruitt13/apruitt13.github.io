const grid = document.querySelector('.grid')
const scoreDisplay = document.querySelector('#score')
const blockWidth = 100
const blockHeight = 20
const ballDiamter = 20
const boardWidth = 560
const boardHeight = 300

let timerId
let xDirection = -2
let yDirection = 2
let score = 0

const userStart = [230, 10]
let currentPosition = userStart

const ballStart = [270, 40]
let ballCurrentPosition = ballStart

// Create Block
class Block {
    constructor(xAxis, yAxis){
        this.bottomLeft = [xAxis,yAxis]
        this.bottomRight = [xAxis + blockWidth, yAxis]
        this.topLeft = [xAxis, yAxis + blockHeight]
        this.topRight = [xAxis + blockWidth, xAxis + blockHeight]
    }
}

// All of the blocks
const blocks = [
    new Block(10,270),
    new Block(120,270),
    new Block(230,270),
    new Block(340,270),
    new Block(450,270),
    new Block(10,240),
    new Block(120,240),
    new Block(230,240),
    new Block(340,240),
    new Block(450,240),
    new Block(10,210),
    new Block(120,210),
    new Block(230,210),
    new Block(340,210),
    new Block(450,210),
]

// Draw all my block
function addBlocks() {

    for (let index = 0; index < blocks.length; index++){
    const block = document.createElement('div')
    block.classList.add('block')
    block.style.left = blocks[index].bottomLeft[0] + 'px'
    block.style.bottom = blocks[index].bottomLeft[1] + 'px'
    grid.appendChild(block)
    }
}

addBlocks()

// Add a user.
const user = document.createElement('div')
user.classList.add('user')
drawUser()
grid.appendChild(user)

// Draw the user
function drawUser() {
    user.style.left = currentPosition[0] + 'px'
    user.style.bottom = currentPosition[1] + 'px'
}

// Draw the ball
function drawBall() {
    ball.style.left = ballCurrentPosition[0] + 'px'
    ball.style.bottom = ballCurrentPosition[1] + 'px'
}

// Move the paddle
function moveUser(event) {
    switch(event.key){                  // Switch case
        case 'ArrowLeft':
            if ( currentPosition[0] > 0){
                currentPosition[0] -= 10
                drawUser()
            }
                break;
        case 'ArrowRight':
            if ( currentPosition[0] < boardWidth - blockWidth){
                currentPosition[0] += 10
                drawUser()
            }
                break;
    }
}

document.addEventListener('keydown', moveUser)

// Add ball
const ball = document.createElement('div')
ball.classList.add('ball')
drawBall()
grid.appendChild(ball)

// Moving the ball
function moveBall() {
    ballCurrentPosition[0] +=xDirection
    ballCurrentPosition[1] += yDirection
    drawBall()
    checkForCollisions()
}

timerId = setInterval(moveBall, 30)

// Check for ball collisions
function checkForCollisions() {
    // Check for block collisions.
    for (let index = 0; index < blocks.length; index++) {
        if (
            (ballCurrentPosition[0] > blocks[index].bottomLeft[0] && ballCurrentPosition[0] < blocks[index].bottomRight[0]) &&
            ((ballCurrentPosition[1] + ballDiamter) > blocks[index].bottomLeft[1] && ballCurrentPosition[1] < blocks[index].topLeft[1])
        ) {
            const allBlocks = Array.from(document.querySelectorAll('.block'))
            allBlocks[index].classList.remove('block')
            blocks.splice(index, 1)
            changeDirection()
            score++
            scoreDisplay.innerHTML = score
            
            // Check for win
            if ( blocks.length === 0) {
                scoreDisplay.innerHTML = "You win"
                clearInterval(timerId)
                document.removeEventListener('keydown', moveUser)
            }

        }
    }

    // Check for wall collisions
    if (ballCurrentPosition[0] >= (boardWidth - ballDiamter) || 
    ballCurrentPosition[1] >= (boardHeight - ballDiamter) ||
    ballCurrentPosition[0] <= 0
    ){
        changeDirection()
    }

    // Check for paddle collisions
    if (
        (        ballCurrentPosition[0] > currentPosition[0] && ballCurrentPosition[0] < currentPosition[0] + blockWidth) &&
        (ballCurrentPosition[1] > currentPosition[1] && ballCurrentPosition[1] < currentPosition[1] + blockHeight)
        )
         {
            changeDirection()
    }

    // Check for game over
    if (ballCurrentPosition[1] <= 0) {
        clearInterval(timerId)
        scoreDisplay.innerHTML = "You lose"
        document.removeEventListener('keydown',moveUser)
        
    }
}

function changeDirection(){
    if (xDirection === 2 && yDirection === 2) {
        yDirection =-2
        return
    }
    if (xDirection === 2 && yDirection === -2) {
        xDirection =-2
        return
    }
    if (xDirection === -2 && yDirection === -2) {
        yDirection = 2
        return
    }
    if (xDirection === -2 && yDirection === 2){
        xDirection = 2
    }
}

