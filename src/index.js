import Projectile from "./classes/Projectile.js";
import Player from "./classes/Player.js";
import Invader from "./classes/Invader.js";
import Grid from "./classes/Grid.js";
import Particle from "./classes/Particle.js";
import { GameState } from "./utils/constants.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

//Desativa a suavização da imagem
ctx.imageSmoothingEnabled = false;

let currentState = GameState.PLAYING;

//Instanciando o player
const player = new Player(canvas.width, canvas.height);

//Grid de Invaders
const grid = new Grid(3, 6); 

//const p = new Projectile({x:250, y: 700}, -5)
const playerProjectiles = [];
const invadersProjectiles = [];
const particles = [];

const keys = {
    left: false,
    right: false,
    shoot: {
        pressed: false,
        released: true
    }
};

const drawProjectiles = () => {
    const projectiles = [...playerProjectiles, ...invadersProjectiles];
    
    projectiles.forEach((projectile) => {
        projectile.draw(ctx)
        projectile.update();
    });
};

const drawParticles = () => {
    particles.forEach((particle) => {
        particle.draw(ctx);
        particle.update();
    });
};

const clearProjectiles = () => {
    playerProjectiles.forEach((projectile, index) => {
        if (projectile.position.y <= 0){
            playerProjectiles.splice(index, 1);
        }
    });
};

const clearParticles = () => {
    particles.forEach((particle, id) =>{
        if(particle.opacity <= 0){
            particles.splice(id, 1);
        }
    });
};

const createExplosion = (position, size, color) => {
    for(let i = 0; i <= size; i ++){
        const particle = new Particle(
            {
                x: position.x, 
                y: position.y
            }, 
            {
                x: Math.random() - 0.5 * 1.5, 
                y: Math.random() - 0.5 * 1.5
            }, 
            2, 
            color
        );

        particles.push(particle);
    }
};

const checkShootInvaders = () => {
    grid.invaders.forEach((invader, invaderIndex) => {
        playerProjectiles.some((projectile, projectileIndex) => {
            if(invader.hit(projectile)){
                explosion(invader, 10, "#941CFF");
                /*
                createExplosion(
                    {
                        x: invader.position.x + invader.width / 2,
                        y: invader.position.y + invader.height / 2
                    },
                    10,
                    "#941CFF"
                );
                */

                grid.invaders.splice(invaderIndex, 1);
                playerProjectiles.splice(projectileIndex, 1);
            }
        });
    });
};

const checkShootPlayer = () => {
    if (!player.active) return;

    invadersProjectiles.some((projectile, projectileIndex) => {
        if(player.hit(projectile)){
            gameOver();
            invadersProjectiles.splice(projectileIndex, 1);
        }
    });
};

const spawGrid = () => {
    if(grid.invaders.length === 0){
        grid.rows = Math.round(Math.random() * 9 + 1);
        grid.cols = Math.round(Math.random() * 9 + 1);

        grid.restart();
    }
}

const explosion = (obj, size, color) => {
    createExplosion(
                {
                    x: obj.position.x + obj.width / 2,
                    y: obj.position.y + obj.height / 2
                },
                size,
                color
            );
}

const gameOver = () => {
    explosion(player, 10, "red");
    explosion(player, 10, "white");
    explosion(player, 10, "#4D9BE6");
    explosion(player, 10, "crimson");
    /*
    createExplosion(
                {
                    x: player.position.x + player.width / 2,
                    y: player.position.y + player.height / 2
                },
                10,
                "red"
            );

            createExplosion(
                {
                    x: player.position.x + player.width / 2,
                    y: player.position.y + player.height / 2
                },
                10,
                "white"
            );

            createExplosion(
                {
                    x: player.position.x + player.width / 2,
                    y: player.position.y + player.height / 2
                },
                10,
                "crimson"
            );

            createExplosion(
                {
                    x: player.position.x + player.width / 2,
                    y: player.position.y + player.height / 2
                },
                10,
                "#4D9BE6"
            );
    */
    player.die();
    currentState = GameState.GAME_OVER;

}

/*
const checkShootInvaders = () => {
    for (let i = grid.invaders.length - 1; i >= 0; i--) {
        const invader = grid.invaders[i];

        for (let j = playerProjectiles.length - 1; j >= 0; j--) {
            const projectile = playerProjectiles[j];

            if (invader.hit(projectile)) {
                // remove o invader
                grid.invaders.splice(i, 1);

                // remove o projétil
                playerProjectiles.splice(j, 1);

                // para evitar múltiplas colisões no mesmo frame
                break;
            }
        }
    }
};

*/



const gameLoop = () => {
    //Limpando a tela ao movimentar
    ctx.clearRect (0, 0, canvas.width, canvas.height);
    if(currentState == GameState.PLAYING){
        spawGrid();

        drawParticles();
        drawProjectiles();

        clearProjectiles();
        clearParticles();

        checkShootInvaders();
        checkShootPlayer();
    
        grid.draw(ctx);
        grid.update(player.active);
    



        ctx.save(); //Salvando o COntexto

        //Deslocando o centro de rotação pa-ra o centro do player
        ctx.translate(
            player.position.x + player.width / 2,
            player.position.y + player.height / 2
        );
        
        if(keys.shoot.pressed && keys.shoot.released){
            player.shoot(playerProjectiles);
            keys.shoot.released = false;
        }

        //Movimentando e validando o movimento do player
        if(keys.left && player.position.x >= 0) {
            player.moveLeft();
            ctx.rotate(-0.15);

        }

        if(keys.right && player.position.x <= canvas.width - player.width) {
            player.moveRight();
            ctx.rotate(0.15);
        }

        //Voltando o centro de rotação
        ctx.translate(
            - player.position.x - player.width / 2,
            - player.position.y - player.height / 2
        );

        //renderizando o Player
        player.draw(ctx);

        ctx.restore();
    }

    if(currentState == GameState.GAME_OVER){
        drawParticles();
        drawProjectiles();

        clearProjectiles();
        clearParticles();

        grid.draw(ctx);
        grid.update(player.active);
    }
    
    //Cria o loop de execução do gameLoop
    requestAnimationFrame(gameLoop);
};

addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();

    if(key === "a") keys.left = true;
    if(key === "d") keys.right = true;
    if(key === "enter") keys.shoot.pressed = true;
});

addEventListener("keyup", (event) => {
    const key = event.key.toLowerCase();

    if(key === "a") keys.left = false;
    if(key === "d") keys.right = false;
    if(key === "enter") {
        keys.shoot.pressed = false;
        keys.shoot.released = true;
    }
});

    setInterval(() => {
        const invader = grid.getRandomInvader();

        if(invader) {
            invader.shoot(invadersProjectiles);
        }
    }, 1000);



gameLoop();
