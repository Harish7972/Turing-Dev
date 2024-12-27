import { LightningElement } from 'lwc';

export default class ParentComponent extends LightningElement {
    message = '';

    connectedCallback() {
        // Listen for the custom event 'customEvent' dispatched by child component
        this.addEventListener('customEvent', this.handleCustomEvent);
    }

    handleCustomEvent(event) {
        // Log event detail for debugging
        console.log('Received custom event data:', event.detail);
        this.message = `Received data: ${event.detail}`;
    }
}