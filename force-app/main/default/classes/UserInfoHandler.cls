public with sharing class UserInfoHandler {
    @AuraEnabled(cacheable=true)
    public static String getCurrentUserName() {
        return [SELECT Name FROM User WHERE Id = :UserInfo.getUserId()].Name;
    }
}