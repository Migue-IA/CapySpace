import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import GameState from '../GameState';

export class Game extends Scene {
    constructor() {
        super('Game');
    }

    preload() {
        // Cargar assets adicionales si es necesario
        this.load.image('heart', 'assets/heart.png');
    }

    create() {
        // Cargar estado guardado
        this.loadGameState();

        // Configuración inicial
        this.cameras.main.setBackgroundColor(0x00ff00);
        this.add.image(512, 384, 'backgroundHome').setScale(0.8);
        this.character = this.add.image(512, 400, 'character').setScale(0.5);

        // Inicializar estadísticas desde GameState
        this.coins = GameState.coins;
        this.love = GameState.loveLevel;
        this.exp = GameState.experienceLevel;

        // UI de estadísticas
        this.coinsText = this.add.text(50, 60, `💰 ${this.coins}`, {
            backgroundColor: '#ffffff', 
            color: '#000000',
            padding: { x: 10, y: 5 },
            fontFamily: 'Silkscreen, sans-serif', 
            fontSize: 20
        });

        this.loveText = this.add.text(50, 100, `❤️ ${this.love}`, {
            fontFamily: 'Silkscreen, sans-serif', 
            fontSize: 20, 
            color: '#ffffff'
        });

        this.expText = this.add.text(50, 140, `⭐ ${this.exp}`, {
            fontFamily: 'Silkscreen, sans-serif', 
            fontSize: 20, 
            color: '#ffffff'
        });

        this.setupLoveButton();
        this.setupOtherButtons();

        this.checkLoveDecay();

        this.time.addEvent({
            delay: 1000,
            callback: this.updateLoveUI,
            callbackScope: this,
            loop: true
        });
    }

    setupLoveButton() {
        this.btnAmor = this.add.image(100, 670, 'love_btn').setInteractive().setScale(0.3);
        
        this.btnAmor.on('pointerdown', () => {
            const now = Date.now();
            const hoursSinceLastLove = (now - GameState.lastLoveTime) / (1000 * 60 * 60);
            
            if (hoursSinceLastLove >= 4) {
                GameState.lastLoveTime = now;
                this.showLoveAnimation();
                this.increaseLove();
                this.saveGameState();
            } else {
                const remainingHours = (4 - hoursSinceLastLove).toFixed(1);
                this.showMessage(`Debes esperar ${remainingHours} horas para dar amor otra vez`);
            }
        });
    }

    setupOtherButtons() {
        const btnComida = this.add.image(220, 670, 'food_btn').setInteractive().setScale(0.3);
        btnComida.on('pointerdown', () => {
            console.log('Dar comida 🍎');
        });

        const btnMejorar = this.add.image(340, 670, 'battle_btn').setInteractive().setScale(0.3);
        btnMejorar.on('pointerdown', () => {
            this.scene.start('Shooter');
        });

        const btnBattle = this.add.image(460, 670, 'upgrade_btn').setInteractive().setScale(0.3);
        btnBattle.on('pointerdown', () => {
            this.scene.start('Shooter');
        });

        this.createButton(820, 680, '⚙ Settings', () => {
            console.log('Abrir configuración');
        });
    }

    showLoveAnimation() {
        const heart = this.add.sprite(
            this.character.x, 
            this.character.y - 200, 
            'heart'
        ).setScale(0.1);
        
        this.tweens.add({
            targets: heart,
            y: this.character.y - 250,
            alpha: 0,
            duration: 1000,
            ease: 'Power1',
            onComplete: () => heart.destroy()
        });
        
        this.tweens.add({
            targets: this.btnAmor,
            scaleX: 0.35,
            scaleY: 0.35,
            duration: 100,
            yoyo: true,
            ease: 'Power1'
        });
    }

    increaseLove() {
        GameState.loveLevel = Math.min(GameState.loveLevel + 1, 10);
        this.love = GameState.loveLevel;
        this.loveText.setText(`❤️ ${this.love}`);
        
        this.tweens.add({
            targets: this.loveText,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 100,
            yoyo: true,
            ease: 'Power1'
        });
    }

    checkLoveDecay() {
        const now = Date.now();
        const hoursSinceLastDecay = (now - GameState.lastDecayTime) / (1000 * 60 * 60);
        
        const decayCount = Math.floor(hoursSinceLastDecay / 6);
        
        if (decayCount > 0) {
            GameState.loveLevel = Math.max(0, GameState.loveLevel - decayCount);
            GameState.lastDecayTime = now - ((hoursSinceLastDecay % 6) * 60 * 60 * 1000);
            this.love = GameState.loveLevel;
            this.loveText.setText(`❤️ ${this.love}`);
            this.saveGameState();
        }
    }

    updateLoveUI() {
        const now = Date.now();
        const hoursSinceLastLove = (now - GameState.lastLoveTime) / (1000 * 60 * 60);
        const canLoveAgain = hoursSinceLastLove >= 4;
        
        this.btnAmor.setTint(canLoveAgain ? 0xFFFFFF : 0x666666);
        
        if (now - GameState.lastDecayTime >= 6 * 60 * 60 * 1000) {
            this.checkLoveDecay();
        }
    }

    showMessage(text) {
        if (this.messageText) {
            this.messageText.destroy();
        }
        
        this.messageText = this.add.text(512, 200, text, {
            fontFamily: 'Silkscreen, sans-serif',
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: '#333333',
            padding: { x: 20, y: 10 },
            align: 'center'
        }).setOrigin(0.5).setDepth(1000);
        
        this.time.delayedCall(3000, () => {
            if (this.messageText) {
                this.messageText.destroy();
            }
        });
    }

    createButton(x, y, label, callback) {
        const btn = this.add.text(x, y, label, {
            fontFamily: 'Silkscreen, sans-serif', 
            fontSize: 24,
            backgroundColor: '#fba34e', 
            color: '#ffffff',
            padding: { x: 10, y: 5 }
        }).setInteractive({ useHandCursor: true })
          .setDepth(100);

        btn.on('pointerdown', callback);
        return btn;
    }

    loadGameState() {
        const savedState = localStorage.getItem('petGameState');
        if (savedState) {
            Object.assign(GameState, JSON.parse(savedState));
        }
        
        if (!GameState.lastLoveTime) {
            GameState.lastLoveTime = Date.now();
        }
        if (!GameState.lastDecayTime) {
            GameState.lastDecayTime = Date.now();
        }
    }

    saveGameState() {
        localStorage.setItem('petGameState', JSON.stringify({
            coins: GameState.coins,
            loveLevel: GameState.loveLevel,
            experienceLevel: GameState.experienceLevel,
            lastLoveTime: GameState.lastLoveTime,
            lastDecayTime: GameState.lastDecayTime
        }));
    }

    changeScene() {
        this.scene.start('GameOver');
    }
}