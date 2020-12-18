//clicks
canvas.addEventListener('click', e => {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;

    
    if(pause) {
        pause = false; 
        restartbtn.style.opacity = "1"
        update();
    };

    //iterar sobre muros, se clicou, adicionar portal
    walls.forEach(block => { 
        if (clickBlock(block)){

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

//resize
window.addEventListener('resize', function(){
    
    canvas.height = 600 //Math.floor(document.body.clientHeight*.8);
    canvas.width = canvas.height;

    if(document.body.clientWidth < canvas.width){
        canvas.width = document.body.clientWidth *.9;
        canvas.height =  canvas.width;
    }

    textcontainer.style.width = `${canvas.height}px`;

    BLOCKSIZE = Math.floor(canvas.height/12);

    FRICTION = 0.6;
    GRAVITY = BALLRADIUS/24;
    
    BALLRADIUS = Math.floor(BLOCKSIZE/4);

    cancelAnimationFrame(frame)

    init();
    update();
} )