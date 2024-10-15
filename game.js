const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let playerImage = new Image();
playerImage.src = 'player.png';  // Insert the player image file name here

let player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 60,
  width: 50,
  height: 50,
  speed: 5,
};

let fallingObjects = [];
let score = 0;
let highScore = 0;
let difficulty = 1;
let gameOver = false;

// Initialize score display
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');

// Background Images
const backgrounds = [
  'background1.jpg',
  'background2.jpg',
  'background3.jpg',
];  // Add URLs or paths to your stock images

// Lil Wayne Songs
const songs = [
  'lil_wayne_song1.mp3',
  'lil_wayne_song2.mp3',
  'lil_wayne_song3.mp3',
];  // Add URLs or paths to Lil Wayne songs

// Set a random background image
canvas.style.backgroundImage = `url(${backgrounds[Math.floor(Math.random() * backgrounds.length)]})`;

// Play a random song
const audioElement = document.getElementById('backgroundMusic');
audioElement.src = songs[Math.floor(Math.random() * songs.length)];
audioElement.play();

// Falling object generator
function spawnFallingObject() {
  const size = Math.random() * 30 + 20;
  const obj = {
    x: Math.random() * (canvas.width - size),
    y: -size,
    width: size,
    height: size,
    color: 'red',
    speed: Math.random() * 3 * difficulty + 2,
  };
  fallingObjects.push(obj);
}

// Update falling objects
function updateFallingObjects() {
  for (let i = 0; i < fallingObjects.length; i++) {
    const obj = fallingObjects[i];
    obj.y += obj.speed;

    // Collision detection with player
    if (
      player.x < obj.x + obj.width &&
      player.x + player.width > obj.x &&
      player.y < obj.y + obj.height &&
      player.height + player.y > obj.y
    ) {
      gameOver = true;
    }

    // Remove object if it goes off-screen
    if (obj.y > canvas.height) {
      fallingObjects.splice(i, 1);
      i--;
    }
  }
}

// Draw player
function drawPlayer() {
  ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

// Draw falling objects
function drawFallingObjects() {
  for (const obj of fallingObjects) {
    ctx.fillStyle = obj.color;
    ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
  }
}

// Control player movement
function movePlayer() {
  if (keys.ArrowLeft && player.x > 0) {
    player.x -= player.speed;
  }
  if (keys.ArrowRight && player.x + player.width < canvas.width) {
    player.x += player.speed;
  }
}

// Handle keyboard input
let keys = {};
window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// Reset the game
function resetGame() {
  fallingObjects = [];
  score = 0;
  difficulty = 1;
  gameOver = false;
  player.x = canvas.width / 2 - player.width / 2;
}

// Game loop
function gameLoop() {
  if (!gameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update game elements
    movePlayer();
    updateFallingObjects();

    // Draw game elements
    drawPlayer();
    drawFallingObjects();

    // Update score and difficulty
    score++;
    scoreDisplay.textContent = score;
    if (score > highScore) {
      highScore = score;
      highScoreDisplay.textContent = highScore;
    }

    // Increase difficulty over time
    difficulty = Math.floor(score / 100) + 1;

    // Spawn new falling objects with increasing difficulty
    if (Math.random() < 0.03 * difficulty) {
      spawnFallingObject();
    }

    requestAnimationFrame(gameLoop);
  } else {
    // Show Game Over message and reset after a delay
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.fillText('GAME OVER', canvas.width / 2 - 150, canvas.height / 2);

    setTimeout(() => {
      resetGame();
      requestAnimationFrame(gameLoop);
    }, 2000);
  }
}

// Start the game
gameLoop();
