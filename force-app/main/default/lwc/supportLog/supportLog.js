import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class SupportLogTile extends LightningElement {
    @api subject;
    @api description;
    @api logId;
    @api status;

    handleResolveClick() {
        // Dispatch a custom event with log details
        const resolveEvent = new CustomEvent('logresolved', {
            detail: { logId: this.logId, status: 'Resolved' }
        });
        this.dispatchEvent(resolveEvent);

        // Show a success toast
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success!',
                message: `Support Log "${this.subject}" marked as Resolved.`,
                variant: 'success'
            })
        );
    }
}