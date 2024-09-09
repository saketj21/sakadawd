import Ground from "./ground/ground.js";
import Dino from "./dino/dino.js";
import Obstacle from "./obstacle/obstacle.js";
import ObstacleController from "./obstacle/controller.js"
import Score from "./score/Score.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const GAME_WIDTH = 800;
const GAME_HEIGHT = 300;
const DINO_HEIGHT = 100;
const DINO_WIDTH = 100;
const OBSTACLE_WIDTH = 100;
const OBSTACLE_HEIGHT = 100;
const GROUND_WIDTH = 1000;
const GROUND_HEIGHT = 24;
const BACKGROUND_HEIGHT = GAME_HEIGHT;
const BACKGROUND_SPEED = 0.1;
const GAME_SPEED = 1.0;
const OBSTACLES_NUMBER = 5;

let scaleRatio=1;
let previousTime = null;
let notStarted = true;
let gameOver = false;
let ground = null;
let background = null;
let dino = null;
let obstacle = null;
let obstaclecontroller = null;
let gameSpeed = GAME_SPEED;
let eventListenerReset = false;
let score = null;


function setScreenSize() {
    scaleRatio = setScaleRatio();
    canvas.width=GAME_WIDTH*scaleRatio;
    canvas.height=GAME_HEIGHT*scaleRatio;
    objectOnHomeScreen();
}

let groundImage = new Image();
groundImage.src = "./ground/ground.png";
let backgroundImage = new Image();
backgroundImage.src = "./background/background.png";
await backgroundImage.decode();
setScreenSize();

window.addEventListener("resize", () => setTimeout(setScreenSize, 500));

function setScaleRatio() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
        return screenWidth / GAME_WIDTH;
      } else {
        return screenHeight / GAME_HEIGHT;
      }
}

function showStartGame() {
  const fontSize = 40 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = "black";
  const text = "Press Space To Start";
  const textWidth = ctx.measureText(text).width;
  const x = (canvas.width - textWidth) / 2;
  const y = (canvas.height + fontSize) / 2; 

  ctx.fillText(text, x, y);
}

function showGameOver() {
  const fontSize = 70 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = "black";
  const text = "GAME OVER";
  const textWidth = ctx.measureText(text).width;
  const x = (canvas.width - textWidth) / 2;
  const y = (canvas.height + fontSize) / 2;
  ctx.fillText(text, x, y);
}

function objectOnHomeScreen() {


  const groundWidth=GROUND_WIDTH * scaleRatio;
  const groundHeight=GROUND_HEIGHT * scaleRatio;
  const backgroundHeight = BACKGROUND_HEIGHT * scaleRatio;
  const backgroundWidth = backgroundHeight / backgroundImage.height * backgroundImage.width;


  ground = new Ground(ctx, groundWidth, groundHeight, scaleRatio, groundImage);

  background = new Ground(ctx, backgroundWidth, backgroundHeight, scaleRatio, backgroundImage);

  dino = new Dino(ctx, DINO_WIDTH, DINO_HEIGHT, scaleRatio);

  obstacle = new Obstacle(ctx, OBSTACLE_WIDTH, OBSTACLE_HEIGHT, scaleRatio, 0, 0, OBSTACLES_NUMBER);

  obstaclecontroller = new ObstacleController(ctx, scaleRatio, GAME_SPEED);

  score = new Score(ctx, scaleRatio);
}

function reset() {
  notStarted = false;
  obstacle.x = -canvas.width;
  gameOver = false;
  eventListenerReset = false;
  ground.reset();
  score.reset();
}

function resetEventListeners() {
  if(!eventListenerReset){
    eventListenerReset = true;
    setTimeout(() => {
      window.addEventListener("keyup", (event) => {
        if (event.key === ' ') {
          reset();
        }
      }, { once: true });
      window.addEventListener("touchstart", reset, { once: true });
    }, 1000);
  }
}

function gameLoop(currentTime){
  if (previousTime === null) {
    previousTime = currentTime;
    requestAnimationFrame(gameLoop);
    return;
  }
  const frameTimeDelta = currentTime - previousTime;
  previousTime = currentTime; 

  background.draw();
  ground.draw();
  dino.draw();
  obstacle.draw();
  score.draw();

  if(!notStarted && !gameOver){
    background.update(BACKGROUND_SPEED, frameTimeDelta);
    ground.update(gameSpeed, frameTimeDelta);
    dino.update(frameTimeDelta)
    obstaclecontroller.update(obstacle, gameSpeed, frameTimeDelta);
    score.update(frameTimeDelta);
  }

  if(obstacle.collideWith(dino)){
    gameOver = true;
    resetEventListeners();
    score.setHighScore();
  }

  if(notStarted){
    showStartGame();
  }

  if(gameOver){
    showGameOver();
  }

  requestAnimationFrame(gameLoop);

}
requestAnimationFrame(gameLoop);

window.addEventListener("keyup", (event) => {
  if (event.key === ' ') {
    reset();
  }
}, { once: true });
window.addEventListener("touchstart", reset, { once: true });
