import { LightningElement, track } from 'lwc';
import getClients from '@salesforce/apex/ClientController.getClients';

export default class ParentDashboard extends LightningElement {
    @track clients = [];
    @track selectedClientId;
    @track error;

    connectedCallback() {
        this.loadClients();
    }

    // Fetch the list of clients from the server
    loadClients() {
        getClients()
            .then((result) => {
                this.clients = result;
                console.log('this.clients='+JSON.stringify(this.clients));
                console.log('this.clients='+this.clients);
                this.error = undefined;
                if (this.clients && this.clients.length > 0) {
                    this.selectedClientId = this.clients[0].Id;
                } else {
                    this.selectedClientId = null; // Handle case when clients array is empty
                }
                console.log('this.selectedClientId='+this.selectedClientId);
            })
            .catch((error) => {
                this.error = error;
                this.clients = [];
            });
    }

    // Handle client selection
    handleClientSelection(event) {
        this.selectedClientId = event.currentTarget.dataset.id;
    }

    get hasClients() {
        return this.clients && this.clients.length > 0;
    }
}