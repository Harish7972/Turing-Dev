import { LightningElement, track, wire } from 'lwc';
import getAllContacts from '@salesforce/apex/ContactController.getAllContacts';

export default class ContactFilterSort extends LightningElement {
    @track contacts = [];

    // Wire method to fetch all data from Apex
    @wire(getAllContacts)
    wiredContacts({ error, data }) {
        if (data) {
            this.contacts = data;
        } else if (error) {
            console.error('Error fetching contacts:', error);
        }
    }
}