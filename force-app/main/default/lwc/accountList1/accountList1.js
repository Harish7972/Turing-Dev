import { LightningElement, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController1.getAccounts';
import { refreshApex } from '@salesforce/apex';

export default class AccountList1 extends LightningElement {
    accounts;
    error;
    wiredAccountsResult;

    @wire(getAccounts)
    wiredAccounts(result) {
        this.wiredAccountsResult = result;
        if (result.data) {
            this.accounts = result.data;
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error.body.message;
            this.accounts = undefined;
        }
    }

    handleManualRefresh() {
        // Refreshing Apex even if data hasn't changed
        refreshApex(this.wiredAccountsResult);
    }
}