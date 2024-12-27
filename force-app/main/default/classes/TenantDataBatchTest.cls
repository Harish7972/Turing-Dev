@isTest
public class TenantDataBatchTest {
    @isTest static void testTenantDataIsolation() {
        // Setup tenants and data
        Tenant__c tenantA = new Tenant__c(Tenant_ID__c = 'TA001');
        Tenant__c tenantB = new Tenant__c(Tenant_ID__c = 'TB001');
        insert new List<Tenant__c>{tenantA, tenantB};

        // Tenant-specific records
        CustomObject__c objA = new CustomObject__c(Tenant_ID__c = tenantA.Id, Data_Field_1__c = 'Data A');
        CustomObject__c objB = new CustomObject__c(Tenant_ID__c = tenantB.Id, Data_Field_1__c = 'Data B');
        insert new List<CustomObject__c>{objA, objB};

        // Run batch for tenantA
        TenantDataBatch batchJob = new TenantDataBatch('CustomObject__c', tenantA.Id, new List<String>{'Data_Field_1__c'});
        Test.startTest();
        Database.executeBatch(batchJob);
        Test.stopTest();

        // Verify tenantA's records
        List<CustomObject__c> results = [SELECT Data_Field_1__c FROM CustomObject__c WHERE Tenant_ID__c = :tenantA.Id];
        System.assertEquals(1, results.size());
        System.assertEquals('Data A', results[0].Data_Field_1__c);
    }
}