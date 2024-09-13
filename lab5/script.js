let playerName = '';
let gameStarted = false;
let score = 0;
let lives = 3;
let timeElapsed = 0;
let fruitsCaught = 0;
let basketX = 0;
let autoCollectActive = false;
let autoCollectCooldown = 0;
let pauseActive = false;

let autoCollectTimer = null;
let fruitInterval = null;
let autoCollectCooldownInterval = null;
let timerInterval = null;

const nameInput = document.getElementById('playerName');
const loginButton = document.getElementById('login');
const loginScreen = document.getElementById('loginScreen');
const game = document.getElementById('game');
const gameScreen = document.getElementById('gameScreen');
const playerNameDisplay = document.getElementById('playerNameDisplay');
const timerDisplay = document.getElementById('timer');
const livesDisplay = document.getElementById('lives');
const scoreDisplay = document.getElementById('score');
const basket = document.getElementById('basket');
const resultScreen = document.getElementById('resultScreen');
const resultTime = document.getElementById('resultTime');
const resultScore = document.getElementById('resultScore');
const resultMessage = document.getElementById('resultMessage');
const restartButton = document.getElementById('restart');
const autoCollectCooldownTime = document.getElementById('autocollect-cooldown-time');

function centerBasket() {
  const maxX = gameScreen.offsetWidth - basket.offsetWidth;
  basketX = maxX / 2;
  basket.style.left = basketX + 'px';
}

function updateTimer() {
  timeElapsed++;
  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateLives() {
  livesDisplay.textContent = lives;
}

function updateScore() {
  scoreDisplay.textContent = fruitsCaught;
}

function moveBasketLeft() {
  basketX = Math.max(basketX - 10, 0);
  basket.style.left = basketX + 'px';
}

function moveBasketRight() {
  const maxX = gameScreen.offsetWidth - basket.offsetWidth;
  basketX = Math.min(basketX + 10, maxX);
  basket.style.left = basketX + 'px';
}

function createFruit() {
  const fruit = document.createElement('div');
  fruit.className = 'fruit';
  fruit.style.left = Math.random() * (gameScreen.offsetWidth - 50) + 'px';
  fruit.style.top = 0;
  const fallDuration = Math.random() * 5 + 1;
  fruit.style.animationDuration = fallDuration + 's';
  gameScreen.appendChild(fruit);
  if (autoCollectActive) {
    fruitsCaught++;
    updateScore();
    setTimeout(() => gameScreen.removeChild(fruit), 500);
  } else {
    fruit.addEventListener('animationend', () => {
      if (
        fruit.offsetLeft + fruit.offsetWidth > basket.offsetLeft &&
        fruit.offsetLeft < basket.offsetLeft + basket.offsetWidth &&
        !autoCollectActive
      ) {
        fruitsCaught++;
        updateScore();
      } else {
        lives--;
        updateLives();
        if (lives === 0) gameOver();
      }
      gameScreen.removeChild(fruit);
    });
  }
}

function startFruitDrop() {
  fruitInterval = setInterval(createFruit, 1000);
}

function stopFruitDrop() {
  clearInterval(fruitInterval);
}

function startAutoCollect() {
  if (autoCollectCooldown > 0 || autoCollectActive) return;

  autoCollectActive = true;
  autoCollectTimer = setTimeout(stopAutoCollect, 4000);
  autoCollectCooldownTime.textContent = 'Автосбор активен!';

  const fruits = gameScreen.querySelectorAll('.fruit');
  fruits.forEach(fruit => {
    fruit.style.animationPlayState = 'paused';
    fruitsCaught++;
    updateScore();
    setTimeout(() => gameScreen.removeChild(fruit), 500);
  });
}

function stopAutoCollect() {
  autoCollectActive = false;
  autoCollectCooldown = 5;
  updateAutoCollectCooldown();

  autoCollectCooldownInterval = setInterval(() => {
    autoCollectCooldown--;
    updateAutoCollectCooldown();

    if (autoCollectCooldown <= 0) {
      clearInterval(autoCollectCooldownInterval);
      autoCollectCooldownTime.textContent = 'Автосбор готов';
    }
  }, 1000);

  const fruits = gameScreen.querySelectorAll('.fruit');
  fruits.forEach(fruit => fruit.style.animationPlayState = 'running');
}

function updateAutoCollectCooldown() {
  autoCollectCooldownTime.textContent = `Автосбор восстановится через: ${autoCollectCooldown} сек.`;
}

function gameOver() {
  stopFruitDrop();
  stopAutoCollect();
  game.style.display = 'none';
  resultScreen.style.display = 'flex';
  resultTime.textContent = `${Math.floor(timeElapsed / 60)}:${(timeElapsed % 60).toString().padStart(2, '0')}`;
  resultScore.textContent = fruitsCaught;
  resultMessage.textContent = timeElapsed >= 10 ? 'Вы выиграли!' : 'Вы проиграли!';
}

loginButton.addEventListener('click', () => {
  if (nameInput.value.trim() !== '') {
    playerName = nameInput.value.trim();
    game.style.display = 'block';
    loginScreen.style.display = 'none';
    playerNameDisplay.textContent = playerName;
    updateLives();
    updateScore();
    centerBasket();
    gameStarted = true;
    startFruitDrop();
    timerInterval = setInterval(updateTimer, 1000);
  }
});

document.addEventListener('keydown', (e) => {
  if (gameStarted && !pauseActive) {
    if (e.code === 'ArrowLeft') moveBasketLeft();
    else if (e.code === 'ArrowRight') moveBasketRight();
    else if (e.code === 'Space') startAutoCollect();
  }

  if (e.code === 'Escape') {
    pauseActive = !pauseActive;
    if (pauseActive) {
      stopFruitDrop();
      clearInterval(timerInterval);
    } else {
      startFruitDrop();
      timerInterval = setInterval(updateTimer, 1000);
    }
  }
});

restartButton.addEventListener('click', () => {
  gameStarted = false;
  score = 0;
  lives = 3;
  timeElapsed = 0;
  fruitsCaught = 0;
  basketX = 0;
  autoCollectActive = false;
  autoCollectCooldown = 0;
  pauseActive = false;

  clearInterval(fruitInterval);
  clearInterval(timerInterval);
  clearInterval(autoCollectCooldownInterval);
  clearTimeout(autoCollectTimer);

  autoCollectCooldownTime.textContent = 'Автосбор готов';

  const fruits = document.querySelectorAll('.fruit');
  fruits.forEach(fruit => fruit.remove());

  nameInput.value = '';
  resultScreen.style.display = 'none';
  game.style.display = 'block';

  updateTimer();
  updateLives();
  updateScore();
  centerBasket();
  basket.style.left = '0px';

  gameStarted = true;

  startFruitDrop();
  timerInterval = setInterval(updateTimer, 1000);
});


const playerNameInput = document.getElementById("playerName");

playerNameInput.addEventListener("input", () => {
  if (playerNameInput.value.trim() !== "") {
    loginButton.disabled = false;
    loginButton.style.backgroundColor = "var(--green)";
  } else {
    loginButton.disabled = true;
    loginButton.style.backgroundColor = "var(--grey-dark)";
  }
});
