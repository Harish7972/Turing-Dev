public with sharing class ChartDataController {
    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getPaginatedData(Integer pageNumber, Integer pageSize) {
        Integer offsetValue = (pageNumber - 1) * pageSize;
        List<Data__c> records = [SELECT Id, Name, Value__c FROM Data__c LIMIT :pageSize OFFSET :offsetValue];
        Integer totalRecords = [SELECT COUNT() FROM Data__c];
        
        Map<String, Object> result = new Map<String, Object>();
        result.put('records', records);
        result.put('totalRecords', totalRecords);
        return result;
    }
}