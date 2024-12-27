public with sharing class AccountController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        try {
            return [SELECT Id, Name FROM Account LIMIT 10];
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching accounts');
        }
    }
}