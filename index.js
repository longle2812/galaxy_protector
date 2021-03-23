//Initiation
let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
c.height = window.innerHeight;
c.width = window.innerWidth;
let radiusRatio = 1;
let piece = false;
let color = 'red';
let guns = true;

// Create Player
let Player = function (x, y, radius, color,velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;

    this.draw = function () {

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

let PowerUp = function (x, y, width, color, type) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.color = color;
    this.type = type;

    this.draw = function () {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width,this.width );
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

let Projectile = function (x, y, radius, color,velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius * radiusRatio;
    this.color = color;
    this.velocity = velocity;

    this.draw = function () {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.fillStyle = this.color;
            ctx.fill();
    }

    this.update = function () {
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.draw();
    }
}
let Enemy = function (x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius + radiusRatio;
    this.color = color;
    this.velocity = velocity;

    this.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    this.update = function () {
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.draw();
        }
}

let Particle = function (x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;

    this.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    this.update = function () {
        this.x += this.velocity.x*2;
        this.y += this.velocity.y*2;
        this.draw();
    }
}

function spawnPower () {
    setInterval(() => {
        let power = new PowerUp(Math.random() * c.width, Math.random() * c.height, 20, 'white', 0)
        power.type = random(1,4);
        powers.push(power);
        setTimeout(() => {
            powers.splice(0,1);
        }, 4000)
    }, 5000)
    //delete particles
    setInterval(() => {
        particles.forEach((particle, index) => {
            particles.splice(index, Math.random() * 10);
        })
    }, 1500)
    }


function spawnEnemies() {
    setInterval(() => {
        let color =  "hsl( "+Math.random() * 360 +", 50%, 50%)";
        let radius = Math.random() * (30 - 10) +10;
        let enemyX;
        let enemyY;
        if (Math.random() < 0.5) {
            enemyX = Math.random() < 0.5 ? 0 - radius : c.width + radius;
            enemyY = Math.random() * c.height;
        }
        else {
            enemyX = Math.random() * c.width;
            enemyY = Math.random() < 0.5 ? 0 - radius : c.height + radius;
        }

        const angle = Math.atan2(
            c.height/2 - enemyY,
            c.width/2 - enemyX
        )

        const velocity = {
            x: Math.cos(angle) *5,
            y: Math.sin(angle) *5
        }
        const enemy = new Enemy(enemyX,enemyY,radius,color,velocity)
        enemies.push(enemy);
    }, Math.random() * 500 + 500)
}

let animationId
let animate = function () {
    animationId = requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0,0,c.width,c.height);
    player1.draw();

    // draw PowerUp
    powers.forEach((power,index) => {
        power.draw();
        //check powerup collision
        projectiles.forEach((projectile,projectileIndex) => {
            const dist = Math.hypot(power.x - projectile.x,
                power.y - projectile.y)
            if (dist - power.width - projectile.radius < 1) {
                powers.splice(index,1);
                projectiles.splice(projectileIndex, 1);
                switch (power.type) {
                    case 1: { //blowwwwww Up
                        ctx.clearRect(0,0,c.width, c.height);
                        enemies = [];
                        setTimeout(() => {
                            power.type = 0;
                        },4000)
                        break;}

                    case 2: {//Bigboy
                        radiusRatio = 3;
                        player1.color = 'yellow';
                        player1.radius += 10;
                        color = 'yellow'
                        setTimeout(() => {
                            player1.color = 'white';
                            power.type = 0;
                            player1.radius -= 10;
                            radiusRatio = 1;
                            color = 'red';
                        },5000)
                        break;}
                    case 3: //Piece enemies
                        piece = true;
                        player1.color = 'red';
                        setTimeout(() => {
                            piece = false;
                            player1.color = 'white'
                        }, 3000)
                        break;
                    case 4: //2 guns

                }
            }
        })
    })

    document.getElementById('scores').innerHTML = scores;
    //draw projectile
    projectiles.forEach((projectile, index) => {
        // remove projectiles go out screen
        if ((projectile.x < 0) || (projectile.x > c.width) ||
            (projectile.y < 0) || (projectile.y > c.height)) {
           projectiles.splice(index,1 ) ;
        }
        projectile.update();
    })

    //draw particles
    particles.forEach((particle,index) => {
        particle.update();
    })

    // Check enemy collision & draw enemies
    enemies.forEach((enemy, index) => {
        enemy.update();
        //End game
        const dist = Math.hypot(player1.x - enemy.x, player1.y - enemy.y)
        if (dist - enemy.radius - player1.radius < 1) {
            // cancelAnimationFrame(animationId);
        }

        projectiles.forEach((projectile, projectileIndex) => {
        const dist = Math.hypot(projectile.x - enemy.x,
            projectile.y - enemy.y
        )
        // projectiles hit enemies
        if (dist - enemy.radius - projectile.radius < 1){
            setTimeout(() => {
                for (let i = 0; i < enemy.radius; i++) {
                        let particle = new Particle(projectile.x,
                            projectile.y, Math.random() * 5, enemy.color, {
                                x: Math.random() - 0.5,
                                y: Math.random() - 0.5
                            })
                        particles.push(particle);
                    }
                if(!piece) {projectiles.splice(projectileIndex, 1);}
                    enemy.radius -= Math.random() * (60 - 20) + 20;
                    scores += 10;
                    if (enemy.radius < 0) {
                        enemies.splice(index, 1);
                        scores += 30;
                    }
                },0)
        }
        })
    })
}

//init
let projectiles = [];
let particles =[];
let powers = [];
let enemies = [];
let scores = 0;
let player1 = new Player(c.width /2,c.height/2 , 20, 'white');

//shoot event
addEventListener('click',(event) => {
    const angle = Math.atan2(
         event.clientY - c.height/2,
         event.clientX - c.width /2
     )
     const velocity = {
         x: Math.cos(angle)*20,
         y: Math.sin(angle)*20
     }
     const projectile = new Projectile(c.width/2, c.height/2, 20, color, velocity);
     projectiles.push(projectile);
})

spawnEnemies();
spawnPower();
animate();

function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}






