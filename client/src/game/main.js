import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import Phaser from 'phaser';
import { Preloader } from './scenes/Preloader';
import { Shooter } from './scenes/Shooter';
import IntroScene from './scenes/IntroScene';

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scene: [
        Boot,
        Preloader,
        IntroScene,
        MainMenu,
        Game,
        Shooter,
        GameOver
    ],
    physics: {  // THIS MUST BE PRESENT
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    input: {
    keyboard: true,
    mouse: true,
    touch: true,
    gamepad: false
},
};

const StartGame = (parent) => {

    return new Phaser.Game({ ...config, parent });

}

export default StartGame;
