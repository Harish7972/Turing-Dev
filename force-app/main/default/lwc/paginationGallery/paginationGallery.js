import { LightningElement, track, wire } from 'lwc';
import getFiles from '@salesforce/apex/ImageGalleryPaginationController.getFiles';
import getImageCount from '@salesforce/apex/ImageGalleryPaginationController.getImageCount';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class paginationGallery extends LightningElement {
    @track images = [];
    @track isModalOpen = false;
    @track currentImage = {};
    @track hoveredImage = {};  // To store the hovered image's details
    @track cursorPosition = { x: 0, y: 0 }; // To track the cursor position for hover box
    @track hoverStyle = '';  // To dynamically apply hover details box style
    @track totalRecords = 0;
    @track pageSize = 5; // Adjust based on requirements
    @track currentPage = 1;
    @track images = [];


    @wire(getImageCount)
        wiredCount({ error, data }) {
            if (data) {
                this.totalRecords = data;
                this.showToast('Success', 'Data count loaded successfully.', 'success');
            } else if (error) {
                this.hasError = true;
                this.errorMessage = 'Failed to load data count.';
                this.showToast('Error', 'Failed to load data count.', 'error');
            }
        }


    @wire(getFiles, { pageSize: '$pageSize', pageNumber: '$currentPage' })
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

    // Open modal on image click
    handleImageClick(event) {
        const { title, description, url } = event.currentTarget.dataset;
        this.currentImage = { title, description, url };
        this.isModalOpen = true;
    }


    handleImageHover(event) {
        const { title, description, contentSize, createdDate, dimensions } = event.currentTarget.dataset;
        this.hoveredImage = { title, description, contentSize, createdDate, dimensions };

        // Get bounding box of the gallery to constrain the hover box
        const galleryRect = this.template.querySelector('.gallery').getBoundingClientRect();

        // Track cursor position
        const cursorX = event.clientX;
        const cursorY = event.clientY;

        // Calculate hover box position with an offset
        let hoverX = cursorX + 10;
        let hoverY = cursorY + 10;

        // Adjust to ensure the hover box doesn't go outside the component
        if (hoverX + 250 > galleryRect.right) {
            hoverX = galleryRect.right - 260; // Adjust for hover box width
        }
        if (hoverY + 100 > galleryRect.bottom) {
            hoverY = galleryRect.bottom - 110; // Adjust for hover box height
        }

        // Update hoverStyle to position the hover details box dynamically
        this.hoverStyle = `top: ${hoverY}px; left: ${hoverX}px;`;
    }



    // Reset hovered image details
    handleImageLeave() {
        this.hoveredImage = {};
        this.hoverStyle = '';  // Reset hover style when leaving the image
    }

    // Close modal
    closeModal() {
        this.isModalOpen = false;
        this.currentImage = {};
    }

    // Prevent modal close when clicking inside the modal
    stopPropagation(event) {
        event.stopPropagation();
    }

    get totalPages() {
        return Math.ceil(this.totalRecords / this.pageSize);
    }

    get isPreviousDisabled() {
        return this.currentPage === 1;
    }

    get isNextDisabled() {
        return this.currentPage === this.totalPages;
    }


    handleNextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.refreshData();
        }
    }

    handlePreviousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.refreshData();
        }
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }
} 