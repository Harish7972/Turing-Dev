import { LightningElement, track } from 'lwc';
import fetchLatestRecordId from '@salesforce/apex/RecordService.fetchLatestRecordId';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ImageUploaderParent extends LightningElement {
    @track isFormVisible = false;
    @track selectedRecordId = null; // Dynamically fetched record ID
    isLoading = false;

    // Fetch the record ID dynamically and open the form
    fetchAndOpenForm() {
        this.isLoading = true;

        fetchLatestRecordId()
            .then((result) => {
                if (result) {
                    this.selectedRecordId = result;
                    this.isFormVisible = true;
                } else {
                    this.showToast('Error', 'No record found.', 'error');
                }
            })
            .catch((error) => {
                console.error('Error fetching record ID:', error);
                this.showToast('Error', 'Failed to fetch record ID.', 'error');
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