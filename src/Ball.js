//Helper functions

//true if ball touches portal. false otherwise
function touchPortal(x, y, portal){

    if(portal.position === HORIZONTAL){
        if( x + BALLRADIUS <= portal.radius+ portal.x &&
            x - BALLRADIUS >= portal.x - portal.radius){
   
                //BAIXO
                if(portal.more) return (y + BALLRADIUS + 2 >= portal.y - portal.radius);

                //TOPO
                else return ( y - BALLRADIUS <= portal.y + portal.radius);

            } else return false
                
    } else { // vertical
        if (y + BALLRADIUS <= portal.radius+ portal.y &&
            y - BALLRADIUS >= portal.y - portal.radius){

                //DIREITA
                if(portal.more) return (x + BALLRADIUS >= portal.x - portal.radius);

                //ESQUERDA
                else return (x - BALLRADIUS <= portal.x + portal.radius)

            } else return false;
    }
}
//set position para o portal-saída depois de teleportar
function setPosition(other, ball){
    if(other.more && other.position === HORIZONTAL){
        ball.x = other.x
        ball.y = other.y - other.radius - BALLRADIUS
    } 
    
    else if(!other.more && other.position === HORIZONTAL) {
        ball.x = other.x
        ball.y = other.y + other.radius + BALLRADIUS
    }

    else if(other.more && other.position === VERTICAL) {
        ball.x = other.x - other.radius - BALLRADIUS
        ball.y = other.y
    }

    else {
        ball.x = other.x + other.radius + BALLRADIUS
        ball.y = other.y;
    }
}
//mudar as velocidades depois de teleportar
function setVelocities(portal, other, vx, vy, ball){
    
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
function teleport(portal, other, ball){
    gSounds['entering'].currentTime = 0;
    gSounds['entering'].play();
    let prevvelx = ball.vel.x;
    let prevvely = ball.vel.y;

    setPosition(other, ball);    
    setVelocities(portal, other, prevvelx, prevvely, ball);

    ball.teleporting = false;
    ball.teleportenable = false;

}
//recebe um portal, retorna o outro
function getOtherPortal(portal, portals){
    for (let i = 0; i < portals.length; i++) {
        if(portal.id !== portals[i].id){
            return portals[i];
        };
    };
};

class Ball {
    constructor(x, y){
        this.x = x;
        this.y = y;
    
        //booleans para liberar ou não a passagem
        this.teleporting = false;
        this.teleportenable = true; //teleport enable
        this.thereistwoportals = false;
    
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
    }

    update(){

        this.x += this.vel.x;
        this.y += this.vel.y;
        this.vel.y += GRAVITY;  

        //se nao estiver teleportando, teportar permitido e existem 2 portais
        //ou seja, se estiver no estado normal
        if(!this.teleporting && this.teleportenable && this.thereistwoportals){

            //checar colisão com portal
            for (let i = 0, len = this.portals.length; i < len; i++) {

                let port = this.portals[i];

                if(touchPortal(this.x, this.y, port)){
                    //setar in e out portals
                    this.in = port;
                    this.out = this.portals.filter(p => p.id !== port.id)[len-2]
                    // this.out = getOtherPortal(port, this.portals);
    
                    this.teleporting = true; 
                    break;
                }    
            }

        } 

        //pedaco de codigo com o potencial de ser comprimido
        if(this.teleporting){
            // this.out = getOtherPortal(this.in);
            teleport(this.in, this.out, this)
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

        
        this.render();
    }

    render(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, BALLRADIUS, 0, Math.PI*2);
        ctx.fillStyle = BALLCOLOR;
        ctx.fill();    
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;    
        ctx.stroke();    
        ctx.closePath();
    }
}
