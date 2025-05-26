import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    logoTween;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        // Fondo
        this.add.image(512, 384, 'backgroundMenu').setScale(2);

        // Logo
        this.logo = this.add.image(512, 50,'logo')
            .setDepth(100)
            .setScale(1.5);


        // Botón para jugar
        const playButton = this.add.text(512, 500, '▶ Jugar', {
            fontFamily: 'Silkscreen, sans-serif', fontSize: 32, color: '#000000',

            backgroundColor: '#ffffff',
            padding: { x: 20, y: 10 },
            align: 'center'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(9999);

        // Evento al hacer clic
        playButton.on('pointerdown', () => {
            console.log('Botón clickeado');
            this.changeScene(); // Cambiar a la escena 'Game'
        });

        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('Game');
    }
}
