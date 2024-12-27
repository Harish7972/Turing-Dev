import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; // Import for toast notifications
import getContentForRole from '@salesforce/apex/ContentController.getContentForRole';

export default class RoleBasedPagination extends LightningElement {
    @track data = [];
    @track isLoading = false;
    @track pageNumber = 1;
    @track pageSize = 3; // Records per page
    @track userRole = 'Student'; // Default user role
    @track totalRecords = 0;

    // Dropdown options
    roleOptions = [
        { label: 'Student', value: 'Student' },
        { label: 'Instructor', value: 'Instructor' }
    ];

    // Dynamically calculate total pages
    get totalPages() {
        return Math.ceil(this.totalRecords / this.pageSize);
    }

    get isFirstPage() {
        return this.pageNumber === 1;
    }

    get isLastPage() {
        return this.pageNumber >= this.totalPages;
    }

    connectedCallback() {
        this.fetchData();
    }

    fetchData() {
        this.isLoading = true;
        console.log(`Fetching data for role: ${this.userRole}, page: ${this.pageNumber}`);
        
        getContentForRole({ userRole: this.userRole, pageNumber: this.pageNumber, pageSize: this.pageSize })
            .then(result => {
                console.log('Fetched records:', result.records); // Debug line to see fetched records
                this.data = result.records;

                if (result.totalRecords === 0) {
                    this.totalRecords = 1; // Ensure pagination shows 1 of 1
                    this.pageNumber = 1;

                    // Show toast message for no records
                    this.showToast('No Records Found', `No content is available for the role: ${this.userRole}`, 'info');
                } else {
                    this.totalRecords = result.totalRecords;
                }

                this.isLoading = false;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                this.isLoading = false;

                // Show toast message for error
                this.showToast('Error Fetching Data', 'There was an error fetching data. Please try again.', 'error');
            });
    }

    handleRoleChange(event) {
        this.userRole = event.target.value; // Update the role
        console.log('Role selected:', this.userRole); // Debug line to check role change
        this.pageNumber = 1; // Reset page number
        this.fetchData(); // Fetch data based on the new role
    }

    handlePrevious() {
        if (!this.isFirstPage) {
            this.pageNumber--;
            this.fetchData();
        }
    }

    handleNext() {
        if (!this.isLastPage) {
            this.pageNumber++;
            this.fetchData();
        }
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title,
            message,
            variant, // Can be 'success', 'info', 'warning', or 'error'
        });
        this.dispatchEvent(event);
    }
}