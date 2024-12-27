import { LightningElement } from 'lwc';

export default class DashboardParentComponent extends LightningElement {
    message = '';

    // handleClick method
    handleClick() {
        this.message = 'Button was clicked!';
        alert(this.message);
    }

    // handleChange method
    handleChange(event) {
        this.message = `You typed: ${event.target.value}`;
    }

    // handleCustomEvent method for custom events
    handleCustomEvent(event) {
        this.message = `Received custom event with data: ${event.detail}`;
    }

    // Arrow function for event handling (e.g., a button click)
    handleClickArrow = () => {
        this.message = 'Arrow function button clicked!';
        alert(this.message);
    };
}