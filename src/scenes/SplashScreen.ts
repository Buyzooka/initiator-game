import Main from "./Main";

export default class SplashScreen extends Phaser.Scene {
    logo: Phaser.GameObjects.Image;

    constructor() {
        super('splashscreen');
    }

    preload() {
        this.load.image('logo', 'assets/images/logo.png');
        this.game.scene.add('main', new Main());
    }

    create() {
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        this.logo = this.add.image(screenCenterX, screenCenterY, 'logo').setOrigin(0.5);

        this.time.addEvent({ delay: 2000, callback: this.startMainScene, callbackScope: this });
    }
    
    private startMainScene(): void {
        this.add.tween({
            targets: this.logo,
            duration: 3000,
            ease: 'linear',
            onComplete: () => {
                this.scene.start('main');
            }
        })
        
    }
}