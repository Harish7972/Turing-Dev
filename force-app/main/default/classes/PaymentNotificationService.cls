public class PaymentNotificationService {

    // Method to create a notification for a payment transaction
    public static void createNotification(String transactionId, String notificationType, String message) {
        Payment_Notification__c notification = new Payment_Notification__c(
            Transaction_ID__c = Integer.valueOf(transactionId),
            Notification_Type__c = notificationType,
            Message__c = message,
            Sent_Date__c = System.now()
        );
        insert notification;
    }

    // Example method to send success notification
    public static void sendSuccessNotification(String transactionId) {
        String message = 'Your payment was successful. Transaction ID: ' + transactionId;
        createNotification(transactionId, 'Success', message);
    }

    // Example method to send failure notification
    public static void sendFailureNotification(String transactionId) {
        String message = 'Your payment failed. Please contact support. Transaction ID: ' + transactionId;
        createNotification(transactionId, 'Failure', message);
    }
}