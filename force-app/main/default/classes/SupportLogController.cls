public with sharing class SupportLogController {

    // Method to update the status of a support log
    @AuraEnabled
    public static void updateLogStatus(String logId, String status) {
        // Ensure the status value is valid (optional)
        if (String.isEmpty(status) || !isValidStatus(status)) {
            throw new AuraHandledException('Invalid status value');
        }

        // Retrieve the Support_Log__c record by ID
        Support_Log__c log = [SELECT Id, Status__c FROM Support_Log__c WHERE Id = :logId LIMIT 1];

        // Update the status of the log
        log.Status__c = status;

        // Perform update
        try {
            update log;
        } catch (DmlException e) {
            throw new AuraHandledException('Error updating log status: ' + e.getMessage());
        }
    }

    // Helper method to check valid status values
    private static Boolean isValidStatus(String status) {
        List<String> validStatuses = new List<String>{'Open', 'In Progress', 'Resolved'};
        return validStatuses.contains(status);
    }

    // Method to get all open logs for a given user (for example)
    @AuraEnabled(cacheable=true)
    public static List<Support_Log__c> getOpenLogs() {
        return [SELECT Id, Status__c,subject__c, Description__c FROM Support_Log__c WHERE Status__c = 'Open' OR Status__c = 'In Progress'];
    }
}