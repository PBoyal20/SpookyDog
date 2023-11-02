import { InputHandler } from './input.js';
import { Player } from './player.js';
import { Background } from './background.js';
import { FlyingEnemy, ClimbingEnemy, GroundEnemy } from './enemies.js';
import { UI } from './UI.js';


window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas-1');
    const ctx = canvas.getContext('2d');

    canvas.width = 500;
    canvas.height = 500;

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
           this.groundHeight = 80;
            this.speed = 0;
            //change this maxSpeed variable to adjust scroll speed
            this.maxSpeed = 3;
            //create background from imported Background class
            this.background = new Background(this);
            //create player from imported Player class
            this.player = new Player(this);
            //create instance of InputHandler
            this.inputHandler = new InputHandler(this);
            //create UI
            this.UI = new UI(this);
            this.enemies = [];
            this.particles = [];
            this.collisions = [];
            this.floatingMsgs = []; 
            this.maxParticles = 200;
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.debug = false;
            this.score = 0;
            this.winningScore = 40;
            this.time = 0;
            this.maxTime = 30000;
            this.gameOver = false;
            this.fontColor = 'black';
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter(); 
            this.lives = 5;



        }
        addEnemy() {
            this.enemies.push(new FlyingEnemy(this));
        

           //only add ground enemies if player is moving
              if(this.speed > 0 && Math.random() < 0.5){
                this.enemies.push(new GroundEnemy(this));
              } else if (this.speed > 0){
                this.enemies.push(new ClimbingEnemy(this));
              }

        }

        update(deltaTime) {
            this.time += deltaTime;
            if(this.time > this.maxTime){
                this.gameOver = true;
            }
            this.background.update();
            this.player.update(this.inputHandler.keys, deltaTime);
            //handle enemies
            if (this.enemyTimer > this.enemyInterval) {
                this.addEnemy();
                this.enemyTimer = 0;

            } else {
                this.enemyTimer += deltaTime;
            }
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
            });

            //handle floating messages
            this.floatingMsgs.forEach((msg, index) => {
                msg.update();
            });

            //handle particles
            this.particles.forEach((particle, index) => {
                particle.update();
            });
            //limit particle count
            if(this.particles.length > this.maxParticles){
                this.particles.length = this.maxParticles;
            }

            //handle collisions sprites
            this.collisions.forEach((collision, index) => {
                collision.update(deltaTime);
              
            } );

            //filter out enemies that are marked for deletion
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);

            //filter out floating messages that are marked for deletion
            this.floatingMsgs = this.floatingMsgs.filter(msg => !msg.markedForDeletion);

            //filter out collision sprites that are marked for deletion
            this.collisions = this.collisions.filter(collision => !collision.markedForDeletion);

            //filter out particles that are marked for deletion
            this.particles = this.particles.filter(particle => !particle.markedForDeletion);



        }

        draw(context) {
            this.background.draw(context);
            this.player.draw(context);

            //draw enemies
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });

            //draw UI
            this.UI.draw(context);

            //draw floating messages
            this.floatingMsgs.forEach(msg => {
                msg.draw(context);
            });

            //draw particles
            this.particles.forEach(particle => {
                particle.draw(context);
            });

            //draw collision sprites
            this.collisions.forEach(collision => {
                collision.draw(context);
            });
        }
    }
    //create game instance
    const game = new Game(canvas.width, canvas.height);
 

    //hold timestamp value of prev animation loop
    let lastTime = 0;


    //animation loop
    function animate(timeStamp) {
        //calculate time since last frame
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        if(!game.gameOver){
        requestAnimationFrame(animate);
        }
    }
    animate(0);
}); 