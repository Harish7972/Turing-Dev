import { LightningElement, api, track } from 'lwc';
import uploadFileToRecord from '@salesforce/apex/ImageUploaderController.uploadFileToRecord';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class  ImageUploader extends LightningElement {
    @api recordId; // Record to associate the image
    @track imagePreview = null; // Preview image
    @track errorMessage = null; // Error messages
    @track disableUpload = true; // Disable upload button initially

    fileData = null; // To store the file data
    timeoutId = null; // To store the timeout ID for clearing error messages

    // Supported image types
    supportedTypes = ['image/jpeg', 'image/png', 'image/gif'];

    // Handle file input change
    handleFileChange(event) {
        const file = event.target.files[0];

        // Clear previous error message and timeout
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        this.errorMessage = null;

        if (file) {
            // Log file size for debugging
            console.log('File Size:', file.size, 'bytes');

            // Check file type
            if (!this.supportedTypes.includes(file.type)) {
                this.errorMessage = 'Unsupported file type. Please upload JPG, PNG, or GIF images.';
                this.resetFileInput(); // Reset file input on error

                // Automatically clear the error message after 3 seconds
                this.timeoutId = setTimeout(() => {
                    this.errorMessage = null;
                }, 3000);
                return;
            }

            // Check file size (log the size for troubleshooting)
            if (file.size > 2000000) { // 2MB size limit
                console.log('File size exceeds 2MB');
                this.errorMessage = 'File size must be less than 2MB.';
                this.resetFileInput(); // Reset file input on error

                // Automatically clear the error message after 3 seconds
                this.timeoutId = setTimeout(() => {
                    this.errorMessage = null;
                }, 3000);
                return;
            }

            // If no errors, allow upload
            this.errorMessage = null;
            this.disableUpload = false;

            // Preview image
            const reader = new FileReader();
            reader.onload = () => {
                this.imagePreview = reader.result;
            };
            reader.readAsDataURL(file);

            // Store file data
            this.fileData = {
                fileName: file.name,
                fileType: file.type,
                fileContents: null
            };

            reader.onloadend = () => {
                this.fileData.fileContents = reader.result.split(',')[1];
            };
        } else {
            this.errorMessage = 'Please upload a valid image file.';
            this.resetFileInput(); // Reset file input on error

            // Automatically clear the error message after 3 seconds
            this.timeoutId = setTimeout(() => {
                this.errorMessage = null;
            }, 3000);
        }
    }

    // Upload file to Salesforce
    async uploadFile() {
        if (!this.fileData || !this.recordId) {
            this.errorMessage = 'No file selected or record ID missing.';
            return;
        }

        try {
            this.disableUpload = true;

            // Destructure file data
            const { fileName, fileType, fileContents } = this.fileData;

            // Call Apex method
            await uploadFileToRecord({
                recordId: this.recordId,
                fileName,
                fileType,
                fileContents
            });

            // Reset component state on success
            this.resetFileInput();
            this.showToast('Success', 'Image uploaded successfully.', 'success');
        } catch (error) {
            this.errorMessage = error.body?.message || 'Error uploading the image.';
            console.error('Upload Error:', error);

            // Automatically clear the error message after 3 seconds
            this.timeoutId = setTimeout(() => {
                this.errorMessage = null;
            }, 3000);
        }
    }

    // Reset the file input and component state
    resetFileInput() {
        this.imagePreview = null;
        this.fileData = null;
        this.disableUpload = true;
        const fileInput = this.template.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.value = null; // Clear the file input
        }
    }

    // Show toast messages
    showToast(title, message, variant) {
        const evt = new ShowToastEvent({ title, message, variant });
        this.dispatchEvent(evt);
    }
}