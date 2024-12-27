import { LightningElement } from 'lwc';

export default class ParentComponent2 extends LightningElement {
    message = 'Hello, Child Component!';

    handleMessageChange() {
        this.template.querySelector('c-child-component2').changeMessage('New Message from Parent');
    }
}