import { LightningElement, track } from 'lwc';

export default class CaseDetails extends LightningElement {
    @track selectedCaseId = null; // Stores the selected case ID
    selectedRows = []; // Tracks selected rows in the datatable

    // Determines if the "Show Details" button is enabled
    get isShowDetailsDisabled() {
        return this.selectedCaseId === null; // Button is disabled if no case is selected
    }

    // Handles row selection from the child component
    handleRowSelection(event) {
        // Retrieve selected rows from the event and update selectedCaseId
        this.selectedRows = event.detail.selectedRows;
        this.selectedCaseId = this.selectedRows.length === 1 ? this.selectedRows[0].Id : null;
    }

    // Handles the "Show Details" button click
    handleShowDetails() {
        if (this.selectedCaseId) {
            console.log(`Fetching details for case: ${this.selectedCaseId}`);
        } else {
            console.error('No case selected.');
        }
    }
}