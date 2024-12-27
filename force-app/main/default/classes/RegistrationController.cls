public with sharing class RegistrationController {

    // Method to get the latest 10 Registration records, respecting FLS.
    @AuraEnabled(cacheable=true)
    public static List<Registration__c> getRegistrations(Integer pageSize, Integer pageNumber) {
        // Ensure that the user has field-level access to the fields we are querying
        if (!Schema.sObjectType.Registration__c.fields.Id.isAccessible() ||
            !Schema.sObjectType.Registration__c.fields.Event_Date__c.isAccessible() ||
            !Schema.sObjectType.Registration__c.fields.Email__c.isAccessible() ||
            !Schema.sObjectType.Registration__c.fields.Phone__c.isAccessible()) {
            throw new AuraHandledException('You do not have permission to view some of the fields.');
        }

        // Calculate the offset
        Integer offsetValue = (pageNumber - 1) * pageSize;
        List<Registration__c> registrations = [SELECT Id, Name, Event_Date__c, Email__c, Phone__c
                                                FROM Registration__c
                                                ORDER BY createdDate DESC
                                                LIMIT :pageSize OFFSET :offsetValue];

        // Check if records exist and handle if none are found
        if (registrations.isEmpty()) {
            throw new AuraHandledException('No records found.');
        }

        return registrations;
    }

    // Method to update Event Date with FLS check and ensure the event date is not in the past.
    @AuraEnabled
    public static void updateEventDate(List<Registration__c> updatedRecords) {
        // Check FLS for fields before performing DML operations
        for (Registration__c record : updatedRecords) {
            if (!Schema.sObjectType.Registration__c.fields.Event_Date__c.isUpdateable()) {
                throw new AuraHandledException('You do not have permission to update the Event Date.');
            }

            // Business Logic: Event Date should not be in the past
            if (record.Event_Date__c < Date.today()) {
                throw new AuraHandledException('Event Date cannot be in the past.');
            }
        }

        // Perform update operation with error handling
        try {
            update updatedRecords;
        } catch (DmlException e) {
            throw new AuraHandledException('An error occurred while updating the records: ' + e.getMessage());
        }
    }

    // Method to create a new Registration, checking for FLS and future Event Date.
    @AuraEnabled
    public static void createRegistration(Registration__c newRegistration) {
        // Check FLS for fields
        if (!Schema.sObjectType.Registration__c.fields.Event_Date__c.isCreateable()) {
            throw new AuraHandledException('You do not have permission to create a Registration with the specified Event Date.');
        }

        // Business Logic: Event Date cannot be in the past
        if (newRegistration.Event_Date__c < Date.today()) {
            throw new AuraHandledException('Event Date cannot be in the past.');
        }

        // Perform insert operation with error handling
        try {
            insert newRegistration;
        } catch (DmlException e) {
            throw new AuraHandledException('An error occurred while creating the registration: ' + e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static Integer getRegistraionDataCount() {
        try {
            // Check object-level access before querying
            if (!Schema.sObjectType.FinancialData__c.isAccessible()) {
                throw new AuraHandledException('Insufficient permissions to access FinancialData__c.');
            }

            return [SELECT COUNT() FROM Registration__c];
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching data count: ' + e.getMessage());
        }
    }
}