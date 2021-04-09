import 'phaser';
import SplashScreen from './scenes/SplashScreen';

const config = {
    backgroundColor: '#f4f4f6',
    dom: {
        createContainer: true
    },
    height: window.innerHeight,
    parent: 'gameContainer',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 150 }
        }
    },
    scene: SplashScreen,
    type: Phaser.AUTO,
    width: window.innerWidth, 
};

new Phaser.Game(config);