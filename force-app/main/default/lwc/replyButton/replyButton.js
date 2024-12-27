import { LightningElement } from 'lwc';

export default class ReplyButton extends LightningElement {
    // Handle button click and stop event propagation
    handleButtonClick(event) {
        event.stopPropagation();
        alert('Reply button clicked!');
    }
}