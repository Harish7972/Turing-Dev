import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getOpenLogs from '@salesforce/apex/SupportLogController.getOpenLogs';

export default class SupportLogs extends LightningElement {
    logs;

    @wire(getOpenLogs)
    wiredLogs({ data, error }) {
        if (data) {
            this.logs = data;
        } else if (error) {
            this.logs = null;
            console.error('Error fetching logs:', error);
        }
    }

    connectedCallback() {
        // Add event listener for 'logresolved'
        this.template.addEventListener('logresolved', this.handleLogResolved.bind(this));

        // Toast for addEventListener
        this.showToast('Method Triggered', 'addEventListener called successfully.', 'info');
    }

    handleLogResolved(event) {
        const { logId, status } = event.detail;

        // Display Event.currentTarget usage in toast
        this.showToast(
            'Event Triggered',
            `Event.currentTarget resolved: ${event.currentTarget.tagName}`,
            'info'
        );

        // Update the log's status dynamically in the UI
        this.logs = this.logs.map(log =>
            log.Id === logId ? { ...log, Status__c: status } : log
        );

        // Toast for resolving the log
        this.showToast(
            'Log Status Updated',
            `Log ID ${logId} marked as ${status}.`,
            'success'
        );

        // Dispatch an event as part of the resolution process
        const resolveEvent = new CustomEvent('logresolvedconfirmation', {
            detail: { logId, status },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(resolveEvent);

        // Toast for dispatchEvent
        this.showToast(
            'Method Triggered',
            'dispatchEvent called successfully.',
            'info'
        );
    }

    disconnectedCallback() {
        // Remove event listener for 'logresolved'
        this.template.removeEventListener('logresolved', this.handleLogResolved.bind(this));

        // Toast for removeEventListener
        this.showToast('Method Triggered', 'removeEventListener called successfully.', 'warning');
    }

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title,
                message,
                variant
            })
        );
    }
}