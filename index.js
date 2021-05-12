const cellsPerRow = 25;
const snakeSize = 4;

let score = 0;
let movePerSec = 2;
let Game_Started = false;
let Game_Over = false;

const DirectionMap = { right: "RIGHT", left: "LEFT", up: "UP", down: "DOWN" };
const container = document.querySelector(".container");
const restartBtn = document.querySelector(".restart_btn");

container.style.setProperty("--cell-count", cellsPerRow);
showBoard();
let snake = createSnake();
let direction = getDirection();
let Food = createFood();
showSnake();
showFood();
showScore();

window.addEventListener("keydown", (e) => {
  if (!Game_Started) {
    gameLoop(moveSnake);
    Game_Started = true;
  }
  direction = getDirection(e.key);
});

restartBtn.addEventListener("click", restartGame);

function gameLoop(gameFunction) {
  let timeSinceLastMove = 0;
  let callBack = (currentTime) => {
    if (Game_Over || !Game_Started) {
      cancelAnimationFrame(callBack);
      return;
    }
    requestAnimationFrame(callBack);
    let lapsedTime = currentTime - timeSinceLastMove;
    if (lapsedTime >= 1000 / movePerSec) {
      gameFunction();
      timeSinceLastMove = currentTime;
    }
  };
  requestAnimationFrame(callBack);
}

function createSnake() {
  let snakeArr = [];
  let y = Math.floor(cellsPerRow / 2);
  for (let x = y; x > y - snakeSize; x--) {
    snakeArr.push([x, y]);
  }
  return snakeArr;
}

function createFood(food) {
  let random = () => Math.floor(Math.random() * cellsPerRow);
  let newFood = [random(), random()];
  if (!food) {
    return newFood;
  }
  while (Food[0] === newFood[0] && Food[1] === newFood[1]) {
    newFood = [random(), random()];
  }
  return newFood;
}

function showBoard() {
  let frag = new DocumentFragment();
  for (let i = 0; i < cellsPerRow; i++) {
    for (let j = 0; j < cellsPerRow; j++) {
      let cell = document.createElement("div");
      cell.className = "cell";
      cell.setAttribute("data-index", `${j},${i}`);
      frag.appendChild(cell);
    }
  }
  container.appendChild(frag);
}

function showSnake() {
  let currentHead = document.querySelector(".head");
  if (currentHead) {
    currentHead.classList.remove("head");
  }
  snake.forEach(([x, y], i) => {
    if (i === 0) {
      document
        .querySelector(`[data-index="${x},${y}"]`)
        .classList.add("snake", "head");
    } else
      document.querySelector(`[data-index="${x},${y}"]`).classList.add("snake");
  });
}

function showFood() {
  let currentFood = document.querySelector(".food");
  if (currentFood) {
    currentFood.classList.remove("food");
  }
  document
    .querySelector(`[data-index="${Food[0]},${Food[1]}"]`)
    .classList.add("food");
}

function showScore() {
  document.querySelector(".score_text").textContent = score;
}

function getDirection(dir) {
  if (!dir) return DirectionMap.right;
  if (direction !== DirectionMap.right && direction !== DirectionMap.left) {
    if (dir === "ArrowRight") {
      return DirectionMap.right;
    } else if (dir === "ArrowLeft") {
      return DirectionMap.left;
    }
  } else if (direction !== DirectionMap.up && direction !== DirectionMap.down) {
    if (dir === "ArrowUp") {
      return DirectionMap.up;
    } else if (dir === "ArrowDown") {
      return DirectionMap.down;
    }
  }
  return direction;
}

function moveSnake() {
  if (direction === DirectionMap.right) {
    snake.unshift([snake[0][0] + 1, snake[0][1]]);
  } else if (direction === DirectionMap.left) {
    snake.unshift([snake[0][0] - 1, snake[0][1]]);
  } else if (direction === DirectionMap.up) {
    snake.unshift([snake[0][0], snake[0][1] - 1]);
  } else if (direction === DirectionMap.down) {
    snake.unshift([snake[0][0], snake[0][1] + 1]);
  }

  if (ifGameOver()) return;
  ifFoodEaten();
  showSnake();
}

function ifFoodEaten() {
  let [xPopped, yPopped] = [null, null];
  if (Food[0] === snake[0][0] && Food[1] === snake[0][1]) {
    Food = createFood(Food);
    showFood();
    score += 10;
    showScore();
    movePerSec++;
  } else {
    [xPopped, yPopped] = snake.pop();
  }

  if (xPopped !== null || yPopped !== null) {
    document
      .querySelector(`[data-index="${xPopped},${yPopped}"]`)
      .classList.remove("snake");
  }
}

function ifGameOver() {
  let ifOffBoard =
    snake[0][0] >= cellsPerRow ||
    snake[0][0] < 0 ||
    snake[0][1] >= cellsPerRow ||
    snake[0][1] < 0;

  let ifSelfClash = snake
    .slice(1)
    .some(([x, y]) => x === snake[0][0] && y === snake[0][1]);

  if (ifOffBoard || ifSelfClash) {
    if (ifSelfClash) {
      showSnake();
    }
    Game_Over = true;
    document.querySelector(".game_over.hidden").classList.remove("hidden");
    return true;
  }

  return false;
}

function restartGame() {
  document.querySelector(".game_over").classList.add("hidden");
  document.querySelectorAll(".snake").forEach((each) => {
    each.classList.remove("snake");
  });
  score = 0;
  showScore();
  direction = getDirection();
  snake = createSnake();
  showSnake();
  showFood();
  Game_Over = false;
  Game_Started = false;
  movePerSec = 2;
}
