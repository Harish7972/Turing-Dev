// import { LightningElement, track } from 'lwc';
// import saveVolunteer from '@salesforce/apex/VolunteerController.saveVolunteer';

// export default class VolunteerForm extends LightningElement {
//     // Tracks all form field values as an object
//     @track formFields = { name: '', email: '', phone: '', experience: '' };

//     // Tracks error messages for validation or save errors
//     @track errorMessage = '';

//     // Method to handle input changes and update field values dynamically
//     handleInputChange(event) {
//         const { name, value } = event.target; // Destructure the name and value from the input event
//         this.formFields[name] = value; // Update the corresponding field in the formFields object

//         // Validate phone number to ensure it's 10 digits
//         if (name === 'phone' && value && !/^\d{10}$/.test(value)) {
//             this.errorMessage = 'Phone number must be 10 digits.'; // Set validation error message
//         } else if (name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
//             this.errorMessage = 'Please enter a valid email address.'; // Set email validation error message
//         } else {
//             this.errorMessage = ''; // Clear error message if validation passes
//         }
//     }

//     // Method to handle form submission
//     async handleFormSubmit(event) {
//         event.preventDefault(); // Prevent default form submission behavior
    
//         // Validate all inputs using the `reportValidity` method
//         const allValid = [...this.template.querySelectorAll('lightning-input, lightning-textarea')]
//             .reduce((validSoFar, input) => validSoFar && input.reportValidity(), true);
    
//         if (allValid) {
//             try {
//                 // Call the Apex method to save volunteer data
//                 await saveVolunteer({ volunteerData: this.formFields });
//                 alert('Volunteer registered successfully!'); // Show success alert
//             } catch (error) {
//                 // Set error message for any issues during the save operation
//                 this.errorMessage = 'Error saving volunteer data. Please try again.';
//             }
//         } else {
//             // Set error message if form validation fails
//             this.errorMessage = 'Please correct the errors before submitting.';
//         }
//     }
    
// }



import { LightningElement, track } from 'lwc';
import saveVolunteer from '@salesforce/apex/VolunteerController.saveVolunteer';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class VolunteerForm extends LightningElement {
    @track formFields = { name: '', email: '', phone: '', experience: '' };
    @track errorMessage = '';

    handleInputChange(event) {
        const { name, value } = event.target;
        this.formFields[name] = value;

        // Reset error message on input change
        this.errorMessage = '';

        // Validate phone number to ensure it's 10 digits and contains only numbers
        if (name === 'phone') {
            if (value && !/^\d{10}$/.test(value)) {
                this.errorMessage = 'Phone number must be 10 digits and contain only numbers.';
            }
        } else if (name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            this.errorMessage = 'Please enter a valid email address.';
        }
    }

    async handleFormSubmit(event) {
        event.preventDefault();

        // Validate all inputs using the `reportValidity` method
        const allValid = [...this.template.querySelectorAll('lightning-input, lightning-textarea')]
            .reduce((validSoFar, input) => validSoFar && input.reportValidity(), true);

        // Additional validation for phone number
        if (this.formFields.phone && !/^\d{10}$/.test(this.formFields.phone)) {
            this.errorMessage = 'Phone number must be 10 digits and contain only numbers.';
        }

        if (allValid && !this.errorMessage) {
            try {
                await saveVolunteer({ volunteerData: this.formFields });

                // Show success toast message
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Volunteer registered successfully!',
                        variant: 'success',
                    })
                );

                // Reset form fields to default values
                this.formFields = { name: '', email: '', phone: '', experience: '' };

                // Clear the input fields in the UI
                this.template.querySelectorAll('lightning-input, lightning-textarea').forEach((input) => {
                    input.value = '';
                });

            } catch (error) {
                this.errorMessage = 'Error saving volunteer data. Please try again.';
            }
        } else {
            this.errorMessage = 'Please correct the errors before submitting.';
        }
    }
}