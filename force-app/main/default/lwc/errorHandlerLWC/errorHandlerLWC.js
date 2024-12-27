import { LightningElement, track, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import fetchData from '@salesforce/apex/ApexController.fetchData';
import deleteData from '@salesforce/apex/ApexController.deleteData';
import updateData from '@salesforce/apex/ApexController.updateData';
import getAccountDataCount from '@salesforce/apex/ApexController.getAccountDataCount';



export default class ErrorHandlerLWC extends LightningElement {
    @track accounts = [];
    @track errorMessage;
    @track resolutionSteps;
    @track successMessage;
    @track showSuccessToast = false;
    @track showErrorPopup = false;
    @track selectedAccount;
    @track showEditModal = false;
    updateButtonLabel = 'Update Data';
    @track totalRecords = 0;
    @track pageSize = 5; // Adjust based on requirements
    @track currentPage = 1;
    @track showDeleteModal = false; // Track delete modal state
    idToBeDeleted = '';

    wiredAccountsResult; // Reference for refreshing data
    accountsFetched = false; // Control data display

    columns = [
        { label: 'Account ID', fieldName: 'Id' },
        { label: 'Account Name', fieldName: 'Name' },
        { label: 'Phone', fieldName: 'Phone' },
        { label: 'BillingStreet ', fieldName: 'BillingStreet' },
        { label: 'ShippingStreet ', fieldName: 'ShippingStreet' },
    ];

    // Wire method to fetch accounts
    @wire(fetchData, { pageSize: '$pageSize', pageNumber: '$currentPage' })
    wiredAccounts(result) {
        this.wiredAccountsResult = result;
        if (result.data && this.accountsFetched) {
            this.accounts = result.data;
        } else if (result.error) {
            this.showToast('Error', 'Error loading initial data.', 'error', 'pester');
        }
    }

    @wire(getAccountDataCount)
        wiredCount({ error, data }) {
            if (data) {
                this.totalRecords = data;
                this.showToast('Success', 'Data count loaded successfully.', 'success', 'pester');

            } else if (error) {
                this.hasError = true;
                this.errorMessage = 'Failed to load data count.';
                this.showToast('Error', 'Error loading initial data count.', 'error', 'pester');

            }
        }

    // Fetch Data (button click)
    handleFetchData() {
        this.clearMessages();

        fetchData({ pageSize: this.pageSize, pageNumber: this.currentPage })
            .then((result) => {
                this.accounts = result;
                this.accountsFetched = true;
                this.showToast('Success', 'Accounts fetched successfully!', 'success', 'pester');

            })
            .catch((error) => {
                this.showToast('Error', 'Error loading initial Account data.', 'error', 'pester');

            });
    }

    // Handle Row Selection
    handleRowSelection(event) {
        const selectedRows = event.detail.selectedRows;
        this.selectedAccount = selectedRows.length === 1 ? { ...selectedRows[0] } : null;
    }

    // Delete Account
    handleDeleteData() {
        // Check if an account is selected
        if (!this.selectedAccount) {
            this.showToast('Error', 'Please select one Account, Please deselect one Account if you have selected two.', 'error', 'pester');

            return;
        }

        this.showDeleteModal = true; // Open delete confirmation popup
        this.idToBeDeleted = this.selectedAccount.Id;
    }    

    // Update Account
    handleUpdateData() {
        if (!this.selectedAccount) {
            this.showToast('Error', 'Update Error: Please select only one account to update, Please deselect one Account if you have selected two.', 'error', 'pester');

            return;
        }

        this.showEditModal = true;
        this.updateButtonLabel = 'Save Data';
    }

    handleAccountFieldChange(event) {
        const fieldName = event.target.dataset.field;
        this.selectedAccount[fieldName] = event.target.value;
    }

    handleSaveUpdate() {
        updateData({ account: this.idToBeDeleted })
            .then(() => {
                this.clearMessages();
                this.showToast('Success', 'Account updated successfully!', 'success', 'pester');

                this.closeEditModal();
                return refreshApex(this.wiredAccountsResult); // Refresh UI after update
            })
            .catch((error) => {
                this.showToast('Error', 'Error updating account: Please select only one account to update, Please deselect one Account if you have selected two. ', 'error', 'pester');

            });
    }

    closeEditModal() {
        this.showEditModal = false;
        this.updateButtonLabel = 'Update Data';
    }

    // Toast and Error Handlers
    showToast(title, message, variant, mode) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(event);
    }

    clearMessages() {
        this.errorMessage = null;
        this.resolutionSteps = null;
        this.successMessage = null;
        this.showSuccessToast = false;
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
            refreshApex(this.wiredResult).then(() => {
                this.showToast('Info', `Page ${this.currentPage} loaded.`, 'info');
            });
        }
    }

    handlePreviousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            refreshApex(this.wiredResult).then(() => {
                this.showToast('Info', `Page ${this.currentPage} loaded.`, 'info');
            });
        }
    }

    // Delete Account
    handleDelete() {
        if (!this.selectedAccount) {
            this.showToast('Error', 'Delete Error: Please select one account to delete.', 'error', 'pester');
            return;
        }
        this.showDeleteModal = true; // Open delete confirmation popup
    }

    confirmDelete() {

           deleteData({ accountId: this.idToBeDeleted })
            .then(() => {
                this.clearMessages();
                this.showToast('Success', 'Account deleted successfully!', 'success', 'pester');
                this.showDeleteModal = false;
                this.idToBeDeleted = '';

                // Refresh data after deletion
                return refreshApex(this.wiredAccountsResult);
            })
            .catch((error) => {
                // Handle any errors
                this.showToast('Error', 'Delete Error: Please select only one account to Delete, Please deselect one Account if you have selected two.', 'error', 'pester');

            });
    }

    cancelDelete() {
        this.showDeleteModal = false; // Close delete confirmation popup
    }

    closeDeleteModal() {
        this.showDeleteModal = false;
        this.selectedAccount = null;
    }


}