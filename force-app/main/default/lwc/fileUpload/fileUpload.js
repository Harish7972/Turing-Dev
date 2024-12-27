import { LightningElement, api, track } from 'lwc';
import uploadFileToRecord from '@salesforce/apex/FileUploadController.uploadFileToRecord';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class FileUploader extends LightningElement {
    @api recordId; // Record ID to attach the file to
    @track file; // File data for uploading
    @track isUploadDisabled = true; // Button disable state
    attachToRecord = false; // Checkbox state for attaching file to record
    isUploading = false; // Upload state
    isSuccess = false; // Success state
    isError = false; // Error state
    errorMessage = ''; // Error message text

    handleFileClick() {
        this.template.querySelector('input[type="file"]').click();
    }

    handleFileSelection(event) {
        const selectedFile = event.target.files[0];
        this.validateFile(selectedFile);
    }

    handleCheckboxChange(event) {
        this.attachToRecord = event.target.checked;
    }

    handleDragOver(event) {
        // Prevent default behavior to allow drop
        event.preventDefault();
    }

    handleDrop(event) {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile) {
            this.validateFile(droppedFile);
        }
    }

    validateFile(file) {
        if (!file) return;

        const fileSizeInMB = file.size / (1024 * 1024); // Convert to MB
        if (fileSizeInMB > 5) {
            this.errorMessage = 'File size must be less than or equal to 5MB';
            this.isError = true;
            this.isUploadDisabled = true;
            return;
        }

        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        if (!validTypes.includes(file.type)) {
            this.errorMessage = 'Invalid file type. Only PDF, DOC, DOCX, XLS, and XLSX files are allowed.';
            this.isError = true;
            this.isUploadDisabled = true;
            return;
        }

        // File is valid
        this.file = file;
        this.isError = false;
        this.isUploadDisabled = false;
    }

    handleUpload() {
        if (this.file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const fileBase64 = reader.result.split(',')[1];

                this.isUploading = true;
                uploadFileToRecord({
                    recordId: this.recordId,
                    fileBase64: fileBase64,
                    fileName: this.file.name,
                    attachToRecord: this.attachToRecord
                })
                    .then(() => {
                        this.isUploading = false;
                        this.isSuccess = true;
                        this.showToast('Success', 'File uploaded successfully!', 'success');

                        // Reset file and states
                        this.file = null;
                        this.isUploadDisabled = true;
                        this.attachToRecord = false;

                        const checkbox = this.template.querySelector('lightning-input[type="checkbox"]');
                        if (checkbox) checkbox.checked = false;

                        const fileInput = this.template.querySelector('input[type="file"]');
                        if (fileInput) fileInput.value = null;
                    })
                    .catch(error => {
                        this.isUploading = false;
                        this.isError = true;
                        this.errorMessage = error.body.message || error.message;
                        this.showToast('Error', this.errorMessage, 'error');
                    });
            };
            reader.readAsDataURL(this.file);
        } else {
            this.showToast('Error', 'No file selected', 'error');
        }
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}