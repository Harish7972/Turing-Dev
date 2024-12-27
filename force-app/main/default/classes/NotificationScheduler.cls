public class NotificationScheduler implements Schedulable {

    public void execute(SchedulableContext sc) {
        // Fetch unsent notifications and process them
        List<Payment_Notification__c> unsentNotifications = [SELECT Id, Transaction_ID__c, Message__c 
                                                              FROM Payment_Notification__c 
                                                              WHERE Sent_Date__c = NULL];

        for (Payment_Notification__c notification : unsentNotifications) {
            // Here, send notifications via email/SMS etc.
            System.debug('Sending notification: ' + notification.Message__c);

            // Update the Sent_Date__c field to mark it as sent
            notification.Sent_Date__c = System.now();
        }
        update unsentNotifications;
    }
}