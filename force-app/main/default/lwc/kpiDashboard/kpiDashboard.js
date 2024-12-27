import { LightningElement, wire, api, track } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getKPIData from '@salesforce/apex/KPIController.getKPIData';
import getKPIDataCount from '@salesforce/apex/KPIController.getKPIDataCount';
import getExampleClientId from '@salesforce/apex/KPIController.getExampleClientId'; // New method

export default class KpiDashboard extends LightningElement {
    @track clientId; // Dynamically fetched Client ID
    @track kpiData = [];
    @track totalRecords = 0;
    @track pageSize = 3;
    @track currentPage = 1;
    @track error;
    @track isLoading = false; // Spinner state
    wiredDataResult;

    @wire(getExampleClientId)
    wiredClientId({ error, data }) {
        if (data) {
            this.clientId = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.clientId = null;
        }
    }

    @wire(getKPIData, { clientId: '$clientId', pageNumber: '$currentPage', pageSize: '$pageSize' })
    wiredData(result) {
        this.wiredDataResult = result;
        if (result.data) {
            this.kpiData = result.data;
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.kpiData = [];
        }
    }

    @wire(getKPIDataCount, { clientId: '$clientId' })
    wiredDataCount(result) {
        if (result.data) {
            this.totalRecords = result.data;
        } else if (result.error) {
            this.error = result.error;
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
            this.fetchData();
        }
    }

    handlePreviousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.fetchData();
        }
    }

    fetchData() {
        refreshApex(this.wiredDataResult);
    }

    refreshData() {
        this.isLoading = true; // Show spinner
        setTimeout(() => {
            refreshApex(this.wiredDataResult);
            this.isLoading = false; // Hide spinner after 2 seconds
        }, 2000);
    }
}