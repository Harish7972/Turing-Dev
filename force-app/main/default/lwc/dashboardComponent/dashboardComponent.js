import { LightningElement } from 'lwc';

export default class DashboardComponent extends LightningElement {
    isRendered = false;

    renderedCallback() {
        if (!this.isRendered) {
            this.isRendered = true;
            alert('Dashboard component has been rendered');
        }
    }

    errorCallback(error, stack) {
        if (error.message.includes('specific condition')) {
            alert('Handling a specific error in the child component!');
        } else {
            alert('An unexpected error occurred in the dashboard. Please refresh or contact support.');
        }
        console.error('Error in dashboard or child component:', error);
        console.error('Stack trace:', stack);
    }
}