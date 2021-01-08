const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const main = document.querySelector('main')

const scoretext = document.getElementById('scoretext');
const timetext = document.getElementById('timetext');

const textcontainer = document.querySelector('.text-container');
const restartbtn = document.querySelector('.btn');
const recordspan = document.getElementById('record');

//audio
let touch = new Audio("sounds/pling.wav")
let done = new Audio("sounds/piece-of-cake.mp3")
let timebeep = new Audio("sounds/time.mp3")
let point = new Audio("sounds/hide-and-seek.mp3")
let entering = new Audio("sounds/juntos-607.mp3")
let bounce = new Audio("sounds/intuition-561.mp3")
bounce.volume = .5;


// Set width and heights
canvas.height = main.clientWidth;
canvas.width = canvas.height;


//constantes (let por causa do resize)
let BLOCKSIZE = Math.floor(canvas.height/12);
let BALLRADIUS = Math.floor(BLOCKSIZE/4);

let FRICTION = 0.6;
let GRAVITY = BALLRADIUS/24;

const TARGETCOLOR = "#E7C823";
const SUBTARGETCOLOR = "#3498DB";
const BALLCOLOR = "orange";
let BGCOLOR = 'rgba(40,40,40,0.2)';

const TOTALTIME = 30;

//Do not change
const HORIZONTAL = 1;
const VERTICAL = 2;

let pause = true;
//only for development mode
// document.addEventListener('keydown', e =>{
//     if(e.keyCode === 32){
//         pause = !pause
//         update()
//     };
// } )

//last score: valor minimo necessario para aparecer no ranking
let lastscore = 0;
async function getLastScore(){
    let response = await fetch('/api/scores');
    let data;
    try {
        data = await response.json();
        lastscore = data[data.length-1].score;
    } catch (e) {
        return;
    }

};

function drawScenario(){
    walls.push(new Wall(0, 0, canvas.width, BLOCKSIZE));
    walls.push(new Wall(0, 0, BLOCKSIZE, canvas.height));
    walls.push(new Wall(0, canvas.height-BLOCKSIZE, canvas.width, BLOCKSIZE));
    walls.push(new Wall(canvas.width-BLOCKSIZE, 0, BLOCKSIZE, canvas.height-BLOCKSIZE));

}


// Initialization
let ball;
let portals;
let walls;
let target;

let gameover = false;

let score = 0;
let time = TOTALTIME;

let thereistwoportals = false;

//id para portais
let portalid=0;

//variavel que acrescenta a cada frame
let timeframe=0;


async function restart(){
    done.currentTime = 0;
    done.play();

    gameover = true;

    //restart btn props
    restartbtn.style.opacity = ".3";
    restartbtn.style.cursor = "not-allowed";
    restartbtn.disabled = true;
    
    //local storage
    if(score > localStorage.getItem('r')){
        localStorage.setItem('r', score)
    };

    //se score estiver no acima do lastscore, postar score na API
    if (score >= lastscore) {
        let name = prompt("Parabéns: sua pontuação entrou na lista! Digite um nome para registrar");

        if(name){
            let data = {name, score}
            let options = {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }
    
            let response = await fetch('/api/scores', options);
            let djson = await response.json();
            console.log(djson);
        }

    }

    //gsap ball animation
    gsap.to(ball, {
        delay: 1.8,
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


function init(){
    score=0;
    time=TOTALTIME;
    gameover = false;
    thereistwoportals = false;

    portals = [];
    walls = [];
    target = new Target(canvas.width/4, canvas.height/2, BLOCKSIZE);
    ball = new Ball(canvas.width/2, canvas.height/2, BALLRADIUS, BALLCOLOR);


    drawScenario();
    scoretext.innerHTML = score;
    timetext.innerHTML = time;
    recordspan.innerHTML = localStorage.getItem('r') * 1;


}

function update(){
    ctx.fillStyle = BGCOLOR;
    ctx.fillRect(0,0,canvas.width, canvas.height);
    
    if(!gameover){

        //timer
        timeframe++;
        //one second
        if(timeframe >= 60) {
            timeframe = 0;
            time--;
            timetext.innerHTML = time;
            // timebeep.pause();
            // timebeep.currentTime = 0;

            if(time <= 3) {
                timebeep.currentTime = 0;
                if(time>0){timebeep.play()}
                else{ 
                    timebeep.pause();
                    restart(); 
                }
            }
        }


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


    } else ball.draw(); // ao perder, apenas desenhar a bola
    
    
    if(!pause){   
        requestAnimationFrame(update);
    };
}


document.addEventListener('DOMContentLoaded', ()=> {
    getLastScore();
    init()
    update();
});

//o jogo inicia no EventHandlers.js