import { LightningElement, track } from 'lwc';
import fetchAccountData from '@salesforce/apex/AccountController2.getCustomerData';

export default class CustomerAccountDashboard extends LightningElement {
    @track accountData = null; // Holds the account data
    @track loading = false; // Tracks loading state
    @track error = null; // Tracks error messages

    TIMEOUT_MS = 500000; // Timeout limit for loading data
    timeoutId;

    connectedCallback() {
        this.loadData();
    }

    async loadData() {
        this.loading = true;
        this.error = null;
        this.accountData = null;

        // Start timeout logic
        this.timeoutId = setTimeout(() => {
            this.loading = true;
            this.error = 'Data not available at the moment. Please try again later.';
        }, this.TIMEOUT_MS);

        try {
            const result = await fetchAccountData();
            clearTimeout(this.timeoutId); // Clear timeout if data fetch is successful
            this.accountData = result;
        } catch (error) {
            clearTimeout(this.timeoutId); // Clear timeout on error
            this.error = 'Error loading account data. Please try again.';
            console.error('Error fetching account data:', error);
        } finally {
            this.loading = false; // Ensure spinner stops in any case
        }
    }

    retryLoad() {
        this.loadData(); // Retry fetching data
    }
}