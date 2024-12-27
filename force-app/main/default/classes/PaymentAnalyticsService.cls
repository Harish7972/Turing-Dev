public class PaymentAnalyticsService {

    public static void generateReport(Date reportDate) {
        String reportId = 'Rpt-' + DateTime.now().getTime().toString().substring(0, Math.min(14, DateTime.now().getTime().toString().length())); // Dynamically adjusting substring length
        Payment_Analytics_Report__c report = new Payment_Analytics_Report__c(
            Report_ID__c = reportId,
            Transaction_Volume__c = calculateTransactionVolume(reportDate),
            Payment_Method_Usage__c = 'Credit Card', // Example method
            Report_Date__c = reportDate
        );
        insert report;
    }

    private static Decimal calculateTransactionVolume(Date reportDate) {
    		List<AggregateResult> results = [SELECT SUM(Payment_Amount__c) sumAmount FROM Payment_Transaction__c WHERE CreatedDate = :reportDate];
    		if (results.isEmpty() || results[0].get('sumAmount') == null) {
        		return 0;
    		}
    	return (Decimal) results[0].get('sumAmount');
	}
}