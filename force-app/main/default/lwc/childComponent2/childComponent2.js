import { LightningElement, api } from 'lwc';

export default class ChildComponent2 extends LightningElement {
    @api message;  // Exposed property

    @api
    changeMessage(newMessage) {
        this.message = newMessage;  // Method to change message
    }
}