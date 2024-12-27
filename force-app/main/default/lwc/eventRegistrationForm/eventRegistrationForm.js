import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import fetchEvents from '@salesforce/apex/EventController.fetchEvents';
import saveRegistration from '@salesforce/apex/EventController.saveRegistration';
import EventManagement1 from '@salesforce/resourceUrl/EventManagement1';
import EventManagement2 from '@salesforce/resourceUrl/EventManagement2';
import EventManagement3 from '@salesforce/resourceUrl/EventManagement3';

export default class EventRegistrationForm extends LightningElement {
    @track events = [];
    @track name = '';
    @track email = '';
    @track phone = '';
    @track date = '';
    @track selectedEventId = '';
    isFormVisible = false;
    @track isPhoneNumericLengthNumericError = false;
    @track isPhoneNumericError = false;
    @track isPhoneLengthError = false;
    @track dateError = false;

    imageUrl1 = EventManagement1;
    imageUrl2 = EventManagement2;
    imageUrl3 = EventManagement3;

    connectedCallback() {
        this.loadEvents();
    }

    loadEvents() {
        fetchEvents()
            .then((result) => {
                this.events = result;
            })
            .catch((error) => {
                this.showToast('Error', 'Failed to fetch events.', 'error');
                console.error(error);
            });
    }

    handleEventSelect(event) {
        this.selectedEventId = event.target.value;
        this.isFormVisible = this.selectedEventId !== '';
    }

    handleInputChange(event) {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;

        if (fieldName === 'phone') {
            // Validate phone input for numeric-only values and length
            const isNumeric = /^\d+$/.test(fieldValue);
            const isValidLength = fieldValue.length === 10;

            // Reset all phone error flags
            this.isPhoneNumericLengthNumericError = false;
            this.isPhoneNumericError = false;
            this.isPhoneLengthError = false;

            // Set specific error flags based on conditions
            if (!isValidLength && !isNumeric) {
                this.isPhoneNumericLengthNumericError = true;
            } else if (!isValidLength) {
                this.isPhoneLengthError = true;
            } else if (!isNumeric) {
                this.isPhoneNumericError = true;
            }
        }

        if (fieldName === 'date') {
            this.date = fieldValue;

            // Get today's date in YYYY-MM-DD format
            const today = new Date();
            const todayString = today.toISOString().split('T')[0];

            // Check if the selected date is in the past
            this.dateError = fieldValue < todayString;
        }

        this[fieldName] = fieldValue;
    }

    handleFormSubmit(event) {
        event.preventDefault(); // Prevent browser form submission
    
        // Validate all fields using custom logic
        if (this.isPhoneNumericLengthNumericError || this.isPhoneNumericError || this.isPhoneLengthError) {
            this.showToast('Error', 'Please correct the phone field.', 'error');
            return;
        }
    
        if (this.dateError) {
            this.showToast('Error', 'Please select a valid date.', 'error');
            return;
        }
    
        const formData = {
            name: this.name,
            email: this.email,
            phone: this.phone,
            date: this.date,
            eventId: this.selectedEventId,
        };
    
        // Call Apex method to save registration data
        saveRegistration({ data: formData })
            .then(() => {
                this.showToast('Success', 'Registration successful!', 'success');
                this.clearForm();
            })
            .catch((error) => {
                this.showToast('Error', 'Failed to register.', 'error');
                console.error(error);
            });
    }
    

    clearForm() {
        this.name = '';
        this.email = '';
        this.phone = '';
        this.date = '';
        this.selectedEventId = '';
        this.isFormVisible = false;
        this.isPhoneNumericLengthNumericError = false;
        this.isPhoneNumericError = false;
        this.isPhoneLengthError = false;
        this.dateError = false;

        // Reset the combobox value to "Select an Event"
        const eventDropdown = this.template.querySelector('#event');
        if (eventDropdown) {
            eventDropdown.value = ''; // Reset to default "Select an Event"
        }
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