import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import saveRequest from '@salesforce/apex/AssistanceRequestHandler.saveRequest';
import getCategories from '@salesforce/apex/AssistanceRequestHandler.getCategories';
import Helpnow from '@salesforce/resourceUrl/Helpnow';

export default class AssistanceRequestForm extends LightningElement {
    @track name = '';
    @track contact = '';
    @track email = '';
    @track details = '';
    @track category = '';
    @track categories = [];
    isFormVisible = false;
    imageUrl3 = Helpnow;

    @track isPhoneNumericLengthNumericError = false;
    @track isPhoneNumericError = false;
    @track isPhoneLengthError = false;
    @track isEmailError = false;

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
            this.contact = fieldValue;
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
        } else if (fieldName === 'email') {
            this.email = fieldValue;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            this.isEmailError = !emailRegex.test(fieldValue);
        }
        else if (fieldName === 'Name') {
            this.name = fieldValue;
        }
        else if (fieldName === 'details') {
            this.details = fieldValue;
        }

        this[fieldName] = fieldValue;
    }

    handleFormSubmit(event) {
        event.preventDefault();

        console.log('this.email='+this.email);
        console.log('this.contact='+this.contact);
        console.log('this.Name='+this.Name);
        console.log('this.details='+this.details);
        // Check if all required fields are filled
        if (this.name==null || this.contact==null || this.email==null || this.details==null || this.category==null) {
            this.showToast('Error', 'Please complete all fields before submitting.', 'error', 'pester');
            return;
        }

        // Check if there are any validation errors
        if (
            this.isPhoneNumericLengthNumericError ||
            this.isPhoneNumericError ||
            this.isPhoneLengthError ||
            this.isEmailError
        ) {
            this.showToast('Error', 'Please correct the validation errors before submitting.', 'error', 'pester');
            return;
        }

        // Proceed with form submission
        saveRequest({
            name: this.name,
            contact: this.contact,
            email: this.email,
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


    validateForm() {
        if (!this.name || !this.contact || !this.email || !this.details  || this.isEmailError) {
            this.showToast('Warning', 'Please complete all fields with valid data before submitting.', 'warning', 'pester');
            return false;
        }
        return true;
    }


    get isSubmitDisabled() {
        return (
            !this.name ||
            !this.contact ||
            !this.email ||
            !this.details ||
            this.isPhoneNumericLengthNumericError ||
            this.isPhoneNumericError ||
            this.isPhoneLengthError ||
            this.isEmailError
        );
    }

    clearForm() {
        this.name = '';
        this.contact = '';
        this.email = '';
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