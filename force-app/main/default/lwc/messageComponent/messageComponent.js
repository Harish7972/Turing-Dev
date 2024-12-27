import { LightningElement } from 'lwc';

export default class MessageComponent extends LightningElement {
    handleClick() {
        // Dispatching the custom event with update details
        const updateEvent = new CustomEvent('projectupdate', {
            detail: {
                message: 'New project update available!',
                projectName: 'Project Phoenix'
            }
        });
        this.dispatchEvent(updateEvent);
    }
}