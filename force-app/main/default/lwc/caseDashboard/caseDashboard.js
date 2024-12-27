import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import updateCaseStatus from '@salesforce/apex/CaseController.updateCaseStatus';
import escalateCase from '@salesforce/apex/CaseController.escalateCase';

export default class CaseDashboard extends LightningElement {
    @track selectedCaseIds = [];
    @track selectedCaseForDetail = null; // Holds the selected case ID for details
    @track tempId;

    // Button Enablement
    get isDetailsButtonDisabled() {
        return this.selectedCaseIds.length !== 1;
    }

    get isUpdateButtonDisabled() {
        return this.selectedCaseIds.length !== 1;
    }

    get isEscalateButtonDisabled() {
        return this.selectedCaseIds.length !== 1;
    }

    // Handle custom event from CaseList
    handleCaseSelection(event) {
        this.selectedCaseIds = event.detail.selectedCaseIds || [];
        this.tempId = this.selectedCaseIds;
        console.log('this.selectedCaseIds '+this.selectedCaseIds);
        console.log(' this.tempId '+ this.tempId);
        this.selectedCaseForDetail = null; // Reset case details when selection changes
    }

    // Show case details
    handleShowDetails() {
        if (this.selectedCaseIds.length === 1) {
            const selectedCaseId = this.selectedCaseIds[0];
            this.tempId = selectedCaseId;
            console.log('tempId '+this.tempId);
            // this.selectedCaseForDetail = this.tempId; // Pass the case ID to the CaseDetail component
            // console.log('selectedCaseId '+this.selectedCaseId);
            this.showToast('Info', `Showing details for Case ${selectedCaseId}`, 'info');
        } else {
            this.showToast('Error', 'Please select exactly one case to view details.', 'error');
        }
    }

    // Update case status
    handleUpdateStatus() {
        const selectedCaseId = this.selectedCaseIds[0];
        updateCaseStatus({ caseId: selectedCaseId, newStatus: 'Closed' })
            .then(() => {
                this.showToast('Success', `Case ${selectedCaseId} status updated successfully.`, 'success');
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
            });
    }

    // Escalate case
    handleEscalateCase() {
        const selectedCaseId = this.selectedCaseIds[0];
        escalateCase({ caseId: selectedCaseId })
            .then(() => {
                this.showToast('Success', `Case ${selectedCaseId} escalated successfully.`, 'success');
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
            });
    }

    // Show toast notifications
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title,
            message,
            variant,
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }
}