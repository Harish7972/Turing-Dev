global class OrderStatusBatch implements Database.Batchable<SObject> {
    global Database.QueryLocator start(Database.BatchableContext bc) {
        String query = 'SELECT Order_Status__c FROM Supply_Chain_Data__c';
        return Database.getQueryLocator(query);
    }
    
    global void execute(Database.BatchableContext bc, List<Supply_Chain_Data__c> scope) {
        Map<String, Integer> statusCounts = new Map<String, Integer>();
        for (Supply_Chain_Data__c record : scope) {
            String status = record.Order_Status__c;
            statusCounts.put(status, statusCounts.get(status) != null ? statusCounts.get(status) + 1 : 1);
        }
        
        // Here, store or process statusCounts as needed (e.g., save to a custom object or log)
    }
    
    global void finish(Database.BatchableContext bc) {
        // Optional: implement any finalization logic here
    }
}