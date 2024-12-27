import { LightningElement, wire } from 'lwc';
import getFilteredAndSortedContacts from '@salesforce/apex/ContactController1.getFilteredAndSortedContacts';

export default class ContactList extends LightningElement {
    status = '';
    startDate = '';
    endDate = '';
    accountId = '';
    sortField = 'CreatedDate';
    sortDirection = 'ASC';
    contacts = [];
    columns = [
        { label: 'First Name', fieldName: 'FirstName' },
        { label: 'Last Name', fieldName: 'LastName' },
        { label: 'Email', fieldName: 'Email' }
    ];
    sortOptions = [
        { label: 'Created Date', value: 'CreatedDate' },
        { label: 'Status', value: 'Status' }
    ];
    sortDirectionOptions = [
        { label: 'Ascending', value: 'ASC' },
        { label: 'Descending', value: 'DESC' }
    ];

    // Wire method to fetch contacts based on filter and sort criteria
    @wire(getFilteredAndSortedContacts, {
        // status: '$status',
        // startDate: '$startDate',
        // endDate: '$endDate',
        // accountId: '$accountId',
        // sortField: '$sortField',
        // sortDirection: '$sortDirection'
    })
    wiredContacts({ error, data }) {
         console.log('this.contacts='+JSON.stringify(data));
        if (data) {
            this.contacts = data.contacts;
           
        } else if (error) {
            console.error('Error retrieving contacts:', error);
        }
    }

    // Handle filter change
    handleFilterChange(event) {
        const field = event.target.label;
        this[field] = event.target.value;
    }

    // Handle sort field and direction change
    handleSortChange(event) {
        const field = event.target.label === 'Sort By' ? 'sortField' : 'sortDirection';
        this[field] = event.target.value;
    }
}