class TitleState extends BaseState {

    constructor(){
        super();

        this.ball = new Ball(canvas.width/2, canvas.height/2);
        this.target = new Target(canvas.width/4, canvas.height/2, this.ball);

        gHTMLElements['score'].innerHTML = 0;
        gHTMLElements['time'].innerHTML = TOTALTIME;

    }
    
    update(){
        walls.forEach(block => {
            block.render();
        });
        this.target.render();
        this.ball.render();
    }

    //inicio do jogo
    init() {
        pause = false; 
        gHTMLElements['restartbtn'].style.opacity = "1";
        gHTMLElements['restartbtn'].style.cursor = 'pointer';
        gHTMLElements['restartbtn'].disabled = false;
        gStateMachine.change('play', {
            'ball': this.ball, 
            'target': this.target
        });
        update();
        
    }
}
