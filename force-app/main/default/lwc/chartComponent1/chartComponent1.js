import { LightningElement, wire, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getPaginatedData from '@salesforce/apex/ChartDataController.getPaginatedData';
import chartMasters from '@salesforce/resourceUrl/chartMasters';

export default class ChartComponent1 extends LightningElement {
    @api currentPage = 1; // Current page number for pagination
    @api pageSize = 5;    // Number of records per page
    @track data = [];     // Stores the fetched data
    @track totalRecords = 0; // Total number of records in the database
    imageUrl3 = chartMasters;

    // Wire the Apex method to fetch paginated data
    @wire(getPaginatedData, { pageNumber: '$currentPage', pageSize: '$pageSize' })
    wiredData({ error, data }) {
        if (data) {
            this.data = data.records;
            this.totalRecords = data.totalRecords;
        } else if (error) {
            this.showToast('Error', 'Failed to load chart data.', 'error');
        }
    }

    // Get the total number of pages
    get totalPages() {
        return Math.ceil(this.totalRecords / this.pageSize);
    }

    // Check if the "Previous" button should be disabled
    get isPreviousDisabled() {
        return this.currentPage === 1;
    }

    // Check if the "Next" button should be disabled
    get isNextDisabled() {
        return this.currentPage === this.totalPages;
    }

    // Navigate to the previous page
    handlePreviousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    }

    // Navigate to the next page
    handleNextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
        }
    }

    // Event handling with stopPropagation and preventDefault
    handleEvent(event) {
        event.stopPropagation(); // Stops the event from propagating to parent
        event.preventDefault(); // Prevents default browser behavior (if any)
        this.showToast(
            'Event Triggered',
            'The event was handled with stopPropagation and preventDefault!',
            'success'
        );
    }

    // Display a toast notification
    showToast(title, message, variant) {
        const toastEvent = new ShowToastEvent({
            title,
            message,
            variant,
        });
        this.dispatchEvent(toastEvent);
    }

    // Parent event handler
    handleParentClick(event) {
        this.showToast(
            'Parent Event Triggered',
            'An event bubbled up to the parent container!',
            'info'
        );
    }
}