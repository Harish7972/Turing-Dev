// SubscriptionController Apex Class with Alert Logic
/*public with sharing class SubscriptionController {
    @AuraEnabled(cacheable=true)
    public static Subscription__c getSubscriptionData() {
        Integer apiLimitThreshold = 0; // Example threshold
        Integer currentApiUsage = Limits.getQueries();

        // Check if current API usage has reached the threshold
        if (currentApiUsage > apiLimitThreshold) {
            System.debug('Warning: API usage is nearing the daily limit.');
        }

        return [SELECT Name, Plan__c, Status__c FROM Subscription__c LIMIT 1];
    }
}
*/

/*public with sharing class ApiLimitController {
    @AuraEnabled
    public static void exceedApiLimit() {
        Integer limitThreshold = 100; // Salesforce's default limit for SOQL queries in one transaction
        
        // Check the current number of SOQL queries being executed
        System.debug('Current API Usage (SOQL Queries): ' + Limits.getQueries());

        // Loop and perform 101 queries to exceed the limit
        for (Integer i = 0; i <= limitThreshold; i++) {
            // Performing unnecessary queries to exceed the limit
            List<Account> accounts = [SELECT Id, Name FROM Account LIMIT 1];
            System.debug('Query #' + (i + 1) + ' executed');
        }
        
        // Check if the limit has been exceeded
        if (Limits.getQueries() > limitThreshold) {
            System.debug('API Limit Exceeded: More than ' + limitThreshold + ' SOQL queries used.');
            //throw new CustomException('API Limit Exceeded: More than ' + limitThreshold + ' SOQL queries used.');
        }
    }
}*/


public with sharing class ApiUsageMonitor {

    @AuraEnabled
    public static void checkApiUsage() {
        // Define the REST API Endpoint to fetch limits
        String endpoint = '/services/data/v56.0/limits';

        HttpRequest req = new HttpRequest();
        req.setEndpoint(URL.getOrgDomainUrl().toExternalForm() + endpoint);
        req.setMethod('GET');
        req.setHeader('Authorization', 'Bearer ' + UserInfo.getSessionId());

        Http http = new Http();
        HttpResponse res = http.send(req);

        if (res.getStatusCode() == 200) {
            // Parse the JSON response
            Map<String, Object> result = (Map<String, Object>) JSON.deserializeUntyped(res.getBody());
            Map<String, Object> dailyApiLimits = (Map<String, Object>) result.get('DailyApiRequests');

            Integer maxLimit = (Integer) dailyApiLimits.get('Max');
            Integer remaining = (Integer) dailyApiLimits.get('Remaining');
            Integer used = maxLimit - remaining;

            System.debug('API Usage: ' + used + '/' + maxLimit + ' (Remaining: ' + remaining + ')');
            
            // Optional: Trigger an alert if close to the limit
           Integer threshold = (maxLimit * 90) / 100;  // Set threshold at 90%

            if (used >= threshold) {
                sendApiLimitAlert(used, maxLimit, remaining);
            }
        } else {
            System.debug('Failed to retrieve limits: ' + res.getStatus());
        }
    }

    private static void sendApiLimitAlert(Integer used, Integer maxLimit, Integer remaining) {
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        email.setToAddresses(new List<String>{'admin@example.com'});  // Update with actual email
        email.setSubject('API Usage Alert');
        email.setPlainTextBody('Your API usage has reached ' + used + ' out of ' + maxLimit +
                               '. Only ' + remaining + ' API calls are remaining.');

        Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{email});
    }
}