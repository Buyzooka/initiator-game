import StringEnum from "../enums/string";
import Main from "./Main";

export default class AvoidSpamInstruction extends Phaser.Scene {
    constructor() {
        super('avoid_spam_instruction');
    } 

    preload() {
        this.load.image('spam', 'assets/sprites/spam.png');
        this.game.scene.add('main', new Main());
    }

    create() {
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        const areaWidth = this.cameras.main.width - 20;
        const areaHeight = this.cameras.main.height - 20;

        this.add.zone(10, 10, areaWidth, areaWidth);
        const graphics = this.add.graphics({ 
            lineStyle: { 
                width: 2, 
                color: 0xffffff
            }, 
            fillStyle: { 
                color: 0x0d0d21 
            }
        });
        graphics.fillRect(10, 10, areaWidth, areaHeight);
        
        this.add.text(screenCenterX, 30, StringEnum.AVOID_SPAM_INSTRUCTION_TITLE, {
            fontSize: '18px'
        }).setOrigin(0.5);

        this.add.text(30, 100, StringEnum.AVOID_SPAM_INSTRUCTION);
        this.add.image(screenCenterX, screenCenterY, 'spam');

        const button = this.add.text(screenCenterX, screenCenterY + 100, StringEnum.AVOID_SPAM_INSTRUCTION_BUTTON, {
            fontSize: '16px',
        }).setOrigin(0.5).setInteractive();
        
        button.on('pointerup', () => {
            this.scene.start('main');
        })
    }
}