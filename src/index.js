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
const playerProjectiles = [];


const keys = {
    left: false,
    right: false,
    shoot: {
        pressed: false,
        released: true,
    },
};

const gameLoop = () => {
    //Limpando a tela ao movimentar
    ctx.clearRect (0, 0, canvas.width, canvas.height);

    //p.draw(ctx);
    //p.update();

    ctx.save();

    ctx.translate(
        player.position.x + player.width / 2,
        player.position.y + player.right / 2
    );

    if(keys.shoot.pressed && keys.shoot.released){
        player.shoot(playerProjectiles);
        keys.shoot.released = false;
    }
    //Movimentando e validando o movimento do player
    if(keys.left && player.position.x >= 0) {
        player.moveLeft();
        //ctx.rotate(-0.15);

    }

    if(keys.right && player.position.x <= canvas.width - player.width) {
        player.moveRight();
        //ctx.rotate(0.15);
    }

    ctx.translate(
        - player.position.x - player.width / 2,
        - player.position.y - player.right / 2
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
        keys.shoot.pressed = true;
        keys.shoot.released = false;
    }
});

gameLoop();
