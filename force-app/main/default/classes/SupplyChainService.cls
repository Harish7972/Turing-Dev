public class SupplyChainService {

    // Method to count orders by status using dynamic SOQL
    public static Map<String, Integer> countOrdersByStatus() {
        String query = 'SELECT Order_Status__c, COUNT(Id) totalCount  FROM Supply_Chain_Data__c GROUP BY Order_Status__c';
        List<AggregateResult> results = Database.query(query);

        // Process the results to create a map of order counts by status
        Map<String, Integer> orderStatusCounts = new Map<String, Integer>();
        for (AggregateResult ar : results) {
            orderStatusCounts.put((String)ar.get('Order_Status__c'), (Integer)ar.get('totalCount'));
        }

        return orderStatusCounts;
    }
}