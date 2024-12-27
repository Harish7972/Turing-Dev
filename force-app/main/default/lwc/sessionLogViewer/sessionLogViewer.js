import { LightningElement } from 'lwc';

export default class SessionLogViewer extends LightningElement {
    sessionLogs = [];

    connectedCallback() {
        // Retrieve session logs from localStorage
        this.sessionLogs = JSON.parse(localStorage.getItem('sessionLogs')) || [];
    }
}