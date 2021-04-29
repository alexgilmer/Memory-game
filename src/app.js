const playArea = document.getElementById('cards');
const nextCardElem = document.getElementById('next-card');
const scoreReadout = document.getElementById('score');
const restartButton = document.querySelector('.restart');
const WAIT_DELAY_SECONDS = 1.5;
let timeoutID;
const timeBarSettings = {
  pause: {
    delay: WAIT_DELAY_SECONDS,
    width: '0%',
    color: 'red',
  },
  resume: {
    delay: 0,
    width: '100%',
    color: 'green',  
  },
};

const shuffle = function(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

const gameState = {
  SYMBOL_LIST: [
    'fas fa-atom',
    'fas fa-frog',
    'fas fa-feather-alt',
    'fas fa-cogs',
    'fas fa-anchor',
    'fas fa-fan',
    'fas fa-bolt',
    'fas fa-hat-wizard',
    'fas fa-apple-alt',
    'fas fa-bell',
    'fas fa-bomb',
    'fas fa-brain'
  ],
  boardOrder: [],
  demandOrder: [],
  shuffleOrders() {
    this.boardOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    shuffle(this.boardOrder);

    this.demandOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    shuffle(this.demandOrder);
  },
  score: 0,
  paused: false,
};

const pauseGame = function() {
  styleTimeBar(timeBarSettings.pause);
  
  timeoutID = setTimeout(() => {
    resumeGame();
  }, WAIT_DELAY_SECONDS * 1000);

  gameState.paused = true;
};

const resumeGame = function() {
  styleTimeBar(timeBarSettings.resume);

  gameState.paused = false;
  
  const cardList = document.getElementsByClassName('card');
  for (let card of cardList) {
    card.classList.remove('show');
  }
};

const styleTimeBar = function(settings) {
  const timeBar = document.querySelector('#time-bar');
  timeBar.style.transition = `width ${settings.delay}s linear, background-color ${settings.delay}s linear`;
  timeBar.style.width = settings.width;
  timeBar.style.backgroundColor = settings.color;
};

const constructGameBoard = function() {
  playArea.textContent = '';
  for (let i = 0; i < gameState.boardOrder.length; i++) {
    const outerElem = document.createElement('li');
    outerElem.classList.add('card');
    outerElem.dataset.value = gameState.boardOrder[i];

    const innerElem = buildElement(gameState.boardOrder, i);

    playArea.appendChild(outerElem);
    outerElem.appendChild(innerElem);
  }
};

const resetGame = function() {
  gameState.shuffleOrders();
  constructGameBoard();

  gameState.score = 0;
  scoreReadout.textContent = 0;

  const firstCardToFind = buildElement(gameState.demandOrder);
  nextCardElem.textContent = '';
  nextCardElem.appendChild(firstCardToFind);

  clearTimeout(timeoutID);
  resumeGame();
};

const cellClick = function(cellElement) {
  incrementScore();

  if (isCorrectCell(cellElement)) {
    openMatchedCell(cellElement);
  } else {
    showWrongCell(cellElement);
  }
};

const showWrongCell = function(cellElement) {
  cellElement.classList.add('show');
  pauseGame();
}

const openMatchedCell = function(cellElement) {
  cellElement.classList.add('matched');
  if (gameState.demandOrder.length > 1) {
    getNextCard();
  } else {
    gameOver();
  }
}

const isCorrectCell = function(cellElement) {
  const value = +cellElement.dataset.value;
  if (value === gameState.demandOrder[0]) {
    return true;
  }

  return false;
};

const isValidClick = function(e) {
  if (e.target.tagName === 'LI' 
  && !e.target.classList.contains('matched')
  && !gameState.paused
  ) {
    return true;
  }
  
  return false;
};

const incrementScore = function() {
  gameState.score++;
  scoreReadout.textContent = gameState.score;
};

const getNextCard = function() {
  gameState.demandOrder.shift();

  const nextCardToFind = buildElement(gameState.demandOrder);

  nextCardElem.textContent = '';
  nextCardElem.appendChild(nextCardToFind);
};

const buildElement = function(order, index = 0) {
  const returnElem = document.createElement('i');
  const innerClasses = gameState.SYMBOL_LIST[order[index]].split(' ');
  
  returnElem.classList.add(innerClasses[0], innerClasses[1]);

  return returnElem;
};

const gameOver = function() {
  alert(`You won the game in ${gameState.score} guesses!`);
  resetGame();
};

restartButton.addEventListener('click', resetGame);

playArea.addEventListener('click', (e) => {
  if (isValidClick(e)) {
    const cellElement = e.target;
    cellClick(cellElement);
  }
});

resetGame();
