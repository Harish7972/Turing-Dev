import { LightningElement } from 'lwc';

export default class TimerComponent extends LightningElement {
    timerId;

    connectedCallback() {
        // Start a timer when the component is added to the DOM
        this.timerId = setInterval(() => {
           // console.log('Interval running');
        }, 10);
    }

    disconnectedCallback() {
        // Clear the timer when the component is removed from the DOM
        clearInterval(this.timerId);
        console.log('Interval cleared');
    }
}