// Child component that exposes properties and methods
import { LightningElement, api } from 'lwc';

export default class ProjectMessageDisplay extends LightningElement {
    @api message;  // Exposed property to receive message from parent

    // Exposed method to change message from parent
    @api
    changeMessage(newMessage) {
        this.message = newMessage;
    }
}