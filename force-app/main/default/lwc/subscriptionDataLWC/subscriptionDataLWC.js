// subscriptionDataLWC.js
import { LightningElement, track, wire } from 'lwc';
import getSubscriptionData from '@salesforce/apex/ApiUsageMonitor.getSubscriptionData';

export default class SubscriptionDataLWC extends LightningElement {
    @track subscriptionData;
    @track error;

    @wire(getSubscriptionData) 
    wiredSubscriptionData({ error, data }) {
        if (data) {
            this.subscriptionData = data;
            console.log('this.subscriptionData='+JSON.stringify(this.subscriptionData));
        } else if (error) {
            this.error = 'Error fetching data, please try again later.';
            console.error('Error:', error);
            alert('Warning: Approaching API usage limit. Please review.');
        }
    }
}