const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set width and heights
canvas.height = 600 //Math.floor(document.body.clientHeight*.8);
canvas.width = canvas.height;

//resizing
if(document.body.clientWidth < canvas.width){
    canvas.width = document.body.clientWidth *.9;
    canvas.height =  canvas.width;
}

//resizing
let frame;
window.addEventListener('resize', function(){
    
    canvas.height = 600 //Math.floor(document.body.clientHeight*.8);
    canvas.width = canvas.height;

    if(document.body.clientWidth < canvas.width){
        canvas.width = document.body.clientWidth *.9;
        canvas.height =  canvas.width;
    }

    BLOCKSIZE = Math.floor(canvas.height/12);

    FRICTION = 0.6;
    GRAVITY = BALLRADIUS/24;
    
    BALLRADIUS = Math.floor(BLOCKSIZE/4);

    cancelAnimationFrame(frame)

    init();
    update();
} )


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
const BGCOLOR = 'rgba(40,40,40,0.2)';

//Do not change
const HORIZONTAL = 1;
const VERTICAL = 2;

let thereistwoportals = false;

//id para portais
let id=0;

canvas.addEventListener('click', e => {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;

    //se existem 2 portais, cortar o último
    if(portals.length >= 2){
        //animação gsap
        gsap.to(portals[0], {
            radius: 0,
            duration: 0.3, 
            onComplete: () => {
                portals.splice(0, 1);
            }
        });
    } 

    //iterar sobre muros, se clicou, adicionar portal
    walls.forEach(block => { 
        if (clickBlock(block)){

            //vertical ou horizontal
            if(block.height > block.width){
            
                portals.push(new Portal(block.x + (block.width/2), mouse.y, Math.floor(BLOCKSIZE/2), 'black', VERTICAL, id));
                
            } else {
                portals.push(new Portal(mouse.x, block.y + (block.height/2), Math.floor(BLOCKSIZE/2), 'black', HORIZONTAL, id));
            };
            id++; 
            try{
                portals[1].current = false;
            } catch(e){
                portals[0].current = false;
            }
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


//only for development mode
// let pause = true;
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
function init(){
    portals = [];
    walls = [];
    target = new Target(canvas.width/4, canvas.height/2, BLOCKSIZE);
    ball = new Ball(canvas.width/2, canvas.height/2, BALLRADIUS, BALLCOLOR);
    drawScenario();
}

function drawScenario(){
    walls.push(new Wall(0, 0, canvas.width, BLOCKSIZE));
    walls.push(new Wall(0, 0, BLOCKSIZE, canvas.height));
    walls.push(new Wall(0, canvas.height-BLOCKSIZE, canvas.width, BLOCKSIZE));
    walls.push(new Wall(canvas.width-BLOCKSIZE, 0, BLOCKSIZE, canvas.height-BLOCKSIZE));

}

function update(){
    ctx.fillStyle = BGCOLOR;
    ctx.fillRect(0,0,canvas.width, canvas.height);

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

    // if(!pause){   
        frame = requestAnimationFrame(update);
    // };
}

init()
update();