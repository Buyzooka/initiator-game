import AvoidSpamInstruction from "./AvoidSpamInstruction";

export default class SplashScreen extends Phaser.Scene {
    logo: Phaser.GameObjects.Image;

    constructor() {
        super('splashscreen');
    }

    preload() {
        this.load.image('logo', 'assets/images/logo.png');
        this.game.scene.add('avoid_spam_instruction', new AvoidSpamInstruction());
    }

    create() {
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        console.log("🚀 ~ file: SplashScreen.ts ~ line 17 ~ SplashScreen ~ create ~ screenCenterX", screenCenterX)
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        console.log("🚀 ~ file: SplashScreen.ts ~ line 19 ~ SplashScreen ~ create ~ screenCenterY", screenCenterY)
        this.logo = this.add.image(screenCenterX, screenCenterY, 'logo');

        this.time.addEvent({ delay: 2000, callback: this.startMainScene, callbackScope: this });
    }
    
    private startMainScene(): void {
        this.add.tween({
            targets: this.logo,
            duration: 3000,
            ease: 'linear',
            onComplete: () => {
                this.scene.start('avoid_spam_instruction');
            }
        })
        
    }
}