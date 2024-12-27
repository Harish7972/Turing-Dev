public with sharing class VolunteerController {

    /**
     * Apex method to save volunteer data into the custom object `Volunteer__c`.
     * @param volunteerData Map<String, String> - Contains the field values for the `Volunteer__c` record.
     * @return Id - Returns the Id of the newly created `Volunteer__c` record.
     */
    @AuraEnabled
    public static Id saveVolunteer(Map<String, String> volunteerData) {
        try {
            // Create a new `Volunteer__c` record
            Volunteer__c volunteer = new Volunteer__c();

            // Populate fields using data from the input map
            volunteer.Name__c = volunteerData.get('name');
            volunteer.Email__c = volunteerData.get('email');
            volunteer.Phone__c = volunteerData.get('phone');
            volunteer.Experience__c = volunteerData.get('experience');

            // Insert the new volunteer record
            insert volunteer;
            return volunteer.Id; // Return the Id of the created record
        } catch (Exception e) {
            // Handle exceptions, such as validation errors
            throw new AuraHandledException('Error saving volunteer data: ' + e.getMessage());
        }
    }
}