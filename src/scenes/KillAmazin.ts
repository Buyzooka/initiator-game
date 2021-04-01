import StringEnum from "../enums/string";

export default class KillAmazin extends Phaser.Scene {
    constructor() {
        super('kill_amazin');
    } 

    preload() {
        this.load.image('amazin', 'assets/sprites/amazin.png');
    }

    create() {
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        const areaWidth = this.cameras.main.width;
        const areaHeight = this.cameras.main.height;

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
        
        this.add.text(screenCenterX, 30, StringEnum.KILL_AMAZIN_TITLE, {
            fontSize: '18px'
        }).setOrigin(0.5);

        this.add.text(30, 100, StringEnum.KILL_AMAZIN_INSTRUCTION);
        this.add.image(screenCenterX, screenCenterY, 'amazin');

        const button = this.add.text(screenCenterX, screenCenterY + 100, StringEnum.KILL_AMAZIN_BUTTON, {
            fontSize: '16px',
        }).setOrigin(0.5).setInteractive();
        
        button.on('pointerup', () => {
            this.scene.stop('kill_amazin');
            this.scene.resume('main');
        })
    }
}