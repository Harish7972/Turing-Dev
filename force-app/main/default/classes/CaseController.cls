public with sharing class CaseController {
    @AuraEnabled(cacheable=true)
    public static List<Case> getCases() {
        return [SELECT Id, CaseNumber, Status FROM Case LIMIT 5];
    }

    @AuraEnabled
    public static void updateCaseStatus(Id caseId, String newStatus) {
        Case c = [SELECT Id, Status FROM Case WHERE Id = :caseId LIMIT 1];
        c.Status = newStatus;
        update c;
    }

    @AuraEnabled
    public static void escalateCase(Id caseId) {
        Case c = [SELECT Id, Status FROM Case WHERE Id = :caseId LIMIT 1];
        // c.Status = newStatus;
        update c;
    }

    @AuraEnabled
    public static Case getCaseDetails(Id caseId) {
        Case c = [SELECT Id, Status, subject, description FROM Case WHERE Id = :caseId LIMIT 1];
        // c.Status = newStatus;
        return c;
    }

    @AuraEnabled(cacheable=true)
    public static List<Case> getLatestCases() {
        return [SELECT Id, CaseNumber, Subject, Status FROM Case ORDER BY CreatedDate DESC LIMIT 10];
    }
}