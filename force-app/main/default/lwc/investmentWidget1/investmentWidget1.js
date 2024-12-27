import { LightningElement } from 'lwc';

// This is the investment widget component that emits custom events to the parent component
export default class InvestmentWidget extends LightningElement {

    // Method to emit a custom event when the button in the widget is clicked
    emitCustomEvent() {
        // Creates a new custom event named 'custom' with event data (details)
        const customEvent = new CustomEvent('custom', {
            detail: 'This is custom event data.',
        });
        // Dispatches the custom event to the parent component (investmentDashboard)
        this.dispatchEvent(customEvent);
    }
}