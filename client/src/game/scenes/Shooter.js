import Phaser from 'phaser';
import GameState from '../GameState';

export class Shooter extends Phaser.Scene {
    constructor() {
        super({
            key: 'Shooter',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            }
        });
    }

    preload() {
        this.load.image('bullet', 'assets/bullet.png');
        this.load.image('enemy', 'assets/enemy.png');
        this.load.image('cohete', 'assets/cohete.png');
        this.load.image('backgroundMenu', 'assets/backgroundMenu.png');
    }

    create() {
        this.add.image(512, 384, 'backgroundMenu').setScale(2);

        this.player = this.physics.add.image(512, 700, 'cohete')
            .setCollideWorldBounds(true)
            .setScale(0.5);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.menuKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);

        this.bullets = this.physics.add.group();
        this.enemies = this.physics.add.group();

        this.enemyTimer = this.time.addEvent({
            delay: 1500,
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });

        this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.enemyHitsPlayer, null, this);

        this.score = 0;
        this.lives = 3;
        this.enemiesKilled = 0;
        this.scoreText = this.add.text(20, 20, 'Score: 0', { fontSize: '28px', fill: '#fff' });
        this.livesText = this.add.text(20, 60, 'Lives: 3', { fontSize: '28px', fill: '#fff' });

        this.isGameOver = false;
    }

    update() {
        if (this.isGameOver) {
            if (Phaser.Input.Keyboard.JustDown(this.restartKey)) {
                this.scene.restart();
            }

            if (Phaser.Input.Keyboard.JustDown(this.menuKey)) {
                this.scene.start('Menu');
            }

            return;
        }

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-300);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(300);
        } else {
            this.player.setVelocityX(0);
        }

        if (Phaser.Input.Keyboard.JustDown(this.spaceBar)) {
            this.shoot();
        }

        this.enemies.getChildren().forEach(enemy => {
            if (enemy.y > 850) {
                this.enemyEscaped(enemy);
            }
        });
    }

    shoot() {
        const bullet = this.bullets.create(this.player.x, this.player.y - 50, 'bullet').setScale(0.1);
        bullet.setVelocityY(-500);
        bullet.body.setSize(bullet.width * 0.1, bullet.height * 0.1);
    }

    spawnEnemy() {
        const x = Phaser.Math.Between(50, 974);
        const enemy = this.enemies.create(x, -50, 'enemy').setScale(0.3);
        enemy.body.setSize(enemy.width * 0.4, enemy.height * 0.4);
        enemy.setVelocityY(Phaser.Math.Between(100, 200));
    }

    hitEnemy(bullet, enemy) {
        bullet.destroy();
        enemy.destroy();
        this.score += 10;
        this.enemiesKilled += 1;
        this.scoreText.setText(`Score: ${this.score}`);
    }

    enemyHitsPlayer(player, enemy) {
        enemy.destroy(); 

        this.lives--;
        this.livesText.setText(`Lives: ${this.lives}`);
        this.cameras.main.flash(300, 255, 0, 0);

        if (this.lives <= 0) {
            this.gameOver();
        }
    }

    enemyEscaped(enemy) {
        enemy.destroy();
        this.lives--;
        this.livesText.setText(`Lives: ${this.lives}`);

        if (this.lives <= 0) {
            this.gameOver();
        }
    }

    updateExperience(enemiesKilled) {
    if (enemiesKilled >= 10) {
        const increase = 5;
        GameState.experienceLevel = Math.min(100, GameState.experienceLevel + increase);
    }
}

    gameOver() {
        this.isGameOver = true;
        this.player.setVelocity(0);
        this.player.setVisible(false);
        this.enemyTimer.remove();

        const coinsEarned = this.calculateCoins(this.score, GameState.loveLevel, GameState.experienceLevel);
        GameState.coins += coinsEarned;

        this.updateExperience(this.enemiesKilled);

        localStorage.setItem('petGameState', JSON.stringify({
            coins: GameState.coins,
            loveLevel: GameState.loveLevel,
            experienceLevel: GameState.experienceLevel,
            lastLoveTime: GameState.lastLoveTime,
            lastDecayTime: GameState.lastDecayTime
        }));


        this.add.text(300, 350, 'GAME OVER', {
            fontSize: '64px',
            fill: '#ff0000',
            fontFamily: 'Silkscreen, sans-serif'
        });

        this.add.text(300, 420, `Ganaste ${GameState.coins} monedas`, {
            fontSize: '28px',
            fill: '#ffffff',
            fontFamily: 'Silkscreen, sans-serif'
        });

        this.add.text(300, 500, `Experiencia: ${GameState.experienceLevel}`, {
            fontSize: '24px',
            fill: '#00ff00',
            fontFamily: 'Silkscreen, sans-serif'
        });


        const returnButton = this.add.text(512, 580, 'Back', {
            fontFamily: 'Silkscreen, sans-serif', fontSize: 32, color: '#000000',
            
            backgroundColor: '#ffffff',
            padding: { x: 20, y: 10 },
            align: 'center'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(9999);

         returnButton.on('pointerdown', () => {
            console.log('Botón clickeado');
            this.changeScene(); 
        });

    }
    changeScene() {
        this.scene.start('Game');
    }

    calculateCoins(score, loveLevel, experienceLevel) {
        const multiplier = 1 + (loveLevel * 0.1) + (experienceLevel * 0.2);
        return Math.floor(score * multiplier);
    }
}
