import ApiService from "../services/api.service";

export default class GameOver extends Phaser.Scene {
    apiService: ApiService;
    score: number;

    constructor() {
        super('game_over');
        this.apiService = new ApiService();
    } 

    init(data: any) {
        this.score = data.score;
    }

    preload() {
        this.load.html('register_form', 'assets/html/subscribe.html');
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

        this.add.text(screenCenterX, screenCenterY - 100, 'GAME OVER', {
            fontSize: '30px'
        }).setOrigin(0.5);
        this.add.text(screenCenterX, screenCenterY - 60, `${this.registry.get('playerName')},`, {
            fontSize: '18px'
        }).setOrigin(0.5);
        this.add.text(screenCenterX, screenCenterY - 40, 'YOUR SCORE IS', {
            fontSize: '18px'
        }).setOrigin(0.5);
        this.add.text(screenCenterX, screenCenterY - 10, this.score.toString(), {
            fontSize: '18px'
        }).setOrigin(0.5);

        this.addSubscribeForm(screenCenterX, screenCenterY);
    }

    /**
     * Add subscribe form into GameOver scene
     * @param screenCenterX 
     * @param screenCenterY 
     */
    private addSubscribeForm(screenCenterX: number, screenCenterY: number): void {
        const element = this.add.dom(screenCenterX, screenCenterY + 120)
            .createFromCache('register_form');

        element.addListener('click');
        element.on('click', async (event) => {
            if (event.target.name !== 'save_email_btn') {
                return;
            }

            const playerEmail = element.getChildByName('email');
            if ((playerEmail as HTMLFormElement).value === '') {
                return;
            }

            const data = {
                email: (playerEmail as HTMLFormElement).value,
                points: +this.score,
                token: this.registry.get('player')
            };

            try {
                await this.apiService.sendScore(data);
                // this.scene.start('ranking');
            } catch (e) {
                alert('Error.');
                (playerEmail as HTMLFormElement).value = '';
            }
        });
    }
}