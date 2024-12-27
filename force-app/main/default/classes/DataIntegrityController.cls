public with sharing class DataIntegrityController {

    @AuraEnabled(cacheable=true)
    public static List<FinancialData__c> getPaginatedFinancialData(Integer pageSize, Integer pageNumber) {
        try {

            if (!Schema.sObjectType.FinancialData__c.isAccessible()) {
                throw new AuraHandledException('Insufficient permissions to access FinancialData__c.');
            }
            // Calculate the offset
            Integer offsetValue = (pageNumber - 1) * pageSize;

            // Query the data
            List<FinancialData__c> records = [
                SELECT Id, Name, Amount__c, Date__c
                FROM FinancialData__c
                ORDER BY Date__c DESC
                LIMIT :pageSize OFFSET :offsetValue
            ];

            // Enforce field-level and object-level security
            records = (List<FinancialData__c>) Security.stripInaccessible(
                AccessType.READABLE,
                records
            ).getRecords();

            return records;
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching data: ' + e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static Integer getFinancialDataCount() {
        try {
            // Check object-level access before querying
            if (!Schema.sObjectType.FinancialData__c.isAccessible()) {
                throw new AuraHandledException('Insufficient permissions to access FinancialData__c.');
            }

            return [SELECT COUNT() FROM FinancialData__c];
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching data count: ' + e.getMessage());
        }
    }
}