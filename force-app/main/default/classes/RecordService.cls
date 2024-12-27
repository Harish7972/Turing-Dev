public with sharing class RecordService {
    @AuraEnabled(cacheable=true)
    public static Id fetchLatestRecordId() {
        // Fetch the latest record based on CreatedDate
        Contact latestRecord = [
            SELECT Id
            FROM Contact
            ORDER BY CreatedDate DESC
            LIMIT 1
        ];
        return latestRecord != null ? latestRecord.Id : null;
    }

    @AuraEnabled(cacheable=true)
    public static Contact getRecord(Id recordId) {
        return [SELECT Id, Name FROM Contact WHERE Id = :recordId LIMIT 1];
    }
}