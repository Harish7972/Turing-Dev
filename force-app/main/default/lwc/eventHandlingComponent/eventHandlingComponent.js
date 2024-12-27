import { LightningElement } from 'lwc';

export default class EventHandlingComponent extends LightningElement {
    constructor() {
        super();
        // Bind the method to keep `this` context
        this.handleClick = this.handleClick.bind(this);
    }

    connectedCallback() {
        this.template.addEventListener('click', this.handleClick);
    }

    disconnectedCallback() {
        this.template.removeEventListener('click', this.handleClick);
    }

    handleClick(event) {
        console.log('Button was clicked:', event);
    }
}