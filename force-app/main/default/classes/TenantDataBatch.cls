/*global class TenantDataBatch implements Database.Batchable<SObject> {
    private String objectName;
    private Id tenantId;
    private List<String> fields;

    global TenantDataBatch(String objectName, Id tenantId, List<String> fields) {
        this.objectName = objectName;
        this.tenantId = tenantId;
        this.fields = fields;
    }

    global Database.QueryLocator start(Database.BatchableContext BC) {
        String soql = 'SELECT ' + String.join(fields, ',') +
                      ' FROM ' + objectName +
                      ' WHERE Tenant_ID__c = :tenantId';
        return Database.getQueryLocator(soql);
    }

    global void execute(Database.BatchableContext BC, List<SObject> scope) {
        // Process each batch of records
        // e.g., further processing, transformation, etc.
    }

    global void finish(Database.BatchableContext BC) {
        // Any final processing or notifications
    }
}*/

global class TenantDataBatch implements Database.Batchable<SObject> {
    private String objectName;
    private Id tenantId;
    private List<String> fields;

    global TenantDataBatch(String objectName, Id tenantId, List<String> fields) {
        this.objectName = objectName;
        this.tenantId = tenantId;
        this.fields = fields;
    }

    global Database.QueryLocator start(Database.BatchableContext BC) {
        // Construct SOQL with tenant isolation using getQueryLocator
        String soqlQuery = 'SELECT ' + String.join(fields, ',') +
                           ' FROM ' + objectName +
                           ' WHERE Tenant_ID__c = :tenantId';
        return Database.getQueryLocator(soqlQuery);
    }

    global void execute(Database.BatchableContext BC, List<SObject> scope) {
        // Process batch data
    }

    global void finish(Database.BatchableContext BC) {
        // Final processing or notifications
    }
}