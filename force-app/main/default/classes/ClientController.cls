public with sharing class ClientController {
    @AuraEnabled(cacheable=true)
    public static List<Client__c> getClients() {
        return [SELECT Id, Name FROM Client__c ORDER BY Name LIMIT 1]; // Fetch client data
    }
}