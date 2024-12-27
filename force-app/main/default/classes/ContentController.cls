public with sharing class ContentController {
    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getContentForRole(String userRole, Integer pageNumber, Integer pageSize) {
        Map<String, Object> resultMap = new Map<String, Object>();

        Integer offset = (pageNumber - 1) * pageSize;
        List<Task> records;
        Integer totalRecords;

        // Adjust for CEO role
        if (userRole == 'Student') {
            records = [
                SELECT Id, Subject, Status 
                FROM Task 
                WHERE OwnerId = :UserInfo.getUserId() AND Subject LIKE '%Student%'
                LIMIT :pageSize OFFSET :offset
            ];
            totalRecords = [SELECT COUNT() FROM Task WHERE OwnerId = :UserInfo.getUserId() AND Subject LIKE '%Student%'];
        } else if (userRole == 'Instructor') {
            records = [
                SELECT Id, Subject, Status 
                FROM Task 
                WHERE Priority = 'High' AND Subject LIKE '%Instructor%'
                LIMIT :pageSize OFFSET :offset
            ];
            totalRecords = [SELECT COUNT() FROM Task WHERE Priority = 'High' AND Subject LIKE '%Instructor%'];
        } else {
            records = new List<Task>();
            totalRecords = 0;
        }

        resultMap.put('records', records);
        resultMap.put('totalRecords', totalRecords);
        return resultMap;
    }
}