export class InputHandler{
    constructor(game){
        this.game = game;
        this.keys = [];
        this.touchY = '';
        this.touchX = '';
        this.touchThreshold = 30;
        window.addEventListener('keydown', e => {
            if((e.key === 'ArrowDown' ||
               e.key === 'ArrowUp' ||
               e.key === 'ArrowLeft' ||
               e.key === 'ArrowRight' ||
               e.key == 'Enter')
             && this.keys.indexOf(e.key) === -1){
                this.keys.push(e.key);
             }
             else if(e.key =='d'){
                this.game.debug = !this.game.debug;
             }
         
        });

        window.addEventListener('keyup', e => {
            if(e.key === 'ArrowDown' ||
               e.key === 'ArrowUp' ||
               e.key === 'ArrowLeft' ||
               e.key === 'ArrowRight' ||
               e.key == 'Enter'){
                this.keys.splice(this.keys.indexOf(e.key),1);
             }
            
        });

         window.addEventListener('touchstart', e => {
               this.touchY = e.changedTouches[0].pageY;
               this.touchX = e.changedTouches[0].pageX;
         });

         window.addEventListener('touchmove', e => {
            const swipeDistanceY = e.changedTouches[0].pageY - this.touchY;
            const swipeDistanceX = e.changedTouches[0].pageX - this.touchX;

            if(swipeDistanceY < -this.touchThreshold && this.keys.indexOf('SwipeUp') === -1){
                this.keys.push('SwipeUp');
            }
            else if(swipeDistanceY > this.touchThreshold && this.keys.indexOf('SwipeDown') === -1){
                this.keys.push('SwipeDown');

                //add possible swipe down to restart game here   
            }  

            if (swipeDistanceX < -this.touchThreshold && this.keys.indexOf('SwipeLeft') === -1){
               this.keys.push('SwipeLeft');
            }
            else if(swipeDistanceX > this.touchThreshold && this.keys.indexOf('SwipeRight') === -1){
               this.keys.push('SwipeRight');
            }
         });

         window.addEventListener('touchend', e => {
            this.keys.splice(this.keys.indexOf('SwipeUp'),1);
            this.keys.splice(this.keys.indexOf('SwipeDown'),1);
            this.keys.splice(this.keys.indexOf('SwipeLeft'),1);
            this.keys.splice(this.keys.indexOf('SwipeRight'),1);
         });
    }
}
