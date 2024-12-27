public class TenantDataService {
    public static List<SObject> getTenantData(String objectName, Id tenantId, List<String> fields) {
        // Build the dynamic SOQL query with tenant filtering
        String soqlQuery = 'SELECT ' + String.join(fields, ',') +
                           ' FROM ' + objectName +
                           ' WHERE Tenant_ID__c = :tenantId';

        // Execute the dynamic query
        List<SObject> results = Database.query(soqlQuery);
        return results;
    }
}