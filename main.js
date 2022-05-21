const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const virtualWidth = 550;
const virtualHeight = 550;
let canvas_height = 0;
let canvas_width = 0;
let scaleFactor = 0;

let gSounds = {};
window.onload = () => {

    // Set width and heights
    canvas_height = gHTMLElements['main'].clientWidth;
    canvas_width = canvas_height;

    scaleFactor = virtualHeight / canvas_height;

    canvas.width = virtualWidth;
    canvas.height = virtualHeight;

    canvas.style.width = `${canvas_width}px`;
    canvas.style.height = `${canvas_height}px`;

    preload({
        'touch': "assets/sounds/pling.wav",
        'done': "assets/sounds/piece-of-cake.mp3",
        'timebeep': "assets/sounds/time.mp3",
        'point': "assets/sounds/hide-and-seek.mp3",
        'entering': "assets/sounds/juntos-607.mp3",
        'bounce': "assets/sounds/intuition-561.mp3",
    }, () => {
        gSounds['bounce'].volume = .5;
        create()
        update();
    });
}

function preload(audiofiles, callback){
    let val = 0;
    let goal = Object.keys(audiofiles).length; 

    Object.keys(audiofiles).forEach(audiokeys => {
        let audio = new Audio(audiofiles[audiokeys]);
        gSounds[audiokeys] = audio;
        val++;
        if(val >= goal) callback();
    });

}



//only for development mode
document.addEventListener('keydown', e =>{
    if(e.keyCode === 32 & e.ctrlKey){
        pause = !pause
        update()
    };
});


//Event listeners
canvas.addEventListener('click', e => {
    gMouse = {
        x: e.offsetX * scaleFactor,
        y: e.offsetY * scaleFactor,
    }
    //so para o stateMachine['title']
    gStateMachine.current.init();

    clicked = true;
});

function wasClicked(){
    return clicked;
}


//restart button html
function restart(){
    gStateMachine.change('gameover', {
        'score': gStateMachine.current.score,
        'ball': gStateMachine.current.ball,
    });
}

//helpers
function drawScenario(){
    walls.push(new Wall(0, 0, canvas.width, BLOCKSIZE));
    walls.push(new Wall(0, 0, BLOCKSIZE, canvas.height));
    walls.push(new Wall(0, canvas.height-BLOCKSIZE, canvas.width, BLOCKSIZE));
    walls.push(new Wall(canvas.width-BLOCKSIZE, 0, BLOCKSIZE, canvas.height-BLOCKSIZE));

}


let pause = true;
let gStateMachine;
let clicked = false;
let walls = [];
let gMouse = {x: 0, y: 0};

function create(){

    drawScenario();

    gStateMachine = new StateMachine({
        title: () => new TitleState(),
        play: () => new PlayState(),
        gameover: () => new GameOverState()
    })
    gStateMachine.change('title')

    if(!localStorage.getItem('record_portals')) localStorage.setItem('record_portals', 0)
    gHTMLElements['recordspan'].innerHTML = localStorage.getItem('record_portals') * 1;

}

function update(){
    ctx.fillStyle = BGCOLOR;
    ctx.fillRect(0,0,canvas.width, canvas.height);
    
    gStateMachine.update();

    clicked = false;

    if(!pause){   
        requestAnimationFrame(update);
    };
}
