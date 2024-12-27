// import { LightningElement, track } from 'lwc';
// import fetchData from '@salesforce/apex/DataFetcher.fetchPaginatedData';

// export default class DataPaginator extends LightningElement {
//     @track records = [];
//     @track pageSize = 3;
//     @track pageNumber = 1;
//     @track totalRecords = 0;
//     @track totalPages = 0;
//     @track isLoading = false;
//     @track error;

//     connectedCallback() {
//         this.fetchRecords();
//     }

//     fetchRecords() {
//         this.isLoading = true;
//         const offset = (this.pageNumber - 1) * this.pageSize;

//         fetchData({ offset, limit1: this.pageSize })
//             .then(result => {
//                 if (result && result.records) {
//                     this.records = [...this.records, ...result.records]; // Append records
//                     this.totalRecords = result.totalRecords;
//                     this.totalPages = Math.ceil(this.totalRecords / this.pageSize); // Calculate total pages
//                     this.error = undefined; // Clear error if successful
//                 } else {
//                     this.error = 'No data found';
//                 }
//                 this.isLoading = false;
//             })
//             .catch(error => {
//                 this.error = 'Error fetching data: ' + error.body.message;
//                 this.isLoading = false;
//             });
//     }

//     handleScroll(event) {
//         const container = event.target;
//         // Check if the user has reached the bottom of the scroll container
//         if (container.scrollHeight === container.scrollTop + container.clientHeight) {
//             if (!this.isLoading && this.pageNumber < this.totalPages) {
//                 this.pageNumber++;
//                 this.fetchRecords();
//             }
//         }
//     }
// }

import { LightningElement, track } from 'lwc';
import fetchData from '@salesforce/apex/DataFetcher.fetchPaginatedData';

export default class DataPaginator extends LightningElement {
    @track records = [];
    @track pageSize = 3;
    @track pageNumber = 1;
    @track totalRecords = 0;
    @track isLoading = false;
    @track error;

    // Calculate total number of pages based on total records and page size
    get totalPages() {
        return Math.ceil(this.totalRecords / this.pageSize);
    }

    // Disable the "Next" button if we are on the last page or if data is loading
    get isNextButtonDisabled() {
        return this.pageNumber === this.totalPages || this.isLoading;
    }

    // Disable the "Previous" button if we are on the first page or if data is loading
    get isPrevButtonDisabled() {
        return this.pageNumber === 1 || this.isLoading;
    }

    connectedCallback() {
        this.fetchRecords();
    }

    fetchRecords() {
        this.isLoading = true;
        let offset = (this.pageNumber - 1) * this.pageSize;

        fetchData({ offset: offset, limit1: this.pageSize })
            .then(result => {
                if (result && result.records) {
                    this.records = result.records; // Replace records with the new set
                    this.totalRecords = result.totalRecords; // Total records available
                    this.error = undefined; // Clear error if successful
                } else {
                    this.error = 'No data found';
                }
                this.isLoading = false;
            })
            .catch(error => {
                this.error = 'Error fetching data: ' + error.body.message;
                this.isLoading = false;
            });
    }

    handleScroll(event) {
        // Check if the user has reached the bottom of the scroll container
        const bottom = event.target.scrollHeight === event.target.scrollTop + event.target.clientHeight;
        if (bottom && !this.isLoading && this.records.length < this.totalRecords) {
            this.pageNumber++;
            this.fetchRecords();
        }
    }

    // Method to go to the next page
    goToNextPage() {
        if (this.pageNumber < this.totalPages) {
            this.pageNumber++;
            this.fetchRecords();
        }
    }

    // Method to go to the previous page
    goToPrevPage() {
        if (this.pageNumber > 1) {
            this.pageNumber--;
            this.fetchRecords();
        }
    }
}