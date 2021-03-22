export default class Main extends Phaser.Scene {
    height: number;
    scaleRatio: number;
    spamObjectsGroup: Phaser.Physics.Arcade.Group;
    timedEvent: Phaser.Time.TimerEvent;
    width: number;

    constructor() {
        super('main');
        this.height = window.innerHeight;
        this.scaleRatio = window.devicePixelRatio;
        this.width = window.innerWidth;
        console.log(this.width, this.height);
    }

    preload() {
        this.load.image('spam', 'assets/sprites/spam.png');
    }

    create() {
        this.physics.world.gravity.y = 60;

        this.spamObjectsGroup = this.physics.add.group({
            defaultKey: 'spam',
            bounceX: 0,
            bounceY: 0,
            collideWorldBounds: true
        });
        this.spamObjectsGroup.scaleXY(this.scaleRatio, this.scaleRatio);

        this.timedEvent = this.time.addEvent({ delay: 2500, callback: this.createSpam, callbackScope: this, loop: true })
    }

    update() {
        this.checkIfSpamHitsGround();
    }

    createSpam() {
        this.spamObjectsGroup.create(this.getRandomX(), 0).setGravity(0, 100);
    }

    getRandomX(): number {
        return Math.random() * (this.width - 0) + 0;
    }

    checkIfSpamHitsGround(): void {
        const spams = this.spamObjectsGroup.getChildren();
        spams.forEach(spam => {
            const spamObj = (spam as Phaser.GameObjects.Image);
            if ((spamObj.y + spamObj.height) < this.height) {
                return;
            }

            this.spamObjectsGroup.remove(spam, true, true);
        });
    }
}