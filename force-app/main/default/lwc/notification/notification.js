import { LightningElement, api } from 'lwc';

export default class Notification extends LightningElement {
    @api message;
}