import { LightningElement } from 'lwc';

export default class CommentSection extends LightningElement {
    connectedCallback() {
        // Adding an event listener in capturing phase
        this.template.addEventListener(
            'click',
            this.handleEventInCapture.bind(this),
            true // Enables capturing phase
        );
    }

    handleEventInCapture(event) {
        // Logs event during the capturing phase
        alert('Captured event at parent: ' + event.target.tagName);
    }

    handlePreventDefault(event) {
        // Prevents default browser action like form submission
        event.preventDefault();
        alert('Default action prevented');
    }

    handleStopPropagation(event) {
        // Stops event from bubbling to parent component
        event.stopPropagation();
        alert('Event propagation stopped at child component');
    }
}