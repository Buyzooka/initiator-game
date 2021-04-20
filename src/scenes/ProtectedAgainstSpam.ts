import StringEnum from "../enums/string";

export default class ProtectedAgainstSpam extends Phaser.Scene {
    constructor() {
        super('protected_against_spam');
    } 

    preload() {
        this.load.image('shielded_ship', 'assets/sprites/shielded-ship.png');
    }

    create() {
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        const areaWidth = this.cameras.main.width;
        const areaHeight = this.cameras.main.height;

        this.add.zone(0, 0, areaWidth, areaWidth);
        const graphics = this.add.graphics({ 
            lineStyle: { 
                width: 2, 
                color: 0xffffff
            }, 
            fillStyle: { 
                color: 0x0d0d21 
            }
        });
        graphics.fillRect(0, 0, areaWidth, areaHeight);
        
        this.add.text(30, 30, StringEnum.PROTECTED_AGAINST_SPAM_TITLE, {
            fontSize: (24 * window.devicePixelRatio) + 'px'
        });

        this.add.text(30, 100, StringEnum.PROTECTED_AGAINST_SPAM_INSTRUCTION, {
            fontSize: (15 * window.devicePixelRatio) + 'px'
        });
        this.add.image(screenCenterX, screenCenterY, 'shielded_ship');

        const button = this.add.text(screenCenterX, screenCenterY + 180, StringEnum.PROTECTED_AGAINST_SPAM_BUTTON, {
            fontSize: (15 * window.devicePixelRatio) + 'px'
        }).setOrigin(0.5).setInteractive();
        
        button.on('pointerup', () => {
            this.scene.stop('protected_against_spam');
            this.scene.resume('main');
        })
    }
}