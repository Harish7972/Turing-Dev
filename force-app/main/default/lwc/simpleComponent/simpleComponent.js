import { LightningElement, api, track } from 'lwc';

export default class SimpleComponent extends LightningElement {
    @track message = 'Hello, World!';

    @api
    changeMessage(newMessage) {
        this.message = newMessage;
    }
}