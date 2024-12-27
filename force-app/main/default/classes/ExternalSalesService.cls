public class ExternalSalesService {
    public static void fetchAndSyncSalesData() {
        try {
            HttpRequest req = new HttpRequest();
            req.setEndpoint('callout:MyExternalSalesAPI/salesdata');
            req.setMethod('GET');

            Http http = new Http();
            HttpResponse res = http.send(req);

            if (res.getStatusCode() == 200) {
                List<Map<String, Object>> salesData = (List<Map<String, Object>>) JSON.deserializeUntyped(res.getBody());
                for (Map<String, Object> data : salesData) {
                    // Process and insert data
                }
            } else {
                sendErrorNotification('API call failed with status code: ' + res.getStatusCode());
            }
        } catch (Exception e) {
            sendErrorNotification('Exception during API call: ' + e.getMessage());
        }
    }

    private static void sendErrorNotification(String message) {
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setToAddresses(new String[] {'admin@example.com'});
        mail.setSubject('External Sales Data Sync Failed');
        mail.setPlainTextBody(message);
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
    }
}