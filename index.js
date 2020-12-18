const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const scoretext = document.getElementById('scoretext');
const timetext = document.getElementById('timetext');

const textcontainer = document.querySelector('.text-container');
const restartbtn = document.querySelector('.btn');
const recordspan = document.getElementById('record');


// Set width and heights
canvas.height = 600;
textcontainer.style.width = `${canvas.height}px`;
canvas.width = canvas.height;

//resizing
if(document.body.clientWidth < canvas.width){
    canvas.width = document.body.clientWidth *.9;
    canvas.height =  canvas.width;
    textcontainer.style.width = `${canvas.height}px`;
}

//frame to pause when resizing
let frame;


//handle clicks
let mouse = {
    x: 0,
    y: 0
}

//constantes (let por causa do resize)
let BLOCKSIZE = Math.floor(canvas.height/12);
let BALLRADIUS = Math.floor(BLOCKSIZE/4);

let FRICTION = 0.6;
let GRAVITY = BALLRADIUS/24;

const TARGETCOLOR = "#E7C823";
const SUBTARGETCOLOR = "#3498DB";
const BALLCOLOR = "orange";
let BGCOLOR = 'rgba(40,40,40,0.2)';

//Do not change
const HORIZONTAL = 1;
const VERTICAL = 2;

const TOTALTIME = 30;

let score = 0;
let time = TOTALTIME;
let record = 0;


let thereistwoportals = false;

//id para portais
let id=0;

function clickBlock(block){
    return(
        block.x  <= mouse.x && 
        block.x + block.width >= mouse.x &&
        block.y <= mouse.y &&
        block.y + block.height >= mouse.y
        )
}


let pause = true;
//only for development mode
// document.addEventListener('keydown', e =>{
//     if(e.keyCode === 32){
//         pause = !pause
//         update()
//     };
// } )


// Initialization
let ball;
let portals;
let walls;
let target;
let gameover = false;
function init(){
    score=0;
    time=TOTALTIME;
    gameover = false;

    portals = [];
    walls = [];
    target = new Target(canvas.width/4, canvas.height/2, BLOCKSIZE);
    ball = new Ball(canvas.width/2, canvas.height/2, BALLRADIUS, BALLCOLOR);
    drawScenario();
    scoretext.innerHTML = score;
    timetext.innerHTML = time;
    recordspan.innerHTML = record;

}

function drawScenario(){
    walls.push(new Wall(0, 0, canvas.width, BLOCKSIZE));
    walls.push(new Wall(0, 0, BLOCKSIZE, canvas.height));
    walls.push(new Wall(0, canvas.height-BLOCKSIZE, canvas.width, BLOCKSIZE));
    walls.push(new Wall(canvas.width-BLOCKSIZE, 0, BLOCKSIZE, canvas.height-BLOCKSIZE));

}

function restart(){
    gameover = true;
    restartbtn.style.opacity = ".3"
    if(score > record) record = score;
    gsap.to(ball, {
        delay: 1,
        x: canvas.width/2,
        y: canvas.height/2,
        onComplete: () => {
            init();
            BGCOLOR = 'rgba(40,40,40,1)';
            update();
            BGCOLOR = 'rgba(40,40,40,0.2)';
            pause=true;
        }
    })
}

let t=0;
function update(){
    ctx.fillStyle = BGCOLOR;
    ctx.fillRect(0,0,canvas.width, canvas.height);
    
    if(!gameover){
        t++;
        if(t >= 60) {
            t = 0;
            time--;
            timetext.innerHTML = time;
        }

        if(time <= 0) {
            restart();
        }

        if(portals.length === 2) thereistwoportals = true; else thereistwoportals = false;
        walls.forEach(block => block.update()); 

        target.update();

        portals.forEach(portal => {
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
            portal.draw()
        });    
        
        ball.update();
    } else {
        ball.draw();
    }
    

    if(!pause){   
        frame = requestAnimationFrame(update);
    };
}

init()
update();