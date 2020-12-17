function randomFromRange(min,max){
    return (Math.random()*(max-min) + min);
}

function PortalParticle(portal){
    this.x = randomFromRange(portal.x-portal.radius, portal.x+portal.radius);
    this.y = randomFromRange(portal.y-portal.radius, portal.y+portal.radius);

    this.radius = 2;
    this.ttl = randomFromRange(-15,20);
    this.vel = {
        x: randomFromRange(-0.2, 0.2),
        y: randomFromRange(-0.2, 0.2),
    }
    this.alpha = 1;

    this.restart = () => {
        this.ttl = randomFromRange(-15,10);
        this.x = randomFromRange(portal.x-portal.radius, portal.x+portal.radius);
        this.y = randomFromRange(portal.y-portal.radius, portal.y+portal.radius);
    }

    this.update = () => {
        this.draw();
        this.x += this.vel.x;
        this.y += this.vel.y;
    }
    
    this.draw = () => {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fillStyle = 'purple';
        ctx.fill();  
        ctx.closePath();        
    }
}

function Portal(x, y, radius, color, pos, id){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.position = pos; 
    this.more = pos===HORIZONTAL ? this.y > canvas.height/2 : this.x > canvas.width/2;
    this.id = id;
    this.first = true;

    this.particles = [];

    for (let i = 0; i < 8; i++) {
        this.particles.push(new PortalParticle(this));
    }

    this.draw = function(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fillStyle = this.color
        ctx.fill();    
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