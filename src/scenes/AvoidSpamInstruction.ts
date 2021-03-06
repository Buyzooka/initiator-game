import StringEnum from "../enums/string";
import ApiService from "../services/api.service";
import Main from "./Main";

export default class AvoidSpamInstruction extends Phaser.Scene {
    apiService: ApiService;
    spam: Phaser.GameObjects.Image;

    constructor() {
        super('avoid_spam_instruction');
        this.apiService = new ApiService();
    } 

    preload() {
        this.load.image('spam', 'assets/sprites/spam.png');
        this.load.html('nickname_form', 'assets/html/nickname.html');
        this.game.scene.add('main', new Main());
    }

    create() {
        const screenCenterX = ((this.cameras.main.worldView.x + this.cameras.main.width)) / 2;
        const screenCenterY = ((this.cameras.main.worldView.y + this.cameras.main.height)) / 2;
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
        
        this.add.text(30, 60, StringEnum.AVOID_SPAM_INSTRUCTION_TITLE, {
            fontSize: (24 * window.devicePixelRatio) + 'px'
        });

        this.add.text(30, 130, StringEnum.AVOID_SPAM_INSTRUCTION, {
            fontSize: (15 * window.devicePixelRatio) + 'px'
        });

        this.spam = this.add.image(screenCenterX, screenCenterY - 150, 'spam');
            
        this.addNicknameForm(screenCenterX, screenCenterY + 350);
    }

    update() {
        this.spam.rotation += 0.01;
    }

    private addNicknameForm(x: number, y: number): void {
        const element = this.add.dom(x, y)
            .createFromCache('nickname_form')
            .setScale(window.devicePixelRatio, window.devicePixelRatio);

        element.addListener('click');
        element.on('click', async (event) => {
            if (event.target.name !== 'save_nickname_btn') {
                return;
            }

            const playerNick = element.getChildByName('nickname');
            if ((playerNick as HTMLFormElement).value === '') {
                return;
            }

            const data = {
                nickname: (playerNick as HTMLFormElement).value,
                origin: window.location.href
            };

            try {
                const response = await this.apiService.createPlayer(data);
                const player = (await response.json()).player;

                if (typeof(player) !== 'string') {
                    throw new Error('Username already taken');
                }
                
                this.registry.set('player', player);
                this.registry.set('playerName', data.nickname);
                this.scene.start('main');
            } catch (e) {
                alert(e);
                (playerNick as HTMLFormElement).value = '';
            }
        });
    }
}