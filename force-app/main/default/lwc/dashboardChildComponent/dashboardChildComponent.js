import { LightningElement } from 'lwc';

export default class DashboardChildComponent extends LightningElement {
    // emitCustomEvent method to trigger custom event
    emitCustomEvent() {
        const customEvent = new CustomEvent('custom', {
            detail: 'This is custom event data'
        });
        this.dispatchEvent(customEvent);
    }
}