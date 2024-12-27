public with sharing class CarController {
    @AuraEnabled(cacheable=true)
    public static List<Car__c> getAvailableCars() {
        return [SELECT Id, Model__c, Price__c, Status__c, Availability_Date__c FROM Car__c WHERE Status__c = 'Available'];
    }
}