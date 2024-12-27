public with sharing class ContactService {
    @AuraEnabled(cacheable=true)
    public static Id fetchLatestContactId() {
        // Fetch the latest Contact record based on CreatedDate
        if (!Schema.sObjectType.Contact.isAccessible()) {
                throw new AuraHandledException('Insufficient permissions to access Dashboard_Data__c.');
            }
        Contact latestContact = [
            SELECT Id
            FROM Contact
            ORDER BY CreatedDate DESC
            LIMIT 1
        ];
        return latestContact != null ? latestContact.Id : null;
    }

    @AuraEnabled(cacheable=true)
    public static Contact getContact(Id recordId) {
        if (!Schema.sObjectType.Contact.isAccessible()) {
                throw new AuraHandledException('Insufficient permissions to access Dashboard_Data__c.');
            }
        return [SELECT Id, FirstName, LastName, Phone, Email FROM Contact WHERE Id = :recordId LIMIT 1];
    }
}