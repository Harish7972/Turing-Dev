import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class TaskForm extends LightningElement {
    // Handle the Save button click
    handleSave(event) {
        event.preventDefault();
        this.showToast('Success', 'preventDefault called: Task saved successfully', 'success');
    }

    // Show toast notification
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }
}