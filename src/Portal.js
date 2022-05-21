//Helper
function randomFromRange(min,max){
    return (Math.random()*(max-min) + min);
}

//Partículas que rodeam o portal
class PortalParticle{
    constructor(portal){
        this.portal = portal;

        this.x = randomFromRange(this.portal.x-this.portal.radius, this.portal.x+this.portal.radius);
        this.y = randomFromRange(this.portal.y-this.portal.radius, this.portal.y+this.portal.radius);
    
        this.radius = 2;
    
        //time to live
        this.ttl = randomFromRange(-15,20);
        
        this.vel = {
            x: randomFromRange(-0.2, 0.2),
            y: randomFromRange(-0.2, 0.2),
        }
    }

    //depois de passar ttl
    restart(){
        this.ttl = randomFromRange(-15,10);
        this.x = randomFromRange(this.portal.x-this.portal.radius, this.portal.x+this.portal.radius);
        this.y = randomFromRange(this.portal.y-this.portal.radius, this.portal.y+this.portal.radius);
    }

    update(){
        this.render();
        this.x += this.vel.x;
        this.y += this.vel.y;
    }
    
    render(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fillStyle = 'purple';
        ctx.fill();  
        ctx.closePath();        
    }
}

class Portal{
    constructor(x, y, pos, id){
        this.x = x;
        this.y = y;
        this.radius = Math.floor(BLOCKSIZE/2);
    
        //HORIZONTAL X VERTICAL
        this.position = pos; 
    
        //TRUE(direito ou baixo) X FALSE(esquerdo ou cima)
        //"more" de maior x ou maior y
        this.more = pos===HORIZONTAL ? this.y > canvas.height/2 : this.x > canvas.width/2;
    
        //id para teleporte
        this.id = id;
    
        //boolean para animação de surgimento
        this.first = true;
    
        //boolean para bordar brancas
        this.current = true;
    
        //PortalParticles
        this.particles = [];
        for (let i = 0; i < 8; i++) {
            this.particles.push(new PortalParticle(this));
        }
    }

    render(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fillStyle = PORTALCOLOR;
        ctx.fill();    
        if(this.current){
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'white';
            ctx.stroke(); 
        }
        ctx.closePath(); 

        this.particles.forEach(p => {
            if(p.ttl >= 20){
                p.restart();
            } else {
                p.ttl++;
                p.update();
            }
        });
    }
}