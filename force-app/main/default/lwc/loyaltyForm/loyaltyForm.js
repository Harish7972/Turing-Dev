import { LightningElement, track } from 'lwc';

export default class LoyaltyForm extends LightningElement {
    @track email = '';
    @track emailError = '';
    @track phone = '';
    @track phoneError = '';

    handleEmailInput(event) {
        this.email = event.target.value;
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        this.emailError = emailPattern.test(this.email) ? '' : 'Invalid email format';
    }

    handleEmailBlur() {
        if (!this.email) {
            this.emailError = 'Email is required';
        }
    }

    handlePhoneInput(event) {
        this.phone = event.target.value;
        const phonePattern = /^[0-9]{10}$/; // example pattern for a 10-digit number
        this.phoneError = phonePattern.test(this.phone) ? '' : 'Invalid phone format';
    }

    handlePhoneBlur() {
        if (!this.phone) {
            this.phoneError = 'Phone number is required';
        }
    }
}