import { LightningElement } from 'lwc';

export default class PerformanceOptimizedComponent extends LightningElement {
    timerId;

    connectedCallback() {
        // Start an interval and add an event listener when the component is added to the DOM
        this.timerId = setInterval(() => {
           // console.log('Interval is active');
        }, 1000);
        
        window.addEventListener('resize', this.handleResize);
    }

    disconnectedCallback() {
        // Clear the interval and remove the event listener when the component is removed from the DOM
        clearInterval(this.timerId);
        window.removeEventListener('resize', this.handleResize);
        console.log('Resources have been cleared');
    }

    handleResize(event) {
        console.log('Window resized:', event);
    }
}