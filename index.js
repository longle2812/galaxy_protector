//Initiation
let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
c.height = window.innerHeight;
c.width = window.innerWidth;
var mySound;
var myMusic;
let intervalid;
let powerid;
let animationId;
let timeEnemy = Math.random() * 200 + 300;
let timePower = 1500;

// Class Player
let Player = function (x, y, radius, color,velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.friction = 0;
    this.speedX = 0;
    this.speedY = 0;

    this.draw = function () {
        // ctx.beginPath();
        this.speedY += -this.speedY * 0.3;
        this.speedX += -this.speedX * 0.3;
        this.x += this.speedX;
        this.y += this.speedY ;
        if (this.x < 0) {
            this.x = this.radius/2+10;
        }
        if (this.y < 0) {
            this.y = this.radius/2+10;
        }
        if (this.y > c.height) {
            this.y = c.height-this.radius/2-10;
        }
        if (this.x > c.width) {
            this.x = c.width-this.radius/2-10;
        }
        var imgPlayer = document.getElementById("player");
        ctx.drawImage(imgPlayer, this.x - 30, this.y - 30,60,60);
        // ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        // ctx.fillStyle = this.color;
        // ctx.fill();
    }
}

// Class Boss
let Boss = function (x, y, radius, speedX, speedY, bossHP) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speedX = speedX;
    this.speedY = speedY;
    this.HP = bossHP;
    this.draw = function () {
        // this.speedX += -this.speedX * 0.1;
        // this.speedY += -this.speedY * 0.1;
        if (this.x < player1.x) {
            this.x += this.speedX;
        }
        else this.x -= this.speedX;
        if (this.y < player1.y) {
            this.y += this.speedY;
        }
        else this.y -= this.speedY;
        var imgPlayer = document.getElementById("boss");
        ctx.drawImage(imgPlayer, this.x - this.radius, this.y - this.radius,this.radius*2,this.radius*2);
    }
}

// Class Power up
let PowerUp = function (x, y, width, color, type) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.color = color;
    this.type = type;

    this.draw = function () {
        // ctx.beginPath();
        // ctx.rect(this.x, this.y, this.width,this.width );

        var img = document.getElementById("power");
        ctx.drawImage(img, this.x, this.y,60,60);
        // ctx.fillStyle = this.color;
        // ctx.fill();
    }
}

//Class Projectile
let Projectile = function (x, y, radius, color,velocity) {
    this.x = player1.x;
    this.y = player1.y;
    this.radius = radius * radiusRatio;
    this.color = color;
    this.velocity = velocity;

    this.draw = function () {
            // ctx.beginPath();
            // if (shotguns) {
            //     ctx.arc(this.x +10, this.y -10, this.radius, 0, 2 * Math.PI);
            //     ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            //     ctx.arc(this.x -10, this.y + 10, this.radius, 0, 2 * Math.PI);
            // }
            // else ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            // ctx.fillStyle = this.color;
            // ctx.fill();
        var img = document.getElementById("bullet");
        ctx.drawImage(img, this.x-this.radius/2, this.y-this.radius/2,this.radius,this.radius);
    }

    this.update = function () {
            this.x += this.velocity.x * velocityRatio;
            this.y += this.velocity.y * velocityRatio;
            this.draw();
    }
}

// Class Enemy
let Enemy = function (x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.id = random(1,6);

    this.draw = function () {
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        // ctx.fillStyle = this.color;
        var imgEnemy = document.getElementById("enemy"+this.id);
        ctx.drawImage(imgEnemy, this.x-25, this.y-25,50,50);
        // ctx.fill();
    }
    this.update = function () {
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.draw();
        }
}

// Class Particle
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
        powerid = setInterval(() => {
        let power = new PowerUp(Math.random() * c.width, Math.random() * c.height, 20, 'white', 0)
        power.type = random(1,5);
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
    }, timePower);
    }

function spawnEnemies() {
        intervalid = setInterval(() => {
        let color =  "hsl( "+Math.random() * 360 +", 50%, 50%)";
        let radius = 30;
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
    }, timeEnemy)
}

let projectiles = [];
let particles = [];
let powers = [];
let enemies = [];
let scores = 0;
let highscore = localStorage.highScore;
let player1 = new Player(c.width / 2, c.height / 2, 20, 'white');
let boss = new Boss(0,0,50,2,2)
let radiusRatio = 1;
let piece = false;
let color = 'red';
let velocityRatio = 1;
let life = 3;
let shotguns = false;
let bossCome = false;

function init () {
    projectiles = [];
    particles = [];
    powers = [];
    enemies = [];
    scores = 0;
    highscore = localStorage.highScore;
    player1 = new Player(c.width / 2, c.height / 2, 20, 'white');
    boss = new Boss(0,0,50,2,2,100);
    radiusRatio = 1;
    piece = false;
    color = 'red';
    velocityRatio = 1;
    life = 3;
    shotguns = false;
    bossCome = false;
}

//Let's the game BEGIN
document.getElementById("startgame").addEventListener('click', startgame);
function startgame () {
    init();
    animate();
    if (!bossCome) {
        spawnEnemies();
    }
    spawnPower();
    document.getElementById("gameboard").style.display = 'none';
    mySound = new sound("hit.mp3");
    myMusic = new sound('gametheme.mp3');
    sound1 = new sound('powerup.mp3')
    sound2 = new sound('powerup2.mp3')
    sound3 = new sound('powerup3.mp3')
    sound4 = new sound('powerup4.mp3')
    myMusic.play();
}

//Render
let animate = function () {
    animationId = requestAnimationFrame(animate);
    if ((scores > 0) && (scores % 5 == 0) && (scores % 1000 == 0)) {
        bossCome = true;
        document.getElementById('bossHP').innerHTML = boss.HP;
    }
    var imgBackground = document.getElementById("background");
    ctx.drawImage(imgBackground, 0, 0,c.width,c.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    player1.draw();
    if (bossCome) {
        boss.draw();
        enemies =[];
    }

    //show scores & show lifes
    document.getElementById('scores').innerHTML = scores;
    document.getElementById('life').innerHTML = life;


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
                        sound1.play();
                        ctx.clearRect(0,0,c.width, c.height);
                        enemies = [];
                        setTimeout(() => {
                            power.type = 0;
                        },1000)
                        break;}

                    case 2: {//Bigboy
                        sound2.play();
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
                        },6000)
                        break;}
                    case 3: //Piece enemies + rapid fire
                        sound3.play();
                        piece = true;
                        player1.color = 'red';
                        velocityRatio = 1.5;
                        setTimeout(() => {
                            piece = false;
                            player1.color = 'white'
                            velocityRatio = 1;
                        }, 6000)
                        break;
                    case 4: // increase life
                        sound4.play();
                        life++
                        break;

                }
            }
        })
    })



    //draw projectile
    projectiles.forEach((projectile, index) => {
        // remove projectiles go out screen
        if ((projectile.x < 0) || (projectile.x > c.width) ||
            (projectile.y < 0) || (projectile.y > c.height)) {
            projectiles.splice(index,1 ) ;
        }
        projectile.update();
    })

    //draw particles when collision
    particles.forEach((particle) => {
        particle.update();
    })

    // Check enemy collision & draw enemies
    if (!bossCome){
        enemies.forEach((enemy, index) => {
            enemy.update();
            //End game
            const dist = Math.hypot(player1.x - enemy.x, player1.y - enemy.y)
            if (dist - enemy.radius - player1.radius < 1) {
                enemies.splice(index,1);
                for (let i = 0; i < enemy.radius; i++) {
                    let particle1 = new Particle(enemy.x,
                        enemy.y, Math.random() * 5, enemy.color, {
                            x: Math.random() - 0.5,
                            y: Math.random() - 0.5
                        })
                    particles.push(particle1);
                }
                life--;
                if (life <= 0) {
                    //Check Highscore
                    if (isNaN(highscore)) {
                        highscore = 0;
                        localStorage.highScore = '0';
                    }
                    if (!(typeof highscore === 'undefined')) {
                        if (scores>highscore) {
                            highscore = scores;
                            localStorage.highScore = '' + scores;
                        }
                    }
                    document.getElementById('scoreGameboard').innerHTML = scores;
                    document.getElementById("gameboard").style.display = 'flex';
                    clearInterval(intervalid);
                    clearInterval(powerid);
                    myMusic.stop();
                    cancelAnimationFrame(animationId);

                }
            }

            projectiles.forEach((projectile, projectileIndex) => {
                const dist = Math.hypot(projectile.x - enemy.x,
                    projectile.y - enemy.y
                )
                // projectiles hit enemies
                if (dist - enemy.radius - projectile.radius < 1){
                    setTimeout(() => {
                        //create particles for collision
                        for (let i = 0; i < enemy.radius; i++) {
                            let particle = new Particle(projectile.x,
                                projectile.y, Math.random() * 5, enemy.color, {
                                    x: Math.random() - 0.5,
                                    y: Math.random() - 0.5
                                })
                            particles.push(particle);
                        }
                        mySound.play();
                        if(!piece) {projectiles.splice(projectileIndex, 1);}
                        enemy.radius -= Math.random() * (60 - 20) + 30;
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
    else {
        //Check collision Boss & projectile
        projectiles.forEach((projectile,index) => {
            const dist = Math.hypot(projectile.x - boss.x,
                projectile.y - boss.y);
            if (dist - boss.radius - projectile.radius <1 ) {
                projectiles.splice(index, 1);
                boss.HP -= 5;
                if (boss.HP == 0) {
                    scores += 500;
                    bossCome = false;
                    document.getElementById('bossHP').innerHTML = 0;
                    boss.HP += 50;
                    timeEnemy += random(100,300);
                    timePower -= random(100,300);
                }
            }
        })
    }
}

//Shoot event
addEventListener('mousedown',(event) => {
    const angle = Math.atan2(
        event.clientY - player1.y,
        event.clientX - player1.x
    )
    const velocity = {
        x: Math.cos(angle)*20,
        y: Math.sin(angle)*20
    }
    const projectile = new Projectile(c.width/2, c.height/2, 30, color, velocity);
    projectiles.push(projectile);
})

//player move
addEventListener('keydown',(event) => {
    switch (event.keyCode){
        case 87: {
            player1.speedY = -15;
            break;
        }
        case 83: {
            player1.speedY = +15;
            break;
        }
        case 65: {
            player1.speedX = -15;
            break;
        }
        case 68: {
            player1.speedX = +15;
            break;
        }
    }
})

// Random anything u want
function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

// Some Epic Music
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}






