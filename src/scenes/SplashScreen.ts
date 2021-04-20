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
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        this.logo = this.add.image(screenCenterX, screenCenterY, 'logo')
            .setOrigin(0.5);

        this.time.addEvent({ delay: 5000, callback: this.startMainScene, callbackScope: this });
    }
    
    private startMainScene(): void {
        this.scene.start('avoid_spam_instruction');
    }
}