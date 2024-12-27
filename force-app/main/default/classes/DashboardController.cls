// Apex Controller to fetch user achievements
public with sharing class DashboardController {
    @AuraEnabled(cacheable=true)
    public static List<Achievement__c> getUserAchievements() {
        User currentUser = [SELECT Id FROM User WHERE Id = :UserInfo.getUserId()];
        return [SELECT Name, Type__c, Date__c FROM Achievement__c WHERE User__c = :currentUser.Id];
    }
}