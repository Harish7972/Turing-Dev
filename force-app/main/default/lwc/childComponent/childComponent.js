import { LightningElement } from 'lwc';

export default class ChildComponent extends LightningElement {
    connectedCallback() {
        throw new Error('Something went wrong due to a specific condition!');
    }
}