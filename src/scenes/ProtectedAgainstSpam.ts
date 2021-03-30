export default class ProtectedAgainstSpam extends Phaser.Scene {
    constructor() {
        super('protected_against_spam');
    } 

    create() {
        this.add.text(10, 10, 'WOOHOO');
    }
}