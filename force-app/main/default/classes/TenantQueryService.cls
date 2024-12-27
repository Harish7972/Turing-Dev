public class TenantQueryService {
    public static List<SObject> queryWithTenantFilter(String objectName, Id tenantId, List<String> fields) {
        // Validate fields to prevent SOQL injection or unauthorized access
        List<String> validFields = validateFields(objectName, fields);

        // Construct dynamic SOQL with tenant isolation
        String soql = 'SELECT ' + String.join(validFields, ',') +
                      ' FROM ' + objectName +
                      ' WHERE Tenant_ID__c = :tenantId';

        // Execute the query and return results
        return Database.query(soql);
    }

    private static List<String> validateFields(String objectName, List<String> fields) {
        // Logic to validate each field against object schema
        List<String> validatedFields = new List<String>();
        Map<String, Schema.SObjectField> fieldMap = Schema.getGlobalDescribe().get(objectName).getDescribe().fields.getMap();

        for (String field : fields) {
            if (fieldMap.containsKey(field)) {
                validatedFields.add(field);
            }
        }
        return validatedFields;
    }
}