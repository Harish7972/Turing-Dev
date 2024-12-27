import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import uploadCSV from '@salesforce/apex/CSVUploaderController.uploadCSV';

export default class CsvFileUploader extends LightningElement {
    @track csvData;
    @track columns;
    @track isLoading = false;
    @track isDataVisible = true; // Track visibility of the data
    acceptedFormats = ['.csv'];

    handleUploadFinished(event) {
        try {
            const uploadedFiles = event.detail.files;
            if (uploadedFiles.length > 0) {
                this.isLoading = true;
                const documentId = uploadedFiles[0].documentId;
                
                uploadCSV({ contentDocumentId: documentId })
                    .then(result => {
                        const data = JSON.parse(result);
                        if (data && data.length) {
                            this.setupDataTable(data);
                            this.showToast('Success', 'CSV Uploaded Successfully', 'success');
                        } else {
                            throw new Error('No data found in CSV');
                        }
                    })
                    .catch(error => {
                        this.handleError(error);
                    })
                    .finally(() => {
                        this.isLoading = false;
                    });
            }
        } catch (error) {
            this.handleError(error);
        }
    }

    setupDataTable(data) {
        this.csvData = data;
        this.columns = Object.keys(data[0])
            .filter(key => key !== 'id')
            .map(key => ({
                label: key,
                fieldName: key,
                type: 'text',
                sortable: true
            }));
    }

    handleError(error) {
        console.error('Error:', error);
        this.isLoading = false;
        this.showToast(
            'Error',
            error.body?.message || error.message || 'Error processing file',
            'error'
        );
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

    toggleDataVisibility() {
        this.isDataVisible = !this.isDataVisible;
    }

    // Getter to dynamically return the label
    get dataButtonLabel() {
        return this.isDataVisible ? 'Hide Data' : 'Show Data';
    }
}