import { LightningElement, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import ErrorAlertChannel from '@salesforce/messageChannel/ErrorAlertChannel__c';

export default class ErrorPublisherComponent extends LightningElement {
    @wire(MessageContext)
    messageContext;

    publishError() {
        this.publishAlert('An error occurred during task processing!', 'error');
    }

    publishWarning() {
        this.publishAlert('Warning: Task deadline is approaching!', 'warning');
    }

    publishSuccess() {
        this.publishAlert('Success: Task completed successfully!', 'success');
    }

    publishAlert(message, alertType) {
        const alertMessage = { error: message, alertType };
        publish(this.messageContext, ErrorAlertChannel, alertMessage);
    }
}