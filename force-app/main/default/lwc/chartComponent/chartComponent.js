// ChartComponent.js - Simulates an error in the child component
import { LightningElement } from 'lwc';

export default class ChartComponent extends LightningElement {
    connectedCallback() {
        // Simulate an error in the child component
        throw new Error('Something went wrong in the child component!');
    }
}