import { LightningElement, track } from 'lwc';
import { publish } from 'lightning/messageService';
import TASK_ALERT_CHANNEL from '@salesforce/messageChannel/ErrorAlertChannel__c';

export default class TaskManagement extends LightningElement {
    @track tasks = [
        { id: '1', name: 'Task 1' },
        { id: '2', name: 'Task 2' },
        { id: '3', name: 'Task 3' },
    ];

    // Handle Error alert
    handlePublishError(event) {
        const taskId = event.target.dataset.id;
        this.publishAlert('Error', `Error occurred on Task ${taskId}`);
    }

    // Handle Warning alert
    handlePublishWarning(event) {
        const taskId = event.target.dataset.id;
        this.publishAlert('Warning', `Warning for Task ${taskId}`);
    }

    // Handle Success alert
    handlePublishSuccess(event) {
        const taskId = event.target.dataset.id;
        this.publishAlert('Success', `Task ${taskId} completed successfully`);
    }

    // Publish the alert to the LMS (Lightning Message Service)
    publishAlert(type, message) {
        const messagePayload = {
            type: type,
            message: message
        };
        publish(this.messageContext, TASK_ALERT_CHANNEL, messagePayload);
    }
}