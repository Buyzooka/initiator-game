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
        
        this.add.text(screenCenterX, 60, StringEnum.KILL_AMAZIN_TITLE, {
            fontSize: (24 * window.devicePixelRatio) + 'px'
        }).setOrigin(0.5);

        this.add.text(30, 100, StringEnum.KILL_AMAZIN_INSTRUCTION, {
            fontSize: (15 * window.devicePixelRatio) + 'px'
        });

        this.add.image(screenCenterX, screenCenterY, 'amazin').setScale(window.devicePixelRatio, window.devicePixelRatio);

        const button = this.add.text(screenCenterX, screenCenterY + 250, StringEnum.KILL_AMAZIN_BUTTON, {
            fontSize: (15 * window.devicePixelRatio) + 'px'
        }).setOrigin(0.5).setInteractive();
        
        button.on('pointerup', () => {
            this.scene.stop('kill_amazin');
            this.scene.resume('main');
        })
    }
}