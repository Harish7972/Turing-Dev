global class PaymentStatusScheduler implements Schedulable {

    global void execute(SchedulableContext sc) {
        List<Payment_Transaction__c> failedTransactions = [SELECT Id, Status__c,Transaction_ID__c,Payment_Amount__c
                                                           FROM Payment_Transaction__c WHERE Status__c = 'Failed'];
        if (!failedTransactions.isEmpty()) {
            notifyTeam(failedTransactions);
        }
    }

    private void notifyTeam(List<Payment_Transaction__c> transactions) {
        // Implementation of notification logic, e.g., sending emails
        // Prepare the email content with transaction details

        String emailBody = 'The following payment transactions have failed:\n\n';

        for (Payment_Transaction__c tran : transactions) {
            emailBody += 'Transaction ID: ' + tran.Transaction_ID__c + ', Amount: ' + tran.Payment_Amount__c + '\n';
        }

        emailBody += '\nPlease review and take necessary actions.';

        // Set up the email
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        email.setToAddresses(new List<String>{'harish.j@turing.com'}); // Replace with the actual support email
        email.setSubject('Failed Payment Transactions Notification');
        email.setPlainTextBody(emailBody);

        // Send the email
        Messaging.sendEmail(new List<Messaging.SingleEmailMessage>{email});

    }
}