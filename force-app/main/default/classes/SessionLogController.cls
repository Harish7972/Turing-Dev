public with sharing class SessionLogController {

    @AuraEnabled
    public static void storeSessionLog(String sessionName, DateTime startTime, DateTime endTime) {
        Session_Log__c log = new Session_Log__c();
        //log.Session_Name__c = sessionName;
        log.Start_Time__c = startTime;
        log.End_Time__c = endTime;
        // Calculate total time in minutes
        //log.Total_Time__c = (endTime.getTime() - startTime.getTime()) / 60000; // Total Time in minutes
        insert log;
    }

    @AuraEnabled
    public static List<Session_Log__c> getRecentSessionLogs() {
        // Fetch the 5 most recent session logs
        return [SELECT Session_Name__c, Start_Time__c, End_Time__c, Total_Time__c
                FROM Session_Log__c
                ORDER BY Start_Time__c DESC
                LIMIT 5];
    }
}