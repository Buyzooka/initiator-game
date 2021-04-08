import ProtectedAgainstSpam from "./ProtectedAgainstSpam";
import GameOver from "./GameOver";
import KillAmazin from "./KillAmazin";

export default class Main extends Phaser.Scene {
    amazinObjectsGroup: Phaser.Physics.Arcade.Group;
    amazinItemTimedEvent: Phaser.Time.TimerEvent;
    buyzookaObjectsGroup: Phaser.Physics.Arcade.Group;
    buyzookaItemTimedEvent: Phaser.Time.TimerEvent;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    height: number;
    levelText: Phaser.GameObjects.Text;
    livesText: Phaser.GameObjects.Text;
    difficulty: number;
    player: Phaser.Physics.Arcade.Image;
    playerHasShield: boolean;
    productObjectsGroup: Phaser.Physics.Arcade.Group;
    productTimedEvent: Phaser.Time.TimerEvent;
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
        this.difficulty = 1;
    }

    preload() {
        this.load.image('amazin', 'assets/sprites/amazin.png');
        this.load.image('amazin_ko', 'assets/sprites/amazin_ko.png');
        this.load.image('bike', 'assets/sprites/bike.png');
        this.load.image('buyzooka', 'assets/sprites/buyzooka.png');
        this.load.image('camera', 'assets/sprites/camera.png');
        this.load.image('computer', 'assets/sprites/computer.png');
        this.load.image('ship', 'assets/sprites/ship.png');
        this.load.image('shielded_ship', 'assets/sprites/shielded-ship.png');
        this.load.image('shoes', 'assets/sprites/shoes.png');
        this.load.image('smartphone', 'assets/sprites/smartphone.png');
        this.load.image('spam', 'assets/sprites/spam.png');

        this.game.scene.add('game_over', new GameOver(), false);
        this.game.scene.add('kill_amazin', new KillAmazin(), false);
        this.game.scene.add('protected_against_spam', new ProtectedAgainstSpam(), false);
    }

    create() {
        this.cameras.main.setBackgroundColor('#0d0d21');
        this.cursors = this.input.keyboard.createCursorKeys();

        this.initData();
        this.initPlayer();
        this.initText();
        this.startLevel1();
    }

    update() {
        if (this.data.get('lives') === 0) {
            this.scene.start('game_over', {
                score: this.data.get('score')
            });
            return;
        }

        this.handlePlayerUpdate();
        this.checkIfSpamHitsBoundaries();
        this.checkIfBuyzookaItemHitsGround();
        this.checkIfProductHitsGround();
        this.scoreText.setText(`Score: ${this.data.get('score')}`);
        this.livesText.setText(`Lives: ${this.data.get('lives')}`);
        this.levelText.setText(`Level: ${this.data.get('level')}`);
    }

    /**
     * Init scene data
     */
    initData(): void {
        this.data.set('score', 0);
        this.data.set('lives', 3);
        this.data.set('level', 1);
    }

    /**
     * Init player with hitbox and movable attributes
     */
    initPlayer(): void {
        this.playerHasShield = false;
        this.player = this.physics.add.image(this.width / 2, this.height - 64, 'ship');
        this.player.setCircle(38);

        this.player.setImmovable();
        this.player.setCollideWorldBounds(true);
    }

    /**
     * Level 1 start
     */
    startLevel1(): void {
        this.initSpamSpawn();
        this.initBuyzookaSpawn();
        this.initProductSpawn();
        this.initAmazinSpawn();
    }

    /**
     * Init spam spawn 
     */
    initSpamSpawn(): void {
        this.spamObjectsGroup = this.physics.add.group({
            defaultKey: 'spam',
            collideWorldBounds: true
        });

        this.spamObjectsGroup.scaleXY(this.scaleRatio, this.scaleRatio);
        this.spamTimedEvent = this.time.addEvent({ delay: 1000, callback: this.createSpam, callbackScope: this, loop: true });
        this.physics.add.collider(this.spamObjectsGroup, this.player, (o1, o2) => this.spamHitsPlayer(o1, o2), null, this);
    }

    /**
     * Init buyzooka item spawn
     */
    initBuyzookaSpawn(): void {
        this.buyzookaObjectsGroup = this.physics.add.group({
            defaultKey: 'buyzooka',
            collideWorldBounds: true
        });

        this.buyzookaObjectsGroup.scaleXY(this.scaleRatio, this.scaleRatio);
        this.buyzookaItemTimedEvent = this.time.addEvent({ delay: 10200, callback: this.createBuyzookaItem, callbackScope: this, loop: true });
        this.physics.add.collider(this.buyzookaObjectsGroup, this.player, (o1, o2) => this.buyzookaItemHitsPlayer(o1, o2), null, this);
    }

    /**
     * Init product spawn
     */
    initProductSpawn(): void {
        this.productObjectsGroup = this.physics.add.group({
            defaultKey: 'shoes'
        });

        this.productObjectsGroup.scaleXY(this.scaleRatio, this.scaleRatio);
        this.productTimedEvent = this.time.addEvent({ delay: 2100, callback: this.createProduct, callbackScope: this, loop: true });
        this.physics.add.collider(this.productObjectsGroup, this.player, (o1, o2) => this.productHitsPlayer(o1, o2), null, this);
    }

    /**
     * Init Amazin spawn
     */
    initAmazinSpawn(): void {
        this.amazinObjectsGroup = this.physics.add.group({
            defaultKey: 'amazin'
        });

        this.amazinItemTimedEvent = this.time.addEvent({ delay: 30 * 1000, callback: this.startLevel2, callbackScope: this, loop: false});
        this.physics.add.collider(this.amazinObjectsGroup, this.player, (o1, o2) => this.amazinHitsPlayer(o1, o2), null, this);
        this.physics.add.collider(this.amazinObjectsGroup, this.productObjectsGroup, (o1, o2) => this.amazinHitsProduct(o1, o2), null, this);
    }

    /**
     * Init all texts on screen that displays scene data
     */
    initText(): void {
        this.scoreText = this.add.text(20, this.height - 60, `Score: ${this.data.get('score')}`);
        this.livesText = this.add.text(this.width - 100, this.height - 40, `Lives: ${this.data.get('lives')}`);
        this.levelText = this.add.text(20, this.height - 40, `Level: ${this.data.get('level')}`);
    }

    /**
     * Create a spam in scene
     */
    createSpam(): void {
        const spam = this.spamObjectsGroup.create(this.getRandomX(), 0);
        spam.setCircle(25);
        spam.body.bounce.set(1);
    }

    /**
     * Create buyzooka item in scene
     */
    createBuyzookaItem(): void {
        if (this.playerHasShield) {
            this.buyzookaItemTimedEvent.remove();
            return;
        }

        this.buyzookaObjectsGroup.create(this.getRandomX(), 0).setCircle(24);
    }

    /**
     * Create product in scene
     */
    createProduct(): void {
        this.productObjectsGroup.create(this.getRandomX(), 0, this.getRandomProductKey()).setCircle(32);
    }

    /**
     * Start level 2
     */
    startLevel2(): void {
        this.data.set('level', 2);
        this.scene.pause('main');
        this.scene.launch('kill_amazin');

        this.spamTimedEvent.remove();
        this.buyzookaItemTimedEvent.remove();

        this.time.addEvent({ delay: 0, callback: this.createAmazin, callbackScope: this });
        this.amazinItemTimedEvent = this.time.addEvent({ delay: 20 * 1000, callback: this.createAmazin, callbackScope: this, loop: true });
        this.productTimedEvent = this.time.addEvent({ delay: 800, callback: this.createProduct, callbackScope: this, loop: true });
        this.spamTimedEvent = this.time.addEvent({ delay: 400, callback: this.createSpam, callbackScope: this, loop: true });
        this.time.addEvent({ delay: 30 * 1000, callback: this.nextLevel, callbackScope: this });
    }

    /**
     * Start next level
     */
    nextLevel(): void {
        this.data.inc('level');
        this.difficulty++;
        this.spamTimedEvent.remove();
        this.productTimedEvent.remove();
        this.amazinItemTimedEvent.remove();

        this.time.addEvent({ delay: 0, callback: this.createAmazin, callbackScope: this });
        this.amazinItemTimedEvent = this.time.addEvent({ delay: (20 * 1000) / this.difficulty, callback: this.createAmazin, callbackScope: this, loop: true });
        this.productTimedEvent = this.time.addEvent({ delay: 800 / this.difficulty, callback: this.createProduct, callbackScope: this, loop: true });
        this.spamTimedEvent = this.time.addEvent({ delay: 400 / this.difficulty, callback: this.createSpam, callbackScope: this, loop: true });
    }

    /**
     * Create Amazin 
     */
    createAmazin(): void {
        const amazin = this.amazinObjectsGroup.create(this.getRandomX(), 0, 'amazin');
        amazin.setCircle(45);
        amazin.body.bounce.set(1);
        amazin.body.collideWorldBounds = true;
        amazin.setData('lives', 3);
    }

    /**
     * Get random X number between 0 and scene width
     * 
     * @returns number
     */
    private getRandomX(): number {
        return Math.random() * (this.width - 0) + 0;
    }

    /**
     * Get random product key
     * 
     * @returns string
     */
    private getRandomProductKey(): string {
        const keys = ['bike', 'camera', 'computer', 'shoes', 'smartphone'];
        
        return keys[Math.floor(Math.random() * keys.length)];
    } 

    /**
     * Handle player mouvements
     */
    handlePlayerUpdate(): void {
        this.player.setVelocityX(0);

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-500);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(500);
        }
    }

    /**
     * Handle spam mouvement and destroy when hitting scene boudaries
     */
    checkIfSpamHitsBoundaries(): void {
        const spams = this.spamObjectsGroup.getChildren();
        spams.forEach(spam => {
            const spamObj = (spam as Phaser.GameObjects.Image);
            if (
                (spamObj.y + spamObj.height) < this.height
                && spamObj.x > spamObj.width 
                && spamObj.x + spamObj.width < this.width
            ) {
                return;
            }

            this.spamObjectsGroup.remove(spam, true, true);
        });
    }

    /**
     * Remove buyzooka's item when hit the ground
     */
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

    /**
     * Remove product when hit the ground
     */
    checkIfProductHitsGround(): void {
        const products = this.productObjectsGroup.getChildren();
        products.forEach(product => {
            const productObj = (product as Phaser.GameObjects.Image);
            if ((productObj.y + productObj.height) < this.height) {
                return;
            }

            if (this.playerHasShield) {
                this.decrementsLives();
            }

            this.productObjectsGroup.remove(product, true, true);
        });
    }

    /**
     * Triggered when spam hits player
     * 
     * @param player 
     * @param spam 
     */
    spamHitsPlayer(player: Phaser.Types.Physics.Arcade.GameObjectWithBody, spam: Phaser.Types.Physics.Arcade.GameObjectWithBody): void {
        if (this.playerHasShield) {
            this.addScore(5);
        } else {
            this.decrementsLives();
            this.spamObjectsGroup.remove(spam, true, true);
        }
    }

    /**
     * Triggered when buyzooka's item hits player
     * 
     * @param player 
     * @param item 
     */
    buyzookaItemHitsPlayer(player: Phaser.Types.Physics.Arcade.GameObjectWithBody, item: Phaser.Types.Physics.Arcade.GameObjectWithBody): void {
        if (this.playerHasShield) {
            return;
        } else {
            this.playerHasShield = true;
            this.player.setTexture('shielded_ship');
            this.scene.pause('main');
            this.scene.launch('protected_against_spam');
        }

        this.buyzookaObjectsGroup.remove(item, true, true);
    }

    /**
     * Triggered when product hits player
     * 
     * @param player 
     * @param product 
     */
    productHitsPlayer(player: Phaser.Types.Physics.Arcade.GameObjectWithBody, product: Phaser.Types.Physics.Arcade.GameObjectWithBody): void {
        this.addScore(50);
        this.productObjectsGroup.remove(product, true, true);
    }

    /**
     * Triggered when Amazin hits the player
     * 
     * @param player 
     * @param amazin 
     */
    amazinHitsPlayer(player: Phaser.Types.Physics.Arcade.GameObjectWithBody, amazin: Phaser.Types.Physics.Arcade.GameObjectWithBody): void {
        if (this.playerHasShield) {
            const newLives = +(amazin.getData('lives')) - 1;
            amazin.setData('lives', newLives);

            if (newLives <= 0) {
                amazin.body.bounce.set(0);
                this.amazinObjectsGroup.remove(amazin, true, true);
                this.addScore(135);
            }
        } else {
            this.decrementsLives();
        }
    }

    /**
     * Triggered when Amazin hits a product 
     * 
     * @param product 
     * @param amazin 
     */
    amazinHitsProduct(amazin: Phaser.Types.Physics.Arcade.GameObjectWithBody, product: Phaser.Types.Physics.Arcade.GameObjectWithBody): void {
        this.productObjectsGroup.remove(product, true, true);
    }

    /**
     * Add points to player's score
     * 
     * @param points 
     */
    private addScore(points: number): void {
        this.data.inc('score', points);
    }

    /**
     * Decrement player's remaining lives
     */
    private decrementsLives(): void {
        this.data.inc('lives', -1);
    }
}