import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getContact from '@salesforce/apex/ContactService.getContact';

export default class EditableContactForm extends LightningElement {
    @api recordId; // Record ID passed dynamically for edit
    phoneError = false;
    emailError = false;
    phoneValue = '';
    emailValue = '';

    // Dynamically set form title
    get formTitle() {
        return this.recordId ? 'Edit Contact' : 'Create New Contact';
    }

    // Wire the getContact method to fetch contact data based on recordId
    @wire(getContact, { recordId: '$recordId' })
    wiredContact({ error, data }) {
        if (data) {
            this.phoneValue = data.Phone;
            this.emailValue = data.Email;
            // Validate the fetched values
            this.validatePhone({ target: { value: this.phoneValue } });
            this.validateEmail({ target: { value: this.emailValue } });
        }
    }


    // Phone Validation (10 digits)
    validatePhone(event) {
        const phoneValue = event.target.value;
        this.phoneValue = phoneValue;
        const phonePattern = /^\d{10}$/;

        // Debugging: Log the phone value being validated
        console.log('Validating Phone:', phoneValue);

        this.phoneError = !phonePattern.test(phoneValue);
        if (this.phoneError) {
            this.showToast('Error', 'Phone number must be exactly 10 numeric digits.', 'error');
        } else {
            // Optionally, you can log a success message
            console.log('Phone number is valid:', phoneValue);
        }
    }

    // Email Validation
    validateEmail(event) {
        const emailValue = event.target.value;
        this.emailValue = emailValue;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        this.emailError = !emailPattern.test(emailValue);
        if (this.emailError) {
            this.showToast('Error', 'Please enter a valid email address (e.g., example@domain.com).', 'error');
        }
    }

    handleSubmit(event) {
        // Validate phone and email regardless of changes
        this.validatePhone({ target: { value: this.phoneValue } });
        this.validateEmail({ target: { value: this.emailValue } });

        // Prevent submission if there are validation errors
        if (this.emailError || this.phoneError) {
            event.preventDefault();
            if (this.emailError) {
                this.showToast('Error', 'Please enter a valid email address (e.g., example@domain.com).', 'error');
            }
            if (this.phoneError) {
                this.showToast('Error', 'Phone number must be exactly 10 numeric digits.', 'error');
            }
        }
    }

    // Success Handler
    handleSuccess() {
        const message = this.recordId ? 'Contact updated successfully!' : 'Contact created successfully!';
        this.showToast('Success', message, 'success');
        this.closeForm();
    }

    // Error Handler
    handleError(event) {
        this.showToast('Error', event.detail.message, 'error');
    }

    // Toast Notification Utility
    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title,
                message,
                variant,
                mode: 'dismissable'
            })
        );
    }

    // Close Form (Optional for Parent Control)
    closeForm() {
        const closeEvent = new CustomEvent('close');
        this.dispatchEvent(closeEvent);
    }
}