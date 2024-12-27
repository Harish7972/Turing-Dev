import { LightningElement, api } from 'lwc';

export default class GenericDisplayComponent extends LightningElement {
    @api records; // Accepts the data (array of objects)
    @api fields; // Accepts the list of fields to display
    @api title = 'Generic Data Display'; // Title for the card

    // Computed data for rendering
    get computedRecords() {
        if (!this.records || !this.fields) {
            return [];
        }
        return this.records.map(record => {
            const computedFields = {};
            this.fields.forEach(field => {
                computedFields[field] = record[field];
            });
            return { id: record.Id, fields: computedFields };
        });
    }
}
