import { IModal } from "../interfaces/imodal";

export class ModalService {
    constructor({ scene, width, height, x, y}: IModal) {
        const handleName = 'modal';
        const modal = scene.add.zone(x, y, width, height)
            .setInteractive()
            .setOrigin(0);
        
        scene.scene.add(handleName, modal, true);
    }

    destroy(handleName: string): void {
        
    }
}