class SoundEffects {
    constructor(){
        this.shootSounds = [
            new Audio("src/assets/audios/shoot.mp3"),
            new Audio("src/assets/audios/shoot.mp3"),
            new Audio("src/assets/audios/shoot.mp3"),
            new Audio("src/assets/audios/shoot.mp3"),
            new Audio("src/assets/audios/shoot.mp3")
        ];

        this.hitSounds = [
            new Audio("src/assets/audios/hit.mp3"),
            new Audio("src/assets/audios/hit.mp3"),
            new Audio("src/assets/audios/hit.mp3"),
            new Audio("src/assets/audios/hit.mp3"),
            new Audio("src/assets/audios/hit.mp3")
        ];

        this.explosionSounds = new Audio("src/assets/audios/explosion.mp3");
        this.nextLevelSounds = new Audio("src/assets/audios/next_level.mp3");

        this.currentShootSound = 0;
        this.currentHitSound = 0;
  
        this.adjustVolumes();
    }

    playShootSound(){
        console.log(this.currentShootSound)
        this.shootSounds[this.currentShootSound].currentTime = 0;
        this.shootSounds[this.currentShootSound].play();

        this.currentShootSound = (this.currentShootSound + 1) % this.shootSounds.length;

    }

    playHitSound(){
        console.log(this.currentHitSound)
        this.hitSounds[this.currentHitSound].currentTime = 0;
        this.hitSounds[this.currentHitSound].play();

        this.currentHitSound = (this.currentHitSound + 1) % this.hitSounds.length;
    }

    playExplosionSound(){
        this.explosionSounds.play();
    }

     playLevelSound(){
        this.levelSounds.play();
    }

    adjustVolumes(){
        this.hitSounds.forEach(sound => (sound.volume = 0.2));
        this.shootSounds.forEach(sound => (sound.volume = 0.5));
        this.explosionSounds.volume = 0.2;
        this.nextLevelSounds.volume = 0.4;
    }
}

export default SoundEffects;