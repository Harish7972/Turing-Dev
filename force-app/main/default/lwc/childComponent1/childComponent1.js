import { LightningElement } from 'lwc';

export default class ChildComponent1 extends LightningElement {
    // Method to dispatch the custom event
    emitCustomEvent() {
        const customEvent = new CustomEvent('sendmessage', {
            detail: 'This is custom event data',  // Sending data with the event
        });
        this.dispatchEvent(customEvent);  // Dispatching the event
    }
}