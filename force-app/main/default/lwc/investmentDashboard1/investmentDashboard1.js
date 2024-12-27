import { LightningElement } from 'lwc';

// This is the main component for the investment dashboard.
export default class InvestmentDashboard extends LightningElement {

    // Handles the click event for the button in the dashboard
    handleClick() {
        // Alerts the user when the button is clicked
        alert('Button clicked!');
    }

    // Handles the change event when the user types in the input field
    handleChange(event) {
        // Gets the value from the input field
        const inputValue = event.target.value;
        // Alerts the user with the updated input value
        alert(`Input changed: ${inputValue}`);
    }

    // Handles custom events emitted by the investment widget component
    handleCustomEvent(event) {
        // Accesses the event data (details) passed from the custom event
        alert(`Custom event received with detail: ${event.detail}`);
    }
}