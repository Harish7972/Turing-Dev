import { LightningElement, wire, track } from 'lwc';
import getRegistrations from '@salesforce/apex/RegistrationController.getRegistrations';
import updateEventDate from '@salesforce/apex/RegistrationController.updateEventDate';
import createRegistration from '@salesforce/apex/RegistrationController.createRegistration';
import getRegistraionDataCount from '@salesforce/apex/RegistrationController.getRegistraionDataCount';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

export default class RegistrationManager extends LightningElement {
    @track registrations = [];
    @track selectedRows = [];
    @track showForm = false;
    @track showEditModal = false;
    @track name = '';
    @track eventDate = '';
    @track email = '';
    @track phone = '';
    @track newEventDate = '';
    @track newName = '';
    wiredRegistrations;

    @track totalRecords = 0;
    @track pageSize = 5; // Adjust based on requirements
    @track currentPage = 1;

    columns = [
        { label: 'Name', fieldName: 'Name', type: 'text' },
        { label: 'Event Date', fieldName: 'Event_Date__c', type: 'date' },
        { label: 'Email', fieldName: 'Email__c', type: 'email' },
        { label: 'Phone', fieldName: 'Phone__c', type: 'phone' }
    ];

    @wire(getRegistrations, { pageSize: '$pageSize', pageNumber: '$currentPage' })
    wiredGetRegistrations(result) {
        this.wiredRegistrations = result;
        if (result.data) {
            this.registrations = result.data;
        } else if (result.error) {
            this.showNotification('Error', 'Failed to load registrations', 'error');
        }
    }

     @wire(getRegistraionDataCount)
        wiredCount({ error, data }) {
            if (data) {
                this.totalRecords = data;
            } else if (error) {
                this.hasError = true;
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


    handleRowSelection(event) {
        this.selectedRows = event.detail.selectedRows;
    }

    openRegistrationForm() {
        this.showForm = true;
    }

    closeRegistrationForm() {
        this.showForm = false;
        this.resetForm();
    }

    handleNameChange(event) {
        this.name = event.target.value;
    }

    handleDateChange(event) {
        this.eventDate = event.target.value;
    }

    handleEmailChange(event) {
        this.email = event.target.value;
    }

    handlePhoneChange(event) {
        this.phone = event.target.value;
    }

    handleFormSubmit() {
        if (!this.name || !this.eventDate || !this.email || !this.phone) {
            this.showNotification('Error', 'All fields are required.', 'error');
            return;
        }
        if (new Date(this.eventDate) < new Date()) {
            this.showNotification('Error', 'Event date must be in the future.', 'error');
            return;
        }
        if (!/^\d{10}$/.test(this.phone)) {
            this.showNotification('Error', 'Phone number must be 10 digits.', 'error');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
            this.showNotification('Error', 'Invalid email format.', 'error');
            return;
        }

        const newRegistration = {
            Name: this.name,
            Event_Date__c: this.eventDate,
            Email__c: this.email,
            Phone__c: this.phone
        };

        createRegistration({ newRegistration })
            .then(() => {
                this.showNotification('Success', 'Registration created successfully.', 'success');
                this.closeRegistrationForm();
                return refreshApex(this.wiredRegistrations);
            })
            .catch(error => this.handleError(error));
    }

    resetForm() {
        this.name = '';
        this.eventDate = '';
        this.email = '';
        this.phone = '';
    }


    openEditModal() {
        // Validate that exactly one row is selected
        if (this.selectedRows.length === 0) {
            this.showNotification('Warning', 'Please select a row to edit.', 'warning');
            return;
        }

        if (this.selectedRows.length > 1) {
            this.showNotification('Warning', 'You can only edit the event date for one record at a time.', 'warning');
            return;
        }

        // Populate the modal fields with the selected row's data
        const selectedRow = this.selectedRows[0];
        this.newName = selectedRow.Name;
        this.newEventDate = selectedRow.Event_Date__c;

        // Open the modal
        this.showEditModal = true;
    }


    closeEditModal() {
        this.showEditModal = false;
        this.selectedRows = [];
    }

    handleNewEventDateChange(event) {
        this.newEventDate = event.target.value;
    }

    handleNewNameChange(event) {
        this.newName = event.target.value;
    }

    handleEditSave() {
        if (!this.newEventDate || new Date(this.newEventDate) < new Date()) {
            this.showNotification('Error', 'Event date must be in the future.', 'error');
            return;
        }

        const updatedRecords = this.selectedRows.map(row => ({
            Id: row.Id,
            Event_Date__c: this.newEventDate,
            Name: this.newName
        }));

        updateEventDate({ updatedRecords })
            .then(() => {
                this.showNotification('Success', 'Event dates updated successfully.', 'success');
                this.closeEditModal();
                return refreshApex(this.wiredRegistrations);
            })
            .catch(error => this.handleError(error));
    }

    showNotification(title, message, variant) {
        const evt = new ShowToastEvent({
            title,
            message: message || 'An unexpected error occurred',
            variant: variant || 'error'
        });
        this.dispatchEvent(evt);
    }

    handleError(error) {
        let errorMessage = 'An unexpected error occurred';
        if (error && error.body && error.body.message) {
            errorMessage = error.body.message;
        }
        this.showNotification('Error', errorMessage, 'error');
    }
}