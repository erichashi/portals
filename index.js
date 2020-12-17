const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const bg = document.getElementById('bg');
// Set width and heights
// canvas.height = innerHeight;
// canvas.width = innerWidth;

// Global Variables
var mouse = {
    x: undefined,
    y: undefined
}

var pause = true;

const BLOCKSIZE = 50;

const HORIZONTAL = 1;
const VERTICAL = 2;

const FRICTION = 0.6;
const GRAVITY = 0.5;

let id=0;

// Event Listeners
canvas.addEventListener('click', e => {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;

    if(portals.length >= 2){
        gsap.to(portals[0], {
            radius: 0,
            duration: 0.3, 
            onComplete: () => {
                portals.splice(0, 1);
            }
        });
    };

    walls.forEach(block => { 
        if (clickBlock(block)){
            if(block.height > block.width){
                portals.push(new Portal(block.x + (block.width/2), mouse.y, BLOCKSIZE/25, 'black', VERTICAL, id));
                
            } else {
                portals.push(new Portal(mouse.x, block.y + (block.height/2), BLOCKSIZE/25, 'black', HORIZONTAL, id));
            };
            id++;
        };
    });
}) 

function clickBlock(block){
    return(
        block.x  <= mouse.x && 
        block.x + block.width >= mouse.x &&
        block.y <= mouse.y &&
        block.y + block.height >= mouse.y
        )
}

// window.addEventListener('resize',function(){
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;

//     init();
// } )


document.addEventListener('keydown', e =>{
    if(e.keyCode === 32){
        pause = !pause
        update()
    };
} )


// Helpers

// Objects


// Initialization

function getDistance(x1, y1, x2, y2){
    let xdist = x2-x1;
    let ydist = y2-y1;

    return Math.sqrt(Math.pow(xdist, 2) + Math.pow(ydist, 2));
}

function Basket(x, y, size){
    this.x = x;
    this.y = y;
    this.size = size;

    this.update = () => {
        this.draw();
        
        if(ball.y > this.y){ // baixo da bola
            if(getDistance(this.x, this.y, ball.x, ball.y) - this.radius - ball.radius - 3 <= 0){
                // pause=true;
                ball.vel.y *= -FRICTION;
                ball.vel.x *= -FRICTION;
            };
        
        } else {

            if(getDistance(this.x, this.y, ball.x, ball.y) - this.radius/2  <= 0){

                // pause=true;
                // console.log('ver');
                ball.vel.y *= -FRICTION;
                ball.vel.x *= -FRICTION;
            };
        };

    }

    this.draw = () => {
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.arc(this.x, this.y, this.radius, 0 , Math.PI)
        // ctx.arc(this.x, this.y, this.radius, 0 , Math.PI)
        ctx.stroke();
        ctx.closePath();
    }

}


let ball;
let portals;
let walls;
let basket;
function init(){
    portals = [];
    walls = [];
    basket = new Basket(canvas.width/4, canvas.height/2, 20);
    ball = new Ball(canvas.width/2, canvas.height/2, 10, 'orange');
    drawScenario();
}

function drawScenario(){
    walls.push(new Wall(0, 0, canvas.width, BLOCKSIZE));
    walls.push(new Wall(0, 0, BLOCKSIZE, canvas.height));
    walls.push(new Wall(0, canvas.height-BLOCKSIZE, canvas.width, BLOCKSIZE));
    walls.push(new Wall(canvas.width-BLOCKSIZE, 0, BLOCKSIZE, canvas.height-BLOCKSIZE));

}

function update(){
    ctx.fillStyle = 'rgba(40,40,40,0.2)';
    ctx.fillRect(0,0,canvas.width, canvas.height);
    // ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
    
    walls.forEach(block => block.update()); 

    basket.update();

    portals.forEach(portal => {
        if(portal.first){
            portal.radius = 0;
            portal.first = false;
            gsap.to(portal, {
                radius: 25, 
                duration: 0.1,
                onComplete: () => {
                    portal.radius = 25;
                }
            })
        }
        portal.draw()
    });    
    
    ball.update();

    if(!pause){   
        requestAnimationFrame(update);
    };
}

init()
update();