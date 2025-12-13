import { PATH_INVADER_IMAGE } from "../utils/constants.js";
import Projectile from "./Projectile.js";

class Invader {
    constructor(position, velocity){
        //Definindo o tamamnho
        this.width = 50;    //Largura Renderizada
        this.height = 37;   //AlturaRenderizada
        //Definindo a velocidade
        this.velocity = velocity;
        //Posição
        this.position = position;

        this.incrementeVelocity = 1;

        //Instanciando as imagens
        this.image = this.getImage(PATH_INVADER_IMAGE);
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

    moveDown(){
        this.position.y += this.height;
    }

    setVelocity(boost){

        this.velocity += boost / this.incrementeVelocity;

        this.incrementeVelocity += 1;
    }

    draw(ctx) {
        ctx.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }

    shoot(projectiles){
        const p = new Projectile(
            {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height
            }, 
            10
        );

        projectiles.push(p);
    }
    hit(projectile){
        return (
            projectile.position.x >= this.position.x &&
            projectile.position.x <= this.position.x + this.width &&
            projectile.position.y >= this.position.y &&
            projectile.position.y <= this.position.y + this.height

        )
    }
}

export default Invader;