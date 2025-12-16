import Player from "./classes/Player.js";
import Grid from "./classes/Grid.js";
import Particle from "./classes/Particle.js";
import { GameState } from "./utils/constants.js";
import Obstacle from "./classes/Obstacle.js";
import SoundEffects from "./classes/SoundEffects.js";
import Storege from "./classes/Storege.js";


const dbRank = new Storege;
const soundEffects = new SoundEffects;

dbRank.save(0, {nome: "AAA", score: 10});
dbRank.save(1, {nome: "BBB", score: 20});
dbRank.save(2, {nome: "CCC", score: 30});
dbRank.save(3, {nome: "DDD", score: 40});

const startScreen = document.querySelector(".start-screen");
const gameOverScreen = document.querySelector(".game-over");
const scoreUi = document.querySelector(".score-ui");
const scoreElement = document.querySelector(".score-display");
const levelElement = document.querySelector(".level-display");
const highElement = document.querySelector(".high-display");
const buttonPlay = document.querySelector(".button-play");
const buttonRestart = document.querySelector(".button-restart");
const rank = document.querySelector(".rank");
const inputRank = document.querySelector(".rank-input");
const buttonSaveRank = document.querySelector(".button-save-rank")

gameOverScreen.style.display = "none";
rank.style.display = "none";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

//Desativa a suavização da imagem
ctx.imageSmoothingEnabled = false;

let currentState = GameState.START;

const gameData = {
    score: 0,
    level: 1,
    high: 0
}

const qtdHigh = 0;

const showGameData = () => {
    gameData.high = rankArray[0].score > gameData.high ? rankArray[0].score : gameData.high

    scoreElement.textContent = gameData.score;
    levelElement.textContent = gameData.level;
    highElement.textContent = gameData.high;
}

//Instanciando o player
const player = new Player(canvas.width, canvas.height);

//Grid de Invaders
const grid = new Grid(3, 6); 

//const p = new Projectile({x:250, y: 700}, -5)
const playerProjectiles = [];
const invadersProjectiles = [];
const particles = [];
const obstacles = [];
const rankArray = [];
let control = 0;

const initObstacles = () => {
    const x = canvas.width / 2 - 50;
    const y = canvas.height - 200;
    const offset = canvas.width * 0.15;
    const color = "crimson";

    const obstacle1 = new Obstacle({x: x - offset, y}, 100, 20, color);
    obstacles.push(obstacle1);

    const obstacle2 = new Obstacle({x: x + offset, y}, 100, 20, color);
    obstacles.push(obstacle2);
    

}
initObstacles();

const keys = {
    left: false,
    right: false,
    shoot: {
        pressed: false,
        released: true
    }
};



const incrementScore = (value) => {
    gameData.score += value;

    if(gameData.score > gameData.high){
        gameData.high = gameData.score;
    }
}

const incrementLevel = (value) => {
    gameData.level += value;
}

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

const drawObstacles = () => {
    obstacles.forEach((obstacle) => obstacle.draw(ctx));
};

const drawRank = () => {
    
    rank.innerHTML = "";

    for(let k = 0;  k <= rankArray.length-1; k++ ){
        //console.log(`Nª:  ${k} | Nome: ${rankArray[k].nome} | Score: ${rankArray[k].score} `);
    
        let linha = document.createElement("tr");

        let n = document.createElement("td");
        let nome = document.createElement("td");
        let score = document.createElement("td");

        n.textContent = k + 1;
        nome.textContent = rankArray[k].nome;
        score.textContent = rankArray[k].score;

        linha.append(n, nome, score);
        rank.appendChild(linha);
        
    } 

    
}

const clearProjectiles = () => {
    playerProjectiles.forEach((projectile, index) => {
        if (projectile.position.y <= 0){
            playerProjectiles.splice(index, 1);
        }
    });
};

const clearProjectilesInvanders = () => {
    invadersProjectiles.forEach((projectile, index) => {
        if (projectile.position.y >= canvas.height){
            invadersProjectiles.splice(index, 1);
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
                soundEffects.playHitSound();
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

                incrementScore(1);
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


const checkCollisionPlayer = () => {
    if (!player.active) return;

    grid.invaders.some((invader) => {
        
        if(player.colliding(invader) || invader.position.y >= canvas.height - invader.height){
            gameOver();
        }
    });
};


const checkShootObstacles = () => {
    obstacles.forEach((obstacle) => {
        invadersProjectiles.some((projectile, projectileIndex) => {
            if(obstacle.hit(projectile)){
                invadersProjectiles.splice(projectileIndex, 1);
            }
        });

        playerProjectiles.some((projectile, projectileIndex) => {
            if(obstacle.hit(projectile)){
                 playerProjectiles.splice(projectileIndex, 1);
            }
        });
    });
};

const checkScoreStorege = () => {
    if (control !== 0) return;

    rankArray.length = 0;

    /*
    for (let i = 0; i < 5; i++) {
        const value = dbRank.load(i);

        if (
            value &&
            typeof value.nome === "string" &&
            typeof value.score === "number"
        ) {
            rankArray.push(value);
        }
    }
    */

    rankArray.push(...dbRank.getAll());

    rankArray.sort((a, b) => b.score - a.score);

    //console.table(rankArray);
    control = 1;
};

const isTop5 = (score) => {
    return rankArray.length < 5 || score > rankArray[rankArray.length - 1].score;
};

const spawGrid = () => {

    if(grid.invaders.length === 0){
        grid.rows = Math.round(Math.random() * 9 + 1);
        grid.cols = Math.round(Math.random() * 9 + 1);

        incrementLevel(1);
        soundEffects.playLevelSound();
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
    soundEffects.playExplosionSound();

    explosion(player, 10, "red");
    explosion(player, 10, "white");
    explosion(player, 10, "#4D9BE6");
    explosion(player, 10, "crimson");

    player.die();
    gameData.level = 1;
    currentState = GameState.GAME_OVER;

    // ESCONDE TUDO
    inputRank.style.display = "none";
    gameOverScreen.style.display = "none";

    // DECISÃO PRINCIPAL
    if (isTop5(gameData.score)) {
        inputRank.style.display = "flex"; // mostra input
    } else {
        gameOverScreen.style.display = "flex"; // mostra game over
    }
};

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
        
        showGameData();

        spawGrid();

        drawParticles();
        drawProjectiles();
        drawObstacles();

        clearProjectiles();
        clearProjectilesInvanders();
        clearParticles();

        checkShootInvaders();
        checkShootPlayer();
        checkCollisionPlayer();
        checkShootObstacles();

        grid.draw(ctx);
        grid.update(player.active);
    



        ctx.save(); //Salvando o COntexto

        //Deslocando o centro de rotação pa-ra o centro do player
        ctx.translate(
            player.position.x + player.width / 2,
            player.position.y + player.height / 2
        );
        
        if(keys.shoot.pressed && keys.shoot.released){
            soundEffects.playShootSound();
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
        drawObstacles(); 
        

        checkShootObstacles();

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

buttonPlay.addEventListener("click", () => {
    startScreen.remove();
    scoreUi.style.display = "block";
    currentState = GameState.PLAYING;
    rank.style.display = "none";

    setInterval(() => {
        const invader = grid.getRandomInvader();

        if(invader) {
            invader.shoot(invadersProjectiles);
            soundEffects.playShootSound();
        }
    }, 1000);
});

buttonRestart.addEventListener("click", () => {
    currentState = GameState.PLAYING;
    rank.style.display = "none";
    player.active = true;
    player.opacity = 1;

    grid.invaders.length = 0;
    grid.invadersVelocity = 1;

    invadersProjectiles.length = 0;

    gameData.score = 0;
    gameData.level = 1;

    gameOverScreen.style.display = "none";

});

buttonSaveRank.addEventListener("click", () => {
    const playerName = document.getElementById("playerName").value.trim();
    if (!playerName) return alert("Digite seu nome!");

    // adiciona ao ranking
    rankArray.push({ nome: playerName, score: gameData.score });

    // ordena e mantém top 5
    rankArray.sort((a, b) => b.score - a.score);
    rankArray.splice(5);

    // salva no localStorage
    rankArray.forEach((item, index) => {
        dbRank.save(index, item);
    });
    
    gameData.level = 1;

    drawRank();
    rank.style.display = "table";

    // fecha input e abre game over
    inputRank.style.display = "none";
    gameOverScreen.style.display = "flex";
});


checkScoreStorege();
gameLoop();
