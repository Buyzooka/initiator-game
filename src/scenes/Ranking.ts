import StringEnum from "../enums/string";
import ApiService from "../services/api.service";

export default class Ranking extends Phaser.Scene {
    apiService: ApiService;
    playerRanking: number;
    playersCount: number;
    lead: any;

    constructor() {
        super('ranking');
        this.apiService = new ApiService();
    } 

    init(data: any) {
        this.lead = data.lead;
    }

    preload() {
        this.load.html('referral-block', 'assets/html/referral-block.html');
    }

    async create() {
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

        this.add.text(screenCenterX, 30, StringEnum.RANKING_TITLE, {
            fontSize: '18px'
        }).setOrigin(0.5);

        const response = await this.apiService.getRanking(this.lead, this.registry.get('player'));
        const { ranking } = await response.json();

        this.add.text(30, 100, `You're #${ranking.playerRanking} over ${ranking.totalPlayersCount} players`, {
            fontSize: '18px'
        });

        this.add.text(30, 130, StringEnum.RANKING_INSTRUCTION);

        this.addReferralBlock(screenCenterX, screenCenterY);
    }

    private addReferralBlock(screenCenterX: number, screenCenterY: number): void {
        const referral_link = `https://play.buyzooka.io/?ref=${this.lead.referral_code}`;
        const element = this.add.dom(screenCenterX, screenCenterY + 120)
            .createFromCache('referral-block');

        const link = element.getChildByProperty('id', 'referral-link') as HTMLInputElement;
        link.value = referral_link;

        element.addListener('click');
        element.on('click', async (event) => {
            if (event.target.name !== 'share_btn') {
                return;
            }

            const shareData = {
                title: 'Play Buyzooka',
                text: 'Beat my score on Buyzooka!',
                url: referral_link,
            }
             
            try {
                if (navigator.share !== undefined) {
                    await navigator.share(shareData);
                } else {
                    var copyText = link;
                    copyText.select();
                    document.execCommand("copy");
                    alert('Copied to clipboard.')
                }
            } catch(err) {
                console.error(err);
            }
        })
    }
}