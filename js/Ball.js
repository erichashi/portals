//Helper functions

//true if ball touches portal. false otherwise
function touchPortal(x, y, radius, portal){
    if(portal.position === HORIZONTAL){
        if( x + radius <= portal.radius + portal.x &&
            x - radius >= portal.x - portal.radius){
   
                if(portal.more) return (y + radius >= portal.y - portal.radius);

                else return ( y - radius <= portal.y + portal.radius);

            } else return false
                
    } else { // vertical

        if (y + radius <= portal.radius + portal.y &&
            y - radius >= portal.y - portal.radius){

                //DIREITA
                if(portal.more) return (x + radius >= portal.x - portal.radius);

                //ESQUERDA
                else return (x - radius <= portal.x + portal.radius)

            } else return false;
    }
}
//set position para o portal-saída depois de teleportar
function setPosition(other){
    if(other.more && other.position === HORIZONTAL){
        ball.x = other.x
        ball.y = other.y - other.radius - ball.radius
    } 
    
    else if(!other.more && other.position === HORIZONTAL) {
        ball.x = other.x
        ball.y = other.y + other.radius + ball.radius
    }

    else if(other.more && other.position === VERTICAL) {
        ball.x = other.x - other.radius - ball.radius
        ball.y = other.y
    }

    else {
        ball.x = other.x + other.radius + ball.radius
        ball.y = other.y;
    }
}
//mudar as velocidades depois de teleportar
function setVelocities(portal, other, vx, vy){
    
    //Se H-H ou V-V e mesmo lado
    if(portal.position === other.position && portal.more === other.more) { //H-H / V-V  
        if(portal.position === HORIZONTAL) ball.vel.y *= -1;
        else ball.vel.x *= -1 
    } 
    
    
    if(portal.position !== other.position) { // H-V
        let f1 = 1;
        let f2 = 1;

        if(other.position === VERTICAL && other.more ) {
            //lado direito
            //velocidade x negativa
            f1= -1;
        } 

        if(other.position === HORIZONTAL && other.more){
            //baixo
            //vel y -
            f2 = -1;
        }

        ball.vel.x = Math.abs(vy) * f1;
        ball.vel.y = Math.abs(vx) * f2;     
    }

}
//teleportar (setPosition + setVelocities)
function teleport(portal, other){
    let prevvelx = ball.vel.x;
    let prevvely = ball.vel.y;

    setPosition(other);    
    setVelocities(portal, other, prevvelx, prevvely);

    ball.teleporting = false;
    ball.teleportenable = false;

}
//recebe um portal, retorna o outro
function getOtherPortal(portal){
    for (let i = 0; i < portals.length; i++) {
        if(portal.id !== portals[i].id){
            return portals[i];
        };
    };
};

function Ball(x, y, radius, color){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;

    //booleans para liberar ou não a passagem
    this.teleporting = false;
    this.teleportenable = true; //teleport enable

    //time to teleport
    this.ttt = 0;

    this.vel = {
        x:0,
        y:0
    }

    //portal in
    this.in = undefined;
    //portal out
    this.out = undefined;

    this.update = function(){

        this.x += this.vel.x;
        this.y += this.vel.y;
        this.vel.y += GRAVITY;  

        //se não estiver teleportando, teportar permitido e existem 2 portais
        //ou seja, se estiver no estado normal
        if(!this.teleporting && this.teleportenable && thereistwoportals){

            //checar colisão com portal
            portals.forEach(port => {
                if(touchPortal(this.x, this.y, this.radius, port)){

                    //setar in e out portals
                    this.in = port;
                    this.out = getOtherPortal(port);

                    ball.teleporting = true; 
                }
            })
        } 

        //pedaço de código que potencialmente seja comprimido
        if(this.teleporting){
            // this.out = getOtherPortal(this.in);
            teleport(this.in, this.out)
        } 
        
        //depois de 10 frames, pode teleportar de novo
        if(!this.teleportenable){
            this.ttt++;
            if(this.ttt >= 10){
                this.ttt = 0;
                this.teleportenable = true;
                this.teleporting = false;
            }
        } 

        
        this.draw();
    }

    this.draw = function(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fillStyle = this.color;
        ctx.fill();    
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;    
        ctx.stroke();    
        ctx.closePath();
    }
}
