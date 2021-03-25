import 'phaser';
import Main from './scenes/Main';
import SplashScreen from './scenes/SplashScreen';

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#f4f4f6',
    width: window.innerWidth, 
    height: window.innerHeight,
    scene: SplashScreen,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 150 }
        }
    },
    parent: 'gameContainer'
};

new Phaser.Game(config);
