import { LightningElement, track } from 'lwc';
import getCases from '@salesforce/apex/CaseController.getCases';

const columns = [
    { label: 'Case Number', fieldName: 'CaseNumber' },
    { label: 'Status', fieldName: 'Status' },
    { label: 'Subject', fieldName: 'Subject' }
];

export default class CaseList extends LightningElement {
    @track cases = [];
    columns = columns;

    // Fetch case records on component initialization
    connectedCallback() {
        getCases()
            .then(data => {
                this.cases = data;
            })
            .catch(error => {
                console.error('Error fetching cases:', error);
            });
    }

    // Handles row selection and dispatches event to parent
    handleRowSelection(event) {
        const selectedRows = event.detail.selectedRows;
        // Dispatch a custom event with the selected rows
        this.dispatchEvent(new CustomEvent('rowselection', { detail: { selectedRows } }));
    }
}