import { LightningElement, track, wire } from 'lwc';
import getFiles from '@salesforce/apex/ImageGalleryDataController.getFiles'; 
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; 

export default class ImageGallery extends LightningElement {
    @track images = [];
    @track isModalOpen = false;
    @track currentImage = {};
    @track cursorPosition = { x: 0, y: 0 }; // To track the cursor position for hover box

    /**
     * Fetches image files from the server using wire service.
     * If successful, maps the file data to a format usable in the component.
     */
    @wire(getFiles)
    wiredFiles({ data, error }) {
        if (data) {
            this.images = data.map((file) => ({
                id: file.id,
                title: file.title,
                description: file.description,
                url: file.url, // File URL for the image
                contentSize: file.contentSize, // Image size
                createdDate: file.createdDate, // Image upload date
                dimensions: file.dimensions, // Image dimensions
            }));
        } else if (error) {
            console.error('Error fetching files:', error);
            this.images = []; // Reset images to an empty array on error
        }
    }

    /**
     * Opens the modal when an image is clicked, displaying image details.
     */
    handleImageClick(event) {
        const { title, description, url } = event.currentTarget.dataset;
        this.currentImage = { title, description, url };
        this.isModalOpen = true;
    }

    /**
     * Resets hovered image details when mouse leaves the image.
     */
    handleImageLeave() {
        this.hoveredImage = {}; // Reset hover style when leaving the image
    }

    /**
     * Closes the modal and resets the current image.
     */
    closeModal() {
        this.isModalOpen = false;
        this.currentImage = {};
    }

    /**
     * Prevents the modal from closing when clicking inside the modal content.
     */
    stopPropagation(event) {
        event.stopPropagation();
    }

    /**
     * Displays a toast notification with the specified message.
     */
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }
}  