import { LightningElement, api } from 'lwc';

export default class ChildComponent3 extends LightningElement {
    @api sessionStatus; // Receives session status from the parent

    // Handles session change events dispatched from the parent
    handleSessionChange(event) {
        this.sessionStatus = event.detail.sessionStatus;
    }
}