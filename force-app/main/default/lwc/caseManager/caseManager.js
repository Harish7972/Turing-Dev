// import { LightningElement, wire, api } from 'lwc';
// import getCases from '@salesforce/apex/CaseController.getCases';
// import updateCaseStatus from '@salesforce/apex/CaseController.updateCaseStatus';
// import { refreshApex } from '@salesforce/apex';

// export default class CaseManager extends LightningElement {
//     cases;
//     error;

//     // Using @wire to fetch the cases automatically
//     @wire(getCases)
//     wiredCases({ error, data }) {
//         if (data) {
//             this.cases = data;
//             this.error = undefined;
//         } else if (error) {
//             this.error = error.body.message;
//             this.cases = undefined;
//         }
//     }

//     // Using @api to expose a method that allows the parent to update a case's status
//     @api
//     updateCase(caseId, newStatus) {
//         updateCaseStatus({ caseId, newStatus })
//             .then(() => {
//                 // Dispatch event to notify update success
//                 this.dispatchEvent(new CustomEvent('casestatusupdated', { detail: { caseId, newStatus } }));
//                 return refreshApex(this.wiredCases); // Refresh data to reflect update
//             })
//             .catch(error => {
//                 this.error = error.body.message;
//                 console.error('Error updating case status:', error);
//             });
//     }
    

//     // Event handler to resolve the case when the button is clicked
//     handleResolveClick(event) {
//         const caseId = event.target.dataset.id;
//         const newStatus = 'Working';
//         console.log('Updating case:', caseId, 'New status:', newStatus); // Log caseId and newStatus
//         this.updateCase(caseId, newStatus);
//     }
// }

import { LightningElement, wire, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; // Importing ShowToastEvent for notifications
import getCases from '@salesforce/apex/CaseController.getCases'; // Apex method to fetch cases
import updateCaseStatus from '@salesforce/apex/CaseController.updateCaseStatus'; // Apex method to update case status
import { refreshApex } from '@salesforce/apex';

export default class CaseManager extends LightningElement {
    cases; // Holds the case records
    error; // Holds any error messages
    isLoading = false; // To handle loading state

    // Wire to fetch cases automatically
    @wire(getCases)
    wiredCases({ error, data }) {
        if (data) {
            this.cases = data; // Assign fetched data to cases
            this.error = undefined; // Clear errors if data is fetched successfully
        } else if (error) {
            this.error = error.body.message; // Display error message if fetch fails
            this.cases = undefined;
        }
    }

    // Expose the update method for dynamic updates from parent components
    @api
    updateCase(caseId, newStatus) {
        this.isLoading = true; // Show loading spinner

        updateCaseStatus({ caseId, newStatus }) // Call Apex method to update case status
            .then(() => {
                // Show success toast
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Case status updated successfully!',
                        variant: 'success',
                    })
                );
                return refreshApex(this.wiredCases); // Refresh data after successful update
            })
            .catch(error => {
                // Handle errors during update
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: error.body.message,
                        variant: 'error',
                    })
                );
            })
            .finally(() => {
                this.isLoading = false; // Hide loading spinner
            });
    }

    // Handle button click to resolve case
    handleResolveClick(event) {
        const caseId = event.target.dataset.id; // Get the case ID from the clicked button
        const newStatus = 'Resolved'; // Set status to 'Resolved'
        this.updateCase(caseId, newStatus); // Update the case status
    }
}