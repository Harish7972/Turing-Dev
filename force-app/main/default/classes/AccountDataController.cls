public with sharing class AccountDataController {  
    @AuraEnabled(cacheable=true)  
    public static List<Account> getAccounts() {  
        return [SELECT Id, Name, Industry, AnnualRevenue FROM Account LIMIT 10];  
    }  
}