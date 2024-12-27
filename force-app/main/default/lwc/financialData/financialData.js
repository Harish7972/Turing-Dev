import { LightningElement, track, wire } from 'lwc';
import getFinancialData from '@salesforce/apex/DataIntegrityController.getPaginatedFinancialData';
import getFinancialDataCount from '@salesforce/apex/DataIntegrityController.getFinancialDataCount';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class financialData extends LightningElement {
    @track financialData = [];
    @track totalRecords = 0;
    @track pageSize = 5; // Adjust based on requirements
    @track currentPage = 1;
    @track isLoading = true;
    @track hasError = false;
    @track errorMessage = '';
    wiredResult;
    @track hasNoData = false;

    @wire(getFinancialDataCount)
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

    @wire(getFinancialData, { pageSize: '$pageSize', pageNumber: '$currentPage' })
    wiredData(result) {
        this.wiredResult = result;
        if (result.data) {
            this.financialData = result.data;
            this.hasError = false;
            this.isLoading = false;
            this.showToast('Success', 'Financial data loaded successfully.', 'success');
        } else if (result.error) {
            this.financialData = [];
            this.hasError = true;
            this.errorMessage = 'Failed to load financial data.';
            this.isLoading = false;
            this.hasNoData = true;
            this.showToast('Error', 'Failed to load financial data.', 'error');
        }
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

refreshData() {
    // Refresh Apex only if the currentPage changes
    refreshApex(this.wiredResult).then(() => {
        this.showToast('Info', `Page ${this.currentPage} loaded.`, 'info');
    }).catch((error) => {
        this.showToast('Error', 'Failed to refresh data.', 'error');
        console.error(error);
    });
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