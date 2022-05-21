class GameOverState extends BaseState{
    constructor(){
        super();
    }

    enter(params){
        this.ball = params.ball;

        gSounds['done'].currentTime = 0;
        gSounds['done'].play();


        //restart btn props
        gHTMLElements['restartbtn'].style.opacity = ".3";
        gHTMLElements['restartbtn'].style.cursor = "not-allowed";
        gHTMLElements['restartbtn'].disabled = true;

        //local storage
        if(params.score > localStorage.getItem('record_portals')*1) {    
            localStorage.setItem('record_portals', params.score)
            gHTMLElements['recordspan'].innerHTML = params.score;

        }

        //gsap ball animation
        gsap.to(this.ball, {
            delay: 1.8,
            x: canvas.width/2,
            y: canvas.height/2,
            onComplete: () => {
                gStateMachine.change('title');
                BGCOLOR = 'rgba(40,40,40,1)';
                update();
                BGCOLOR = 'rgba(40,40,40,0.2)';
                pause=true;
            }
        });

    }

    update(){
        this.ball.render();
    }
}
