import { LightningElement, api, track } from 'lwc';

export default class ReservationActions extends LightningElement {
    @api carId;
    @track isModalOpen = false;

    handleReserve(event) {
        event.stopPropagation();
        this.isModalOpen = true;
    }
}