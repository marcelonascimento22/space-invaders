class Projectile {
    constructor(position, velocity){
        this.position = position;
        this.with = 2;
        this.height = 20;
        this.velocity = velocity;
    }

    draw(ctx){
        ctx.fillStyle = "white";
        ctx.fillRect(this.position.x, this.position.y, this.with, this.height);
    }

    update() {
        this.position += this.velocity;
    }
}

export default Projectile;