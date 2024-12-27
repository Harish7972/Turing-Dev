import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import storeSessionLog from '@salesforce/apex/SessionLogController.storeSessionLog';
import getRecentSessionLogs from '@salesforce/apex/SessionLogController.getRecentSessionLogs';

export default class SessionManager extends LightningElement {
    @track sessionStatus = 'Inactive'; // Default session status
    @track sessionStartTime;
    @track sessionEndTime;
    @track sessionLogs = []; // To store recent session logs

    // Fetch recent session logs when the component is loaded
    connectedCallback() {
        this.fetchRecentLogs(); // Fetch the 5 most recent logs
    }

    handleStartSession() {
        this.sessionStartTime = new Date();
        this.updateSession('Active'); // Start the session
        this.showToast('Success', 'Session started successfully.', 'success');
    }

    handleEndSession() {
        this.sessionEndTime = new Date();
        this.updateSession('Inactive'); // End the session
        this.showToast('Success', 'Session ended successfully.', 'success');
        this.logSession();
    }

    updateSession(status) {
        this.sessionStatus = status; // Update session status
        // Dispatch an event to notify child components
        this.dispatchEvent(
            new CustomEvent('sessionchange', {
                detail: { sessionStatus: status },
            })
        );
    }

    logSession() {
        const sessionName = `Session ${new Date().toLocaleString()}`; // Auto-generated session name
        const startTime = this.sessionStartTime;
        const endTime = this.sessionEndTime;

        // Call Apex method to store session log
        storeSessionLog({ sessionName, startTime, endTime })
            .then(() => {
                console.log('Session log saved successfully.');
                this.fetchRecentLogs(); // Fetch the latest logs after saving
            })
            .catch(error => {
                console.error('Error saving session log:', error);
            });
    }

    fetchRecentLogs() {
        getRecentSessionLogs() // Call Apex to get recent 5 session logs
            .then(result => {
                this.sessionLogs = result;
            })
            .catch(error => {
                console.error('Error fetching recent logs:', error);
            });
    }

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: variant,
            })
        );
    }
}