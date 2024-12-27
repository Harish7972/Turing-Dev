import { LightningElement, track, wire } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import ErrorAlertChannel from '@salesforce/messageChannel/ErrorAlertChannel__c';

export default class ErrorAlertComponent extends LightningElement {
    @track showAlert = false; // Control visibility
    @track message = ''; // Message to display
    @track alertType = 'error'; // Default alert type

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.subscribeToAlerts();
    }

    subscribeToAlerts() {
        subscribe(
            this.messageContext,
            ErrorAlertChannel,
            (message) => this.handleAlert(message)
        );
    }

    handleAlert(message) {
        this.message = message.error || 'Something happened!';
        this.alertType = message.alertType || 'error';
        this.showAlert = true;

        // Auto-hide alert after 5 seconds
        setTimeout(() => {
            this.showAlert = false;
        }, 5000);
    }

    get alertClass() {
        return `alert ${this.alertType}`;
    }
}