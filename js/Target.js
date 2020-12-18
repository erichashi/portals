//Helper

//return true if block touches "block" (target or sub)
function touchTarget(block, width, height){
    return (
        ball.y + ball.radius >= block.y && 
        ball.y - ball.radius <= block.y + height  && 
        ball.x + ball.radius >= block.x &&
        ball.x - ball.radius <= block.x + width
    )
}

function Target(x, y, size){
    this.x = x;
    this.y = y;
    this.size = size;
    this.on = true;
    
    //área em azul
    this.sub = {
        //valores iniciais são o target inteiro
        x: this.x,
        y: this.y,
        height: this.size,
        width: this.size,
    };
    
    //side of sub area (1: topo, 2: dir, 3: baixo, 4: esq)
    this.side = 0;

    //new position após ser acertado pela bola
    this.newpos = () => {
        this.x = Math.floor(randomFromRange(BLOCKSIZE*2, canvas.width-BLOCKSIZE*2));
        this.y = Math.floor(randomFromRange(BLOCKSIZE*2, canvas.height-BLOCKSIZE*2));
        this.side = Math.floor(randomFromRange(1, 5));
        gsap.to( this, {
            size: size,
            onComplete: ()=>{
                this.size = size;
            }
        });

        //valores de side
        switch(this.side){
            case(1):
                this.sub = {
                    x: this.x,
                    y: this.y,
                    width: size,
                    height: size/4,
                }
                break;
            case(2):
                this.sub = {
                    x: this.x + 3*size/4,
                    y: this.y,
                    width: size/4,
                    height: size,
                }
                break;
            case(3):
                this.sub = {
                    x: this.x,
                    y: this.y + 3*size/4,
                    width: size,
                    height: size/4,
                }
                break;
            case(4):
                this.sub = {
                    x: this.x,
                    y: this.y,
                    width: size/4,
                    height: size,
                }
                break;
        }

        this.on = true
        score++;
        scoretext.innerHTML = score;
        // score++;

    }

    this.update = () => {
        this.draw();
        
        // se encostou no cubo
        if(touchTarget(this, this.size, this.size) ){

            // se encostou no sub
            if( touchTarget(this.sub, this.sub.width, this.sub.height) && this.on){
                point.play();
                this.on = false;
                gsap.to( this, {
                    size: 0,
                        // duration = 0.1,
                    });
                    
                    gsap.to(this.sub, {
                        height:0,
                        width:0,
                        onComplete: ()=>{
                            this.newpos();
                        }
                    });
            } 


            ball.vel.y *= -FRICTION;
            ball.vel.x += -randomFromRange(-5, 5);    

        }
    }

    this.draw = () => {
        ctx.beginPath();
        ctx.strokeStyle = 'black';
        
        ctx.fillStyle = TARGETCOLOR;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.strokeRect(this.x, this.y, this.size, this.size);

        ctx.fillStyle = SUBTARGETCOLOR;
        ctx.fillRect(this.sub.x, this.sub.y, this.sub.width, this.sub.height);
        ctx.strokeRect(this.sub.x, this.sub.y, this.sub.width, this.sub.height);

        ctx.stroke();
        ctx.fill();
        
        ctx.closePath();
        // ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
    }

}