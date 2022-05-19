var trex, trex_running;
var ground, groundimage;
var invisibleground;
var cloud, cloudimage;
var obstacle, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score;
var obstaclegroup, cloudgroup;
var PLAY=1;
var END=0;
var gamestate=PLAY;
var gameOver, restart, gameOverImage, restartImage;
var jumpsound,diesound,checkpointsound;
var message="hello";

function preload(){
  trex_running=loadAnimation("trex1.png", "trex3.png", "trex4.png");
  groundimage=loadImage("ground2.png");
  cloudimage=loadImage("cloud.png");
  obstacle1=loadImage("obstacle1.png");
  obstacle2=loadImage("obstacle2.png");
  obstacle3=loadImage("obstacle3.png");
  obstacle4=loadImage("obstacle4.png");
  obstacle5=loadImage("obstacle5.png");
  obstacle6=loadImage("obstacle6.png");
  trex_collided=loadAnimation("trex_collided.png");
  gameOverImage=loadImage("gameOver.png");
  restartImage=loadImage("restart.png");
  jumpsound=loadSound("jump.mp3");
  diesound=loadSound("die.mp3");
  checkpointsound=loadSound("checkPoint.mp3");
}

function setup(){
    createCanvas(600,200);
    trex=createSprite(90,140,10,50);
    trex.addAnimation("running", trex_running);
    trex.addAnimation("collided", trex_collided)
    trex.scale=0.7;
    edges=createEdgeSprites();
    
    ground=createSprite(200,185,400,10);
    ground.addImage(groundimage);

    invisibleground=createSprite(200,195,400,10);
    invisibleground.visible=false;

    gameOver=createSprite(300,60,30,30);
    gameOver.addImage(gameOverImage);
    restart=createSprite(300,100,30,30);
    restart.addImage(restartImage);
    gameOver.scale=0.5;
    restart.scale=0.5;

    var rand=Math.round(random(3,15));
    //console.log(rand)
    score=0;

    obstaclegroup=new Group();
    cloudgroup=new Group();
    trex.setCollider("circle",0,0,35);

}

function draw(){
    background("white");
    text("SCORE: " +score, 500,50);
    if(gamestate===PLAY){
      ground.velocityX=-10;
      score=score+(Math.round(frameCount/50));
      gameOver.visible=false;
      restart.visible=false;
      if(keyDown("space") && trex.y>=150){
        trex.velocityY=-11;
        jumpsound.play();
      }
      if(ground.x<0){
        ground.x=ground.width/2;
      }
      trex.velocityY=trex.velocityY+0.7;
      spawnclouds();
      spawnobstacles();
      if(obstaclegroup.isTouching(trex)){
        gamestate=END;
        diesound.play();
      }
      if(score>0&&score%500===0){
        checkpointsound.play();

      }
    }
    else if(gamestate===END){
      ground.velocityX=0;
      trex.velocityY=0;
      gameOver.visible=true;
      restart.visible=true;
      trex.changeAnimation("collided", trex_collided);
      obstaclegroup.setLifetimeEach(-1);
      cloudgroup.setLifetimeEach(-1);
      cloudgroup.setVelocityXEach(0);
      obstaclegroup.setVelocityXEach(0);

    }
    //console.log(trex.y)
    trex.collide(invisibleground); 
  
    if(mousePressedOver(restart)){
      reset();
    }

    drawSprites();
  }
function spawnclouds(){
    if(frameCount%60===0){
      cloud=createSprite(600,100,40,10);
      cloud.velocityX=-5;
      cloud.addImage(cloudimage)
      cloud.y=Math.round(random(10,90));
      cloud.lifetime=120
      cloud.depth=trex.depth;
      trex.depth=trex.depth+1;
      cloudgroup.add(cloud);
    } 
}

function spawnobstacles(){
    if(frameCount%60===0){
      obstacle=createSprite(600,170,10,40);
      obstacle.velocityX=-(10+score/500);
      var number=Math.round(random(1,6));
        switch(number){
          case 1:
            obstacle.addImage(obstacle1);
            break;
          case 2:
            obstacle.addImage(obstacle2);
            break;
          case 3:
            obstacle.addImage(obstacle3);
            break;    
          case 4:
            obstacle.addImage(obstacle4);
            break;
          case 5:
            obstacle.addImage(obstacle5);
            break;
          case 6:
            obstacle.addImage(obstacle6);
            break;
          default:break;
        
      }
      obstacle.scale=0.6
      obstaclegroup.add(obstacle);
    }
}

function reset(){
  gamestate=PLAY;
  gameOver.visible=false;
  restart.visible=false;
  score=0;
  obstaclegroup.destroyEach();
  cloudgroup.destroyEach();
  trex.changeAnimation("running", trex_running);
}