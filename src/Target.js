//return true if block touches "block" (target or sub)
function touchTarget(ballx, bally, blockx, blocky, width,height){
    return (
        bally + BALLRADIUS >= blocky && 
        bally - BALLRADIUS <= blocky + height  && 
        ballx + BALLRADIUS >= blockx &&
        ballx - BALLRADIUS <= blockx + width
    )
}

class Target{
    constructor(x, y, ball){
        this.x = x;
        this.y = y;
        this.ball = ball;

        this.size = BLOCKSIZE;

        this.on = true;
        
        //área em azul
        this.sub = {
            //valores iniciais são o target inteiro
            x: this.x,
            y: this.y,
            height: BLOCKSIZE,
            width: BLOCKSIZE,
        };
        
        //side of sub area (1: topo, 2: dir, 3: baixo, 4: esq)
        this.side = -1;
    }

    //new position após ser acertado pela bola
    newpos() {
        this.x = Math.floor(randomFromRange(BLOCKSIZE*2, canvas.width-BLOCKSIZE*2));
        this.y = Math.floor(randomFromRange(BLOCKSIZE*2, canvas.height-BLOCKSIZE*2));

        this.side = Math.floor(randomFromRange(1, 5));

        gsap.to( this, {
            size: BLOCKSIZE,
            onComplete: ()=>{
                this.size = BLOCKSIZE;
            }
        });

        //valores de side
        switch(this.side){
            case(1):
                this.sub =  {
                    x: this.x,
                    y: this.y,
                    width: BLOCKSIZE,
                    height: BLOCKSIZE/4,
                }
                break;
            case(2):
                this.sub = {
                    x: this.x + 3*BLOCKSIZE/4,
                    y: this.y,
                    width: BLOCKSIZE/4,
                    height: BLOCKSIZE,
                }
                break;
            case(3):
                this.sub = {
                    x: this.x,
                    y: this.y + 3*BLOCKSIZE/4,
                    width: BLOCKSIZE,
                    height: BLOCKSIZE/4,
                }
                break;
            case(4):
                this.sub = {
                    x: this.x,
                    y: this.y,
                    width: BLOCKSIZE/4,
                    height: BLOCKSIZE,
                }
                break;
        }

        this.on = true
        gStateMachine.current.score++;
        scoretext.innerHTML = gStateMachine.current.score;

    }

    update(){
        this.render();
        
        // se encostou no cubo
        if(touchTarget(this.ball.x, this.ball.y, this.x, this.y, BLOCKSIZE, BLOCKSIZE) ){

            // se encostou no sub
            if( touchTarget(this.ball.x, this.ball.y, this.sub.x, this.sub.y, this.sub.width, this.sub.height ) && this.on){
                gSounds['point'].play();
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


            // this.ball.vel.y *= -FRICTION;
            // this.ball.vel.x += -randomFromRange(-5, 5);    

            this.ball.vel.y *= -FRICTION;
            this.ball.vel.x *= -1;

        }
    }

    render() {
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
    }

}