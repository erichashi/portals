

function Wall(x, y, width, height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.update = () => {

        if(!ball.teleporting && ball.teleportenable){

            
            if(this.width > this.height){ // vertical colision (=)

                if(this.y > canvas.height/2){ // baixo
                    
                    if(ball.radius + ball.y >= this.y ){
                        ball.y = this.y - ball.radius;
                        ball.vel.y *= -FRICTION;
                    } 
                    
                } else { // up
                    
                    if(ball.y - ball.radius <= this.y + this.height ){
                        ball.y = this.y + this.height + ball.radius; 
                        ball.vel.y *= -FRICTION;
                    } 
                    
                }
                 
            } else { // horizontal colison (||)
                
                if(this.x < canvas.width/2){ // left
                    
                    if(ball.x - ball.radius <= this.x + this.width ){
                        ball.x = this.x + this.width + ball.radius; 
                        ball.vel.x *= -FRICTION;
                    } 
                    
                } else { // right
                    
                    if(ball.x + ball.radius >= this.x){
                        ball.x = this.x - ball.radius;
                        ball.vel.x *= -FRICTION;
                    } 
                    
                }
            }

        }
    

        this.draw();

    }
    this.draw = () => {   
        ctx.beginPath();
        ctx.fillStyle = 'rgba(32, 30, 119)';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fill();
        ctx.stroke();    
        ctx.closePath();
    }
}
