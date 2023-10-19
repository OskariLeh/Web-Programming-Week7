let game

const gameOptions = {
    playerSpeed: 200
}

window.onload = function () {
    let gameConfig = {
        type: Phaser.AUTO,
        backgroundColor: "#000023",
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 1500,
            height: 700
        },
        pixelArt: true,
        physics: {
            default: "arcade",
            arcade: {
                gravity: {
                    y: 0
                }
            }
        },
        scene: PlayGame
    }
    game = new Phaser.Game(gameConfig)
    window.focus();
}

class PlayGame extends Phaser.Scene {
    
    constructor() {
        super("PlayGame")
        this.astedoids = 0
        this.score = 0
    }

    preload() {
        this.load.spritesheet("player", "assets/ship_2.png", {frameWidth: 100, frameHeight: 50})
        this.load.image("big_asteroid", "assets/meteor.png")
        this.load.image("bullet", "assets/laser.png")
    }

    create() {
        const asteroidCollision = () => {
            this.astedoids = 0
            this.scene.start("PlayGame")
        } 

        this.player = this.physics.add.sprite(game.config.width / 2, game.config.height / 2, "player")
        this.player.setDrag(15)
        this.asteroidGroup = this.physics.add.group()

        this.cursors = this.input.keyboard.createCursorKeys()
        this.physics.add.collider(this.player, this.asteroidGroup, asteroidCollision)

        this.scoreText = this.add.text(32, 0, "Score: ", {fontSize: "25px", fill: "#ffffff"})
        this.scoreNumber = this.add.text(120, 0, "0", {fontSize: "25px", fill: "#ffffff"})
    }

    addAsteroid() {
        if (this.astedoids < 15) {
            this.astedoids += 1
            let asteroid = this.physics.add.image(Phaser.Math.Between(0, game.config.width), 0, "big_asteroid")
            this.asteroidGroup.add(asteroid)

            this.asteroidGroup.getChildren().forEach(child => {
                child.setVelocity(Phaser.Math.Between(5, 70), Phaser.Math.Between(5, 20))
            })
        }
        
    }


    update() {
        
        this.asteroidTrigger = this.time.addEvent({
            callback: this.addAsteroid,
            callbackScope: this,
            delay: 1000,
            loop: true
        })
        if (this.input.keyboard.checkDown(this.cursors.space, 250)) { 
        
            let bullet = this.physics.add.image(this.player.x, this.player.y, "bullet")
            this.physics.velocityFromRotation(this.player.rotation, 200, bullet.body.velocity)
            const asteroidShot = (bullet, asteroid) => {
                this.astedoids -= 1
                this.score += 1
                this.scoreNumber.setText(this.score)
                bullet.destroy()
                asteroid.destroy()
            }
            this.physics.add.collider(bullet, this.asteroidGroup, asteroidShot)

            
        }

        if(this.cursors.up.isDown) {
            this.physics.velocityFromRotation(this.player.rotation, 300, this.player.body.acceleration)
        } 
        else {
            this.physics.velocityFromRotation(this.player.rotation, 0, this.player.body.acceleration)
        }

        if(this.cursors.left.isDown) {
            this.player.setAngularVelocity(100)
        }

        else if(this.cursors.right.isDown) {
            this.player.setAngularVelocity(-100)
        } 
        else {
            this.player.setAngularVelocity(0)
        }

        this.physics.world.wrap(this.player)
    }
}