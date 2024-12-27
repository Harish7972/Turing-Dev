import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import saveRequest from '@salesforce/apex/AssistanceRequestHandler.saveRequest';
import getCategories from '@salesforce/apex/AssistanceRequestHandler.getCategories';
import Helpnow from '@salesforce/resourceUrl/Helpnow';

export default class AssistanceRequestForm1 extends LightningElement {
    @track name = '';
    @track contact = '';
    @track details = '';
    @track category = '';
    @track categories = [];
    isFormVisible = false;
    imageUrl3 = Helpnow;
    @track isPhoneNumericLengthNumericError = false;
    @track isPhoneNumericError = false;
    @track isPhoneLengthError = false;

    connectedCallback() {
        this.loadCategories();
    }

    loadCategories() {
        getCategories()
            .then((result) => {
                this.categories = result;
                this.showToast('Success', 'Categories loaded successfully!', 'success', 'dismissable');
            })
            .catch((error) => {
                this.showToast('Error', 'Failed to load categories.', 'error', 'sticky');
            });
    }

    handleCategorySelect(event) {
        this.category = event.target.value;
        this.isFormVisible = !!this.category;

        if (this.isFormVisible) {
            this.showToast('Info', 'Category selected. Please fill in the details.', 'info', 'dismissable');
        }
    }

    handleInputChange(event) {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;

        if (fieldName === 'contact') {
            const isNumeric = /^\d+$/.test(fieldValue);
            const isValidLength = fieldValue.length === 10;

            this.isPhoneNumericLengthNumericError = false;
            this.isPhoneNumericError = false;
            this.isPhoneLengthError = false;

            if (!isValidLength && !isNumeric) {
                this.isPhoneNumericLengthNumericError = true;
            } else if (!isValidLength) {
                this.isPhoneLengthError = true;
            } else if (!isNumeric) {
                this.isPhoneNumericError = true;
            }
        }

        this[fieldName] = fieldValue;
    }

    handleFormSubmit(event) {
        event.preventDefault();

        if (this.validateForm()) {
            saveRequest({
                name: this.name,
                contact: this.contact,
                details: this.details,
                category: this.category
            })
                .then(() => {
                    this.showToast('Success', 'Your assistance request was submitted successfully!', 'success', 'pester');
                    this.clearForm();
                })
                .catch((error) => {
                    this.showToast('Error', error.body.message, 'error', 'sticky');
                });
        }
    }

    validateForm() {
        if (!this.name || !this.contact || !this.details || !this.category) {
            this.showToast('Warning', 'Please complete all fields before submitting.', 'warning', 'pester');
            return false;
        }
        return true;
    }

    get isSubmitDisabled() {
        return (
            !this.name ||
            !this.contact ||
            !this.details ||
            !this.category ||
            this.isPhoneNumericLengthNumericError ||
            this.isPhoneNumericError ||
            this.isPhoneLengthError
        );
    }

    clearForm() {
        this.name = '';
        this.contact = '';
        this.details = '';
        this.category = '';
        this.isFormVisible = false;
        this.showToast('Info', 'Form has been reset.', 'info', 'dismissable');
    }

    showToast(title, message, variant, mode) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(event);
    }
}