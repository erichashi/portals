function clickBlock(block, x, y){
    return(
        block.x  <= x && 
        block.x + block.width >= x &&
        block.y <= y &&
        block.y + block.height >= y
        );
}

//clicks
canvas.addEventListener('click', e => {
    let mousex = e.offsetX;
    let mousey = e.offsetY;


    //aqui inicia o jogo
    if(pause) {
        pause = false; 
        restartbtn.style.opacity = "1";
        restartbtn.style.cursor = 'pointer';
        restartbtn.disabled = false;
        update();
    };

    //iterar sobre muros, se clicou, adicionar portal
    for (let i = 0; i < 4; i++) {
        let block = walls[i];

        if (clickBlock(block, mousex, mousey)){

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
    
                //centralizar o portal no muro
                portals.push(new Portal(block.x + (block.width/2), mousey, Math.floor(BLOCKSIZE/2), 'black', VERTICAL, portalid));
                
            } else {
    
                //idem
                portals.push(new Portal(mousex, block.y + (block.height/2), Math.floor(BLOCKSIZE/2), 'black', HORIZONTAL, portalid));
            };

            portalid++; 
    
            touch.currentTime = 0;
            touch.play();
    
            //aro branco
            try{
                portals[1].current = false;
                thereistwoportals = true;
            } catch(e){
                //caso em que existe 1 portal apenas
                portals[0].current = false;
            }

            //break loop: nao da para clicar em dois muros
            break;    
        };
        
    };

    
})