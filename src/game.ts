import 'phaser';
import Main from './scenes/Main';

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    width: window.innerWidth, 
    height: window.innerHeight,
    scene: Main,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 150 }
        }
    },
};

const game = new Phaser.Game(config);
