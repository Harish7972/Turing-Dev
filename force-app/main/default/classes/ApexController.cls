public with sharing class ApexController {
    @AuraEnabled(cacheable=true)
    public static List<Account> fetchData(Integer pageSize, Integer pageNumber) {
        try {
            // Null checks for pageSize and pageNumber
            if (pageSize == null || pageSize <= 0) {
                throw new AuraHandledException('Invalid pageSize. It must be a positive integer.');
            }
            if (pageNumber == null || pageNumber <= 0) {
                throw new AuraHandledException('Invalid pageNumber. It must be a positive integer.');
            }

            Integer offsetValue = (pageNumber - 1) * pageSize;
            return [SELECT Id, Name, Phone, BillingStreet, ShippingStreet
                    FROM Account
                    WITH SECURITY_ENFORCED
                    ORDER BY CreatedDate DESC
                    LIMIT :pageSize OFFSET :offsetValue];
        } catch (Exception ex) {
            throw new AuraHandledException('Error while fetching data. Check your permissions.');
        }
    }

    @AuraEnabled
    public static void updateData(Account account) {
        try {
            if (account == null || account.Id == null) {
                throw new AuraHandledException('Account and Account ID are required for update.');
            }
            update account;
        } catch (DmlException ex) {
            throw new AuraHandledException('Unable to update the account. Check the input data.');
        }
    }

    @AuraEnabled
    public static void deleteData(Id accountId) {
        try {
            if (accountId == null) {
                throw new AuraHandledException('Account ID is required to delete the record.');
            }

            // Delete related cases first
            List<Case> relatedCases = [SELECT Id FROM Case WHERE AccountId = :accountId];
            if (!relatedCases.isEmpty()) {
                delete relatedCases; // Cascade delete related cases
            }

            // Now delete the account
            delete [SELECT Id FROM Account WHERE Id = :accountId WITH SECURITY_ENFORCED LIMIT 1];
        } catch (DmlException ex) {
            // Handle any DML errors gracefully
            throw new AuraHandledException('Failed to delete the account: ' + ex.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static Integer getAccountDataCount() {
        try {
            // Check object-level access before querying
            if (!Schema.sObjectType.Account.isAccessible()) {
                throw new AuraHandledException('Insufficient permissions to access Account.');
            }

            return [SELECT COUNT() FROM Account];
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching data count: ' + e.getMessage());
        }
    }
}