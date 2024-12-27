import { LightningElement, wire, track } from 'lwc';
import fetchLatestContactId from '@salesforce/apex/ContactService.fetchLatestContactId';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ParentComponent3 extends LightningElement {
    @track isFormVisible = false;
    @track selectedRecordId = null; // Dynamically fetched record ID
    isLoading = false;

    // Fetch the record ID dynamically and open the form
    fetchAndOpenForm() {
        this.isLoading = true;

        fetchLatestContactId()
            .then((result) => {
                if (result) {
                    this.selectedRecordId = result;
                    this.isFormVisible = true;
                } else {
                    this.showToast('Error', 'No contact record found.', 'error');
                }
            })
            .catch((error) => {
                console.error('Error fetching record ID:', error);
                this.showToast('Error', 'Failed to fetch contact record.', 'error');
            })
            .finally(() => {
                this.isLoading = false;
            });
    }

    // Close the form and reset state
    handleCloseForm() {
        this.isFormVisible = false;
        this.selectedRecordId = null; // Reset for next interaction
    }

    // Toast utility function
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