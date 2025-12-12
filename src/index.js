import Projectile from "./classes/Projectile.js";
import Player from "./classes/Player.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;
//Desativa a suavização da imagem
ctx.imageSmoothingEnabled = false;
//Instanciando o player
const player = new Player(canvas.width, canvas.height);
//const p = new Projectile({x:250, y: 700}, -5)
const playerProjectiles = [];


const keys = {
    left: false,
    right: false,
    shoot: {
        pressed: false,
        released: true
    }
};

const drawProjectiles = () => {
    playerProjectiles.forEach((projectile) => {
        projectile.draw(ctx)
        projectile.update();
    });
};

const clearProjectiles = () => {
    playerProjectiles.forEach((projectile, index) => {
        if (projectile.position.y <= 0){
            playerProjectiles.splice(index, 1);
        }
    });
};


const gameLoop = () => {
    //Limpando a tela ao movimentar
    ctx.clearRect (0, 0, canvas.width, canvas.height);
/*
    p.draw(ctx);
    p.update();
*/
    drawProjectiles();
    clearProjectiles();
 

    ctx.save(); //Salvando o COntexto

    //Deslocando o centro de rotação pa-ra o centro do player
    ctx.translate(
        player.position.x + player.width / 2,
        player.position.y + player.height / 2
    );
    
    if(keys.shoot.pressed && keys.shoot.released){
        player.shoot(playerProjectiles);
        keys.shoot.released = false;
        console.log(playerProjectiles)
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

gameLoop();
