import {PATH_ENGINE_IMAGE, PATH_ENGINE_SPRITES, PATH_SPACESHIP_IMAGE, INITIAL_FRAMES} from "../utils/constants.js";
import Projectile from "./Projectile.js";

class Player {
    constructor(canvasWidth, canvasHeight){
        //Definindo o tamamnho
        this.width = 48 * 2;    //Largura Renderizada
        this.height = 48 * 2;   //AlturaRenderizada
        //Definindo a velocidade
        this.velocity = 4;
        //Posição
        this.position = {
            x: canvasWidth / 2 - this.width / 2,
            y: canvasHeight - this.height  - 20
        };

        //Instanciando as imagens
        this.image = this.getImage(PATH_SPACESHIP_IMAGE);
        this.engineImage = this.getImage(PATH_ENGINE_IMAGE);
        this.engineSprites = this.getImage(PATH_ENGINE_SPRITES);
       
        this.sx = 0;
        this.frameCount = INITIAL_FRAMES;
    }

    getImage(path){
        const image = new Image();
        image.src = path;

        return image;
    }

    moveLeft() {
        this.position.x -= this.velocity;
    }

    moveRight() {
        this.position.x += this.velocity;
    }

    draw(ctx) {
        
        ctx.drawImage(
            this.image, 
            this.position.x, 
            this.position.y, 
            this.width, //Largura Renderizada
            this.height //Altura Renderizada
        );

        ctx.drawImage(
            this.engineSprites, 
            this.sx,
            0, 
            48,
            42,
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height);

            ctx.drawImage(
            this.engineImage, 
            this.position.x, 
            this.position.y + 5, //Deslocando o motor
            this.width, 
            this.height);

        

       this.update();
    /*    
        ctx.fillStyle = "red";
        ctx.fillRect(
            this.position.x,    //Posição eixo X 
            this.position.y,    //Posição eixo y 
            this.width,         //Largura
            this.height         //Altura
        );
        */
        
    }

    update(){
        if(this.frameCount === 0){
            this.sx  = this.sx === 96 ? 0 : this.sx += 48;

            this.frameCount = INITIAL_FRAMES;
        }

        this.frameCount --;
    }

    shoot(projectiles){
        const p = new Projectile({
            x: this.position.x + this.width / 2,
            x: this.position.y
        }, -5
        );

        projectiles.push(p);
    }
}

export default Player;