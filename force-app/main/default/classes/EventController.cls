public with sharing class EventController {
    @AuraEnabled(cacheable=true)
    public static List<Event__c> fetchEvents() {
        try {
            return [SELECT Id, Name FROM Event__c];
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching events: ' + e.getMessage());
        }
    }

    @AuraEnabled
    public static void saveRegistration(Map<String, Object> data) {
        try {
            Registration__c newRegistration = new Registration__c();
            newRegistration.Name = (String)data.get('name');
            newRegistration.Email__c = (String)data.get('email');
            newRegistration.Phone__c = (String)data.get('phone');
            newRegistration.Event_Date__c = Date.valueOf((String)data.get('date'));
            newRegistration.Event__c = (String)data.get('eventId'); // Ensure this is the lookup Id
            insert newRegistration;
        } catch (Exception e) {
            throw new AuraHandledException('Error saving registration: ' + e.getMessage());
        }
    }
}