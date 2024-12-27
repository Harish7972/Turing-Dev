import { LightningElement, wire } from 'lwc';
import getUserRole from '@salesforce/apex/UserRoleController.getUserRole';

export default class taskDetails extends LightningElement {
    userRole;
    taskVisible = false;

    @wire(getUserRole)
    wiredUserRole({ error, data }) {
        if (data) {
            this.userRole = data;
            // Set task visibility based on role
            this.taskVisible = this.userRole === 'Manager'; // Only managers can see task details
        } else if (error) {
            console.error('Error fetching user role:', error); // Log error if there is an issue fetching user role
        }
    }
}