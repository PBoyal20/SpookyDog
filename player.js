import { Sitting, Running, Jumping, Falling, Rolling, Diving, Hit } from './playerStates.js';
import { CollisionAnimation } from './collisionAnimation.js';
import { FloatingMsg } from './floatingMsg.js';


export class Player {
    constructor(game) {
        this.game = game;
        this.width = 100;
        this.height = 91.3;
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundHeight;
        this.vy = 0;
        this.gravity = 1;
        this.image = player;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame;
        this.fps = 20;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
        this.speed = 0;
        this.maxSpeed = 10;
        this.states = [new Sitting(this.game), new Running(this.game), new Jumping(this.game), new Falling(this.game)
            , new Rolling(this.game), new Diving(this.game), new Hit(this.game)];

    }

    update(input, deltaTime) {
        this.checkCollision();
        this.currentState.handleInput(input);
        //horizontal movement
        this.x += this.speed;
        if (input.includes('ArrowRight') || input.includes('SwipeRight') && this.currentState !== this.states[6]) {
            this.speed = this.maxSpeed;
        }
        else if (input.includes('ArrowLeft') || input.includes('SwipeLeft') && this.currentState !== this.states[6]) {
            this.speed = -this.maxSpeed;
        }
        else this.speed = 0;
        //add horizontal boundaries
        if (this.x < 0) this.x = 0;
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width;

        //vertical movement
        this.y += this.vy;

        if (!this.onGround()) {
            this.vy += this.gravity;
        }
        else this.vy = 0;

        //avoid falling through floor
        if (this.y > this.game.height - this.height - this.game.groundHeight) {
            this.y = this.game.height - this.height - this.game.groundHeight;
        }

        console.log(this.vy, this.onGround());



        //spirte animation
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) {
                this.frameX++;
            }
            else this.frameX = 0;
        }
        else {
            this.frameTimer += deltaTime;
        }
    }

    draw(context) {
        if (this.game.debug) {
            context.strokeRect(this.x, this.y, this.width, this.height);
        }
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height,
            this.x, this.y, this.width, this.height);
    }
    onGround() {
        return this.y === this.game.height - this.height - this.game.groundHeight;
    }

    setState(state, speed) {
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();
    }

    //collision detection
    checkCollision() {
        this.game.enemies.forEach(enemy => {
            if (
                enemy.x < this.x + this.width &&
                enemy.x + enemy.width > this.x &&
                enemy.y < this.y + this.height &&
                enemy.y + enemy.height > this.y

            ) {
                enemy.markedForDeletion = true;
                this.game.collisions.push(new CollisionAnimation(this.game, this.x + this.width * 0.5, this.y + this.height * 0.5));
                if (this.currentState === this.states[4] || this.currentState === this.states[5]) {
                    this.game.score++;
                    this.game.floatingMsgs.push(new FloatingMsg('+1', enemy.x, enemy.y, 120, 50));
                }
                else {
                    this.setState(6, 0);
                    this.game.lives--;
                    if (this.game.lives === 0) this.game.gameOver = true;
                }
            }
        });

    }
}
