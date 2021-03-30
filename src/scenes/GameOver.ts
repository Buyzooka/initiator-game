export default class GameOver extends Phaser.Scene {
    score: number;

    constructor() {
        super('game_over');
    } 

    init(data: any) {
        this.score = data.score;
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

        this.add.text(screenCenterX, screenCenterY, 'GAME OVER', {
            fontSize: '30px'
        }).setOrigin(0.5);
        this.add.text(screenCenterX, screenCenterY + 50, 'YOUR SCORE IS', {
            fontSize: '18px'
        }).setOrigin(0.5);
        this.add.text(screenCenterX, screenCenterY + 80, this.score.toString(), {
            fontSize: '18px'
        }).setOrigin(0.5);
    }
}