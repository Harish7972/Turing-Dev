// import { LightningElement, wire, track } from 'lwc';
// import getAvailableCars from '@salesforce/apex/CarController.getAvailableCars';

// export default class CarCard extends LightningElement {
//     @track car;

//     @wire(getAvailableCars)
//     wiredCars({ data, error }) {
//         if (data) {
//             this.car = data;
//             console.log('this.car ='+ JSON.stringify(this.car));
//         }
//     }
// }


import { LightningElement, track, wire } from 'lwc';
import getAvailableCars from '@salesforce/apex/CarController.getAvailableCars';

export default class CarList extends LightningElement {
    @track cars = [];
    @track isModalOpen = false;
    @track selectedCar = {};

    @wire(getAvailableCars)
    wiredCars({ data, error }) {
        if (data) {
            this.cars = data;
        } else if (error) {
            console.error('Error fetching cars:', error);
        }
    }

    handleReserve(event) {
        event.stopPropagation(); // Prevent the event from reaching parent
        const carId = event.target.dataset.id;
        this.selectedCar = this.cars.find(car => car.Id === carId);
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
        this.selectedCar = {};
    }

    confirmReservation() {
        alert(`Reservation confirmed for ${this.selectedCar.Model__c}`);
        this.closeModal();
    }
}