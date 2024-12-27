import { LightningElement, track } from 'lwc';  // Import required modules
import fetchProducts from '@salesforce/apex/ProductController.fetchProducts';  // Apex method to fetch products

export default class PaginationComponent extends LightningElement {
    @track products = [];  // Stores the list of products for the current page
    @track currentPage = 1;  // Tracks the current page number
    @track pageSize = 4;  // Number of products displayed per page
    @track totalRecords = 0;  // Total number of records to calculate total pages
    @track totalPages = 0;  // Total number of pages

    // Disabled states for buttons
    get isPreviousDisabled() {
        return this.currentPage === 1;
    }

    get isNextDisabled() {
        return this.currentPage === this.totalPages;
    }

    // Lifecycle hook that runs when the component is initialized
    connectedCallback() {
        this.loadProducts();  // Load products when the component is first rendered
    }

    // Method to fetch products from Apex based on the current page and page size
    loadProducts() {
        fetchProducts({ pageNumber: this.currentPage, pageSize: this.pageSize })
            .then((result) => {
                this.products = result.products;  // Update the products list with the data received
                this.totalRecords = result.totalRecords;  // Set the total records to calculate pages
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);  // Calculate the total pages
            })
            .catch((error) => {
                console.error('Error fetching products:', error);  // Handle any errors that occur during the fetch
            });
    }

    // Handler for the "Next" button to move to the next page
    handleNextPage() {
        if (this.currentPage < this.totalPages) {  // Check if there are more pages
            this.currentPage++;  // Increment the current page number
            this.loadProducts();  // Reload products for the next page
        }
    }

    // Handler for the "Previous" button to move to the previous page
    handlePreviousPage() {
        if (this.currentPage > 1) {  // Check if we're not on the first page
            this.currentPage--;  // Decrement the current page number
            this.loadProducts();  // Reload products for the previous page
        }
    }
}