// import { LightningElement } from 'lwc';

// export default class RegistrationForm extends LightningElement {
//     firstName = '';
//     lastName = '';
//     email = '';
//     password = '';

//     handleInput(event) {
//         this[event.target.name] = event.target.value;
//     }

//     handleFocus(event) {
//         event.target.classList.add('focused-field');
//     }

//     handleBlur(event) {
//         //event.target.classList.remove('focused-field');
//         const email = event.target.value;
//         // Validate the email format
//         if (!email.includes('@')) {
//             this.emailError = 'Invalid email address. Please include "@" in the email.';
//         } else {
//             this.emailError = ''; // Clear error if valid
//         }
//     }

//     handleReset() {
//         this.firstName = '';
//         this.lastName = '';
//         this.email = '';
//         this.password = '';
//         this.template.querySelector('form').reset();
//     }

//     handleSubmit(event) {
//         event.preventDefault();
//         if (this.firstName && this.lastName && this.email && this.password) {
//             alert('Form submitted successfully!');
//         } else {
//             alert('Please fill in all fields.');
//         }
//     }
// }


import { LightningElement } from 'lwc';

export default class RegistrationForm extends LightningElement {
    firstName = '';
    lastName = '';
    email = '';
    password = '';
    emailError = '';

    handleInput(event) {
        this[event.target.name] = event.target.value;
    }

    handleFocus(event) {
        event.target.classList.add('focused-field');
    }

    handleBlur(event) {
        const email = event.target.value;
        // Validate the email format
        if (event.target.name === 'email' && !email.includes('@')) {
            this.emailError = 'Invalid email address. Please include "@" in the email.';
        } else {
            this.emailError = ''; // Clear error if valid
        }
    }

    handleReset() {
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.password = '';
        this.template.querySelector('form').reset();
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.firstName && this.lastName && this.email && this.password) {
            alert('Form submitted successfully!');
        } else {
            alert('Please fill in all fields.');
        }
    }
}