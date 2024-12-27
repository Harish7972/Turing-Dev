import { LightningElement, track } from 'lwc';

export default class ProjectDashboardOverview extends LightningElement {
    @track updates = []; // To store updates received from the child component

    handleProjectUpdate(event) {
        // Add the new update to the updates list
        const newUpdate = {
            message: event.detail.message,
            projectName: event.detail.projectName,
            id: this.updates.length + 1 // Assign a unique key for each update
        };
        this.updates = [...this.updates, newUpdate];
    }
}