//Create variables here
var canvas;
var dog, happyDog;
var database;
var dogImg, happyDogImg, sadDogImg;
var bedroomImg, gardenImg, washroomImg;
var feedDogBtn, addFoodBtn;
var fedTime, lastFed;
var foodObj;
var food, foodS;
var game, gameS;
var currentTime;
function preload() {
  //load images here
  dogImg = loadImage("images/dogImg.png");
  happyDogImg = loadImage("images/dogImg1.png");
  sadDogImg = loadImage("images/deadDog.png");
  bedroomImg = loadImage("images/Bed Room.png");
  washroomImg = loadImage("images/Wash Room.png");
  gardenImg = loadImage("images/Garden.png")

}

function setup() {
  canvas = createCanvas(500, 500);
  textAlign(CENTER, CENTER)
  textSize(15);
  fill("black");
  dog = createSprite(250, 250, 10, 10);
  dog.addImage("dog1", dogImg);
  dog.addImage("dog2", happyDogImg);
  dog.addImage("sad", sadDogImg);
  dog.scale = 0.5
  database = firebase.database();

  feedDogBtn = createButton("Feed Brownie!");
  feedDogBtn.position(400, 350);
  feedDogBtn.mousePressed(feedDog);

  addFoodBtn = createButton("Add Food!");
  addFoodBtn.position(400, 450);
  addFoodBtn.mousePressed(addFoodS);


  foodObj = new Food();
  food = database.ref("Food");
  food.on("value", readStock);
  gameS = database.ref("gameState");
  gameS.on("value", readGameState);
  currentTime = hour();
}


function draw() {
  background(46, 139, 87);




  drawSprites();

  if (foodS === 0) {
    dog.changeAnimation("dog1", dogImg);
  }
  fedTime = database.ref("LastFed");
  fedTime.on("value", (data) => {
    lastFed = data.val();
  })

  //display different backgrounds depending upon the time":
  if (currentTime == (lastFed + 1)) {
    updateGame("Playing");
    foodObj.garden();
  } else if (currentTime == (lastFed + 2)) {
    updateGame("Sleeping");
    foodObj.bedroom();
  } else if (currentTime > (lastFed + 2) && currentTime <= (lastFed + 4)) {
    updateGame("Bathing");
    foodObj.washroom();
  } else {
    updateGame("Hungry");
    foodObj.display();

    text("Feed Brownie!", 250, 30);
    text("Food Stock Level: " + foodS, 250, 70);
  }

  //Hide buttons if game state is not hungry!
  if (game !== "Hungry") {
    feedDogBtn.hide();
    addFoodBtn.hide();
    dog.remove();
  } else {
    feedDogBtn.show();
    addFoodBtn.show();
    dog.changeAnimation("sad", sadDogImg);
  }
  //lines to display the time for last fed
  if (lastFed >= 12) {
    text("Last Fed Time: " + lastFed % 12 + " PM", 250, 50);
  } else if (lastFed === 0) {
    text("Last Fed Time: 12 AM", 250, 50);
  } else {
    text("Last Fed Time: " + lastFed + " AM", 250, 50);
  }
  //foodObj.display();

  //add styles here

}
function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
  if (foodS < 0) {
    foodS = 0
  }
}
function feedDog() {
  dog.changeAnimation("dog2", happyDogImg);

  foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
  database.ref("/").update({
    Food: foodObj.getFoodStock(),
    LastFed: hour()
  })
}

function addFoodS() {
  foodS++
  database.ref("/").update({
    Food: foodS
  })
}

function readGameState(data) {
  game = data.val();
}

function updateGame(state) {
  database.ref("/").update({
    gameState: state
  });
}