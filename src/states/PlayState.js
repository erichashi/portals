function clickBlock(block, x, y){
    return(
        block.x  <= x && 
        block.x + block.width >= x &&
        block.y <= y &&
        block.y + block.height >= y
        );
}

class PlayState extends BaseState {

    constructor(){
        super();
    }

    enter(params){
        this.timeframe = 0;
        this.score = 0;
        this.time = TOTALTIME;

        this.ball = params.ball;
        this.target = params.target;
        this.portals = [];

        //pointer da array no proprio ball
        this.ball.portals = this.portals;

        this.portalid = 0;
        this.thereistwoportals = false;

        //pointer do ball nos muros
        walls.forEach(wall => wall.ball = this.ball)
    }

    update(){

        //TIMER
        this.timeframe++;
        //one second
        if(this.timeframe >= 60) {
            this.timeframe = 0;
            this.time--;
            gHTMLElements['time'].innerHTML = this.time;

            if(this.time <= 3) {
                gSounds['timebeep'].currentTime = 0;

                if(this.time>0) gSounds['timebeep'].play()

                else{ 
                    gSounds['timebeep'].pause();
                    gStateMachine.change('gameover', {
                        'score': this.score,
                        'ball': this.ball,
                    });
                }
            }
        }

        //MOUSE
        if(wasClicked()){
            for (let i = 0; i < 4; i++) {
                let block = walls[i];

                if (clickBlock(block, gMouse.x, gMouse.y)){

                    //se existem 2 portais, cortar o último
                    if(this.portals.length >= 2){                
                        //animação gsap
                        gsap.to(this.portals[0], {
                            radius: 0,
                            duration: 0.3, 
                            onComplete: () => {
                                this.portals.splice(0, 1);
                            }
                        });
                    } 

                    //vertical ou horizontal
                    if(block.height > block.width){
            
                        //centralizar o portal no muro
                        this.portals.push(new Portal(block.x + (block.width/2), gMouse.y, VERTICAL, this.portalid));
                        
                    } else {
            
                        //idem
                        this.portals.push(new Portal(gMouse.x, block.y + (block.height/2), HORIZONTAL, this.portalid));
                    };

                    this.portalid++; 
            
                    gSounds['touch'].currentTime = 0;
                    gSounds['touch'].play();
            
                    //aro branco
                    try{
                        this.portals[1].current = false;
                        this.ball.thereistwoportals = true;
                    } catch(e){
                        //caso em que existe 1 portal apenas
                        this.portals[0].current = false;
                    }

                    //break loop: nao da para clicar em dois muros
                    break;    
                };
                
            };
        }

        //MUROS
        walls.forEach(block => block.update()); 

        //QUADRADO
        this.target.update();

        //PORTAIS
        this.portals.forEach(portal => {
            //animação
            if(portal.first){
                portal.radius = 0;
                portal.first = false;
                gsap.to(portal, {
                    radius: Math.floor(BLOCKSIZE/2), 
                    duration: 0.1,
                    onComplete: () => {
                        portal.radius = Math.floor(BLOCKSIZE/2);
                    }
                })
            }
            portal.render()
        });    
        
        //BOLA
        this.ball.update();

    }
}
