// public with sharing class AccountController2 {
//     @AuraEnabled(cacheable=true)
//     public static Account getCustomerData() {
//         try {
//             // Assume we're fetching current customer’s account details
//             Account account = [SELECT Id, Name, AccountNumber FROM Account WHERE Id = :UserInfo.getUserId() LIMIT 1]; //WHERE Id = :UserInfo.getUserId()
//             return account;
//         } catch (Exception e) {
//             throw new AuraHandledException('Error retrieving customer data: ' + e.getMessage());
//         }
//     }
// }

public with sharing class AccountController2 {
    @AuraEnabled(cacheable=true)
    public static Account getCustomerData() {
        try {
            System.debug('Fetching Account Data'); // Debug log
            Account account = [SELECT Id, Name, AccountNumber FROM Account LIMIT 1];
            System.debug('Account Data: ' + account);
            return account;
        } catch (Exception e) {
            throw new AuraHandledException('Error retrieving customer data: ' + e.getMessage());
        }
    }
}