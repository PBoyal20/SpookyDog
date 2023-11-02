class Layer{
    constructor(game, width, height, speedModifier, image){
        this.game = game;
        this.width = width;
        this.height = height;
        this.speedModifier = speedModifier;
        this.image = image;
        this.x = 0;
        this.y = 0;
    }
    update(){
        if (this.x <  -this.width){
         this.x = 0;
        }
        else {
            this.x -= this.game.speed * this.speedModifier;
        }
    }

    draw(context){
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }

}

export class Background{
    constructor(game){
        this.game = game;
        this.width = 1667;
        this.height = 500;
        this.layer1img = layer1;
        this.layer2img = layer2;
        this.layer3img = layer3;
        this.layer4img = layer4;
        this.layer5img = layer5;

        this.layer1 = new Layer(this.game, this.width, this.height, 0, layer1);
        this.layer2 = new Layer(this.game, this.width, this.height, 0.2, layer2);
        this.layer3 = new Layer(this.game, this.width, this.height, 0.4,layer3);
        this.layer4 = new Layer(this.game, this.width, this.height, 0.8, layer4);
        this.layer5 = new Layer(this.game, this.width, this.height, 1, layer5);

        this.BackgroundLayers = [this.layer1, this.layer2, this.layer3, this.layer4, this.layer5];

    }
    update(){
        this.BackgroundLayers.forEach(layer => {
            layer.update()});
    }
    draw(context){
        this.BackgroundLayers.forEach(layer => {
            layer.draw(context)});
    }
}