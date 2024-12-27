public class MetricsController {
    @AuraEnabled(cacheable=true)
    public static List<Metric__c> getCurrentMetrics() {
        // Use pagination or limit the data to optimize performance
        return [SELECT Id, Metric_Name__c, Value__c FROM Metric__c LIMIT 100];
    }
}