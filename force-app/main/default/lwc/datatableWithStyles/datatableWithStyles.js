import { LightningElement, track, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountDataController.getAccounts';

export default class CustomStyledTable extends LightningElement {
    @track tableData = [];  // Holds the data for the datatable
    @track themeClass = 'theme-modern';  // Default theme class

    // Define the columns for the datatable
    columns = [
        { label: 'Account Name', fieldName: 'name', type: 'text', sortable: true },
        { label: 'Industry', fieldName: 'industry', type: 'text' },
        { label: 'Annual Revenue', fieldName: 'revenue', type: 'currency', typeAttributes: { currencyCode: 'USD' } }
    ];

    // Wire the getAccounts method to fetch account data
    @wire(getAccounts)
    wiredAccounts({ data, error }) {
        if (data) {
            // Map the fetched data to the format required by the datatable
            this.tableData = data.map(account => ({
                id: account.Id,
                name: account.Name,
                industry: account.Industry,
                revenue: account.AnnualRevenue
            }));
        } else if (error) {
            console.error('Error fetching accounts:', error);
        }
    }

    // Method to set the theme to Modern
    setThemeOne() {
        this.themeClass = 'theme-modern';
    }

    // Method to set the theme to Classic
    setThemeTwo() {
        this.themeClass = 'theme-classic';
    }
}