class Enemy{
    constructor(){
        this.frameX = 0;
        this.frameY = 0;
        this.fps = 20;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
        this.markedForDeletion = false;
    }
    update(deltaTime){
        //general enemy movement
        this.x -= this.speedX + this.game.speed;
        this.y += this.speedY;
        //general spirte animation
        if(this.frameTimer > this.frameInterval){
            this.frameTimer = 0;
            if(this.frameX < this.maxFrame){
                this.frameX++;
            }
            else this.frameX = 0;
        }
        else {
            this.frameTimer += deltaTime;
        }
        //check if enemy is off screen
       if(this.x + this.width < 0) this.markedForDeletion = true;
    }
    draw(context){
        if(this.game.debug){
            context.strokeRect(this.x, this.y, this.width, this.height);
        }
        context.drawImage(this.image, this.frameX * this.width , 0, this.width, this.height,
             this.x, this.y, this.width, this.height);
    }
}

export class FlyingEnemy extends Enemy {
    constructor(game){
        super();
       this.game = game;
       this.width = 60;
       this.height = 44;
       this.x = this.game.width + Math.random() * this.game.width * 0.5;
       this.y = Math.random() * (this.game.height * 0.5);
       this.speedX = Math.random() + 1;
       this.speedY = 0;
       this.maxFrame = 5;
       this.image = fly;
       this.angle = 0;
       this.angleSpeed = Math.random() * 0.1 + 0.1;
    }
    update(deltaTime){
        super.update(deltaTime);
        //flying enemy specific movement
        this.angle += this.angleSpeed;
        this.y += Math.sin(this.angle);

    }
    
}

export class GroundEnemy extends Enemy {
    constructor(game){
        super();
        this.game = game;
        this.width = 60;
        this.height = 87;
        this.x = this.game.width;
        this.y = this.game.height - this.height - this.game.groundHeight;
        this.image = plant;
        this.speedX = 0;
        this.speedY = 0;
        this.maxFrame = 1;

    }
    
}

export class ClimbingEnemy extends Enemy {
    constructor(game){
        super();
        this.game = game;
        this.width = 120;
        this.height = 144;
        this.x = this.game.width;
        this.y = Math.random() * (this.game.height * 0.5);
        this.image = big_spider;
        this.speedX = 0;
        this.speedY =Math.random() > 0.5 ? 1 : -1
        this.maxFrame = 5;
    }
    update(deltaTime){
        super.update(deltaTime);
        //climbing enemy specific movement
        if(this.y > this.game.height - this.height - this.game.groundHeight){
            this.speedY = -1;
        }
        if(this.y < -this.height){
            this.markedForDeletion = true;
        }
    }

    draw(context){
        super.draw(context);
        //draw web
        context.beginPath();
        context.moveTo(this.x + this.width/2,0)
        context.lineTo(this.x + this.width/2, this.y + 50);
        context.stroke();
    }
    
}