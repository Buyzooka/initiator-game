export default class Main extends Phaser.Scene {
    buyzookaObjectsGroup: Phaser.Physics.Arcade.Group;
    buyzookaItemTimedEvent: Phaser.Time.TimerEvent;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    height: number;
    livesText: Phaser.GameObjects.Text;
    player: Phaser.Physics.Arcade.Image;
    playerHasShield: boolean;
    scaleRatio: number;
    scoreText: Phaser.GameObjects.Text;
    spamObjectsGroup: Phaser.Physics.Arcade.Group;
    spamTimedEvent: Phaser.Time.TimerEvent;
    width: number;

    constructor() {
        super('main');
        this.height = window.innerHeight;
        this.scaleRatio = window.devicePixelRatio;
        this.width = window.innerWidth;
    }

    preload() {
        this.load.image('buyzooka', 'assets/sprites/buyzooka.png');
        this.load.image('ship', 'assets/sprites/ship.png');
        this.load.image('shielded_ship', 'assets/sprites/shielded-ship.png');
        this.load.image('spam', 'assets/sprites/spam.png');
    }

    create() {
        // this.physics.world.gravity.y = 60;
        this.cursors = this.input.keyboard.createCursorKeys();

        this.initData();
        this.initPlayer();
        this.initSpamSpawn();
        this.initBuyzookaSpawn();
        this.initText();
    }

    update() {
        if (this.data.get('lives') === 0) {
            alert('GAME OVER');
            return;
        }

        this.handlePlayerUpdate();
        this.checkIfSpamHitsGround();
        this.checkIfBuyzookaItemHitsGround();
        this.scoreText.setText(`Score: ${this.data.get('score')}`);
        this.livesText.setText(`Lives: ${this.data.get('lives')}`);
    }

    initData(): void {
        this.data.set('score', 0);
        this.data.set('lives', 3);
    }

    initPlayer(): void {
        this.playerHasShield = false;
        this.player = this.physics.add.image(this.width / 2, this.height - 64, 'ship');
        this.player.setMass(0);
        this.player.setGravity(0);

        this.player.setImmovable();
        this.player.setCollideWorldBounds(true);
    }

    initSpamSpawn(): void {
        this.spamObjectsGroup = this.physics.add.group({
            defaultKey: 'spam',
            bounceX: 0,
            bounceY: 0,
            collideWorldBounds: true
        });

        this.spamObjectsGroup.scaleXY(this.scaleRatio, this.scaleRatio);
        this.spamTimedEvent = this.time.addEvent({ delay: 1600, callback: this.createSpam, callbackScope: this, loop: true });
        this.physics.add.collider(this.spamObjectsGroup, this.player, (o1, o2) => this.spamHitsPlayer(o1, o2), null, this);
    }

    initBuyzookaSpawn(): void {
        this.buyzookaObjectsGroup = this.physics.add.group({
            defaultKey: 'buyzooka',
            bounceX: 0,
            bounceY: 0,
            collideWorldBounds: true
        });

        this.buyzookaObjectsGroup.scaleXY(this.scaleRatio, this.scaleRatio);
        this.buyzookaItemTimedEvent = this.time.addEvent({ delay: 10200, callback: this.createBuyzookaItem, callbackScope: this, loop: true });
        this.physics.add.collider(this.buyzookaObjectsGroup, this.player, (o1, o2) => this.buyzookaItemHitsPlayer(o1, o2), null, this);
    }

    initText(): void {
        this.scoreText = this.add.text(20, this.height - 40, `Score: ${this.data.get('score')}`);
        this.livesText = this.add.text(this.width - 100, this.height - 40, `Lives: ${this.data.get('lives')}`);
    }

    createSpam() {
        this.spamObjectsGroup.create(this.getRandomX(), 0).setGravity(0, 100);
    }

    createBuyzookaItem() {
        if (this.playerHasShield) {
            this.buyzookaItemTimedEvent.remove();
            return;
        }

        this.buyzookaObjectsGroup.create(this.getRandomX(), 0).setGravity(0, 100);
    }

    getRandomX(): number {
        return Math.random() * (this.width - 0) + 0;
    }

    handlePlayerUpdate(): void {
        this.player.setVelocityX(0);

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-500);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(500);
        }
    }

    checkIfSpamHitsGround(): void {
        const spams = this.spamObjectsGroup.getChildren();
        spams.forEach(spam => {
            const spamObj = (spam as Phaser.GameObjects.Image);
            if ((spamObj.y + spamObj.height) < this.height) {
                return;
            }

            this.spamObjectsGroup.remove(spam, true, true);

            if (this.playerHasShield) {
                this.decrementsLives();
            }
        });
    }

    checkIfBuyzookaItemHitsGround(): void {
        const items = this.buyzookaObjectsGroup.getChildren();
        items.forEach(item => {
            const itemObj = (item as Phaser.GameObjects.Image);
            if ((itemObj.y + itemObj.height) < this.height) {
                return;
            }

            this.buyzookaObjectsGroup.remove(item, true, true);
        });
    }

    spamHitsPlayer(player: Phaser.Types.Physics.Arcade.GameObjectWithBody, spam: Phaser.Types.Physics.Arcade.GameObjectWithBody): void {
        if (this.playerHasShield) {
            this.addScore(15);
        } else {
            this.decrementsLives();
        }

        this.spamObjectsGroup.remove(spam, true, true);
    }

    buyzookaItemHitsPlayer(player: Phaser.Types.Physics.Arcade.GameObjectWithBody, item: Phaser.Types.Physics.Arcade.GameObjectWithBody): void {
        if (this.playerHasShield) {
            return;
        } else {
            this.playerHasShield = true;
            this.player.setTexture('shielded_ship');
        }

        this.buyzookaObjectsGroup.remove(item, true, true);
    }

    private addScore(points: number): void {
        this.data.inc('score', points);
    }

    private decrementsLives(): void {
        this.data.inc('lives', -1);
    }
}