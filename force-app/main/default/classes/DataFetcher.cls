public with sharing class DataFetcher {
    @AuraEnabled(cacheable=true)
    public static Map<String, Object> fetchPaginatedData(Integer offset, Integer limit1) {
        Map<String, Object> resultMap = new Map<String, Object>();
        
        List<Account> records = [
            SELECT Id, Name
            FROM Account
            ORDER BY CreatedDate
            LIMIT :limit1
            OFFSET :offset
        ];
        
        Integer totalRecords = [SELECT Count() FROM Account];

         // Ensure that the records list is never null, and an empty list is returned instead.
         if (records == null) {
            records = new List<Account>();
        }

        resultMap.put('records', records);
        resultMap.put('totalRecords', totalRecords);
        
        return resultMap;
    }
}