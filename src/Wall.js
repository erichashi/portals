class Wall {
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    update (){

        if(!this.ball.teleporting && this.ball.teleportenable){

            
            if(this.width > this.height){ // vertical colision (=)

                if(this.y > canvas.height/2){ // baixo
                    
                    if(BALLRADIUS + this.ball.y >= this.y ){
                        this.ball.y = this.y - BALLRADIUS;
                        this.ball.vel.y *= -FRICTION;
                        
                        gSounds['bounce'].currentTime = 0;
                        gSounds['bounce'].play();
                    } 

                } else { // up
                    
                    if(this.ball.y - BALLRADIUS <= this.y + this.height ){
                        this.ball.y = this.y + this.height + BALLRADIUS; 
                        this.ball.vel.y *= -FRICTION;
                        gSounds['bounce'].currentTime = 0;
                        gSounds['bounce'].play();
                    } 
                    

                }
                 
            } else { // horizontal colison (||)
                

                if(this.x < canvas.width/2){ // left
                    
                    if(this.ball.x - BALLRADIUS <= this.x + this.width ){
                        this.ball.x = this.x + this.width + BALLRADIUS; 
                        this.ball.vel.x *= -FRICTION;
                        gSounds['bounce'].currentTime = 0;
                        gSounds['bounce'].play();
                    } 
                    
                } else { // right
                    
                    if(this.ball.x + BALLRADIUS >= this.x){
                        this.ball.x = this.x - BALLRADIUS;
                        this.ball.vel.x *= -FRICTION;

                        gSounds['bounce'].currentTime = 0;
                        gSounds['bounce'].play();
                    } 
                    
                }
            }

        }
    

        this.render();

    }

    render() {   
        ctx.beginPath();
        ctx.fillStyle = WALLCOLOR;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fill();
        ctx.stroke();    
        ctx.closePath();
    }
}
