import { LightningElement, api } from 'lwc';

export default class LoadingSpinner extends LightningElement {
    @api loading;  // Receive loading state from parent component
    @api message = 'Loading, please wait...'; // Default loading message
}