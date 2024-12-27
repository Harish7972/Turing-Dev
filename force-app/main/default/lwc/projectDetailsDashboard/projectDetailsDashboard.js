import { LightningElement } from 'lwc';

export default class ProjectDetailsDashboard extends LightningElement {
    message = 'Hello, Child Component!'; // Default message

    // Method to capture the input value and update the child component
    handleMessageChange() {
        const inputField = this.template.querySelector('lightning-input');
        const newMessage = inputField.value; // Get the input value
        this.template.querySelector('c-project-message-display').changeMessage(newMessage);
    }
}