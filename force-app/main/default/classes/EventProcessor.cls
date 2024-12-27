public class EventProcessor {
    public static void processEvents(List<Event_Log__c> newEvents) {
        for (Event_Log__c event : newEvents) {
            // Example: Notify the Account owner based on the event type
            if (event.Event_Type__c == 'Call') {
                notifyAccountOwner(event);
            }
            // Additional processing based on event types
        }
    }
    
    private static void notifyAccountOwner(Event_Log__c event) {
        // Fetch the account related to the event
        Account acc = [SELECT Id, OwnerId,Owner.Email FROM Account WHERE Id = :event.Related_Account__c LIMIT 1];
        // Notify the account owner of the interaction (can be an email or task)
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        email.setToAddresses(new String[]{acc.Owner.Email});
        email.setSubject('New Event Logged: ' + event.Event_Type__c);
        email.setPlainTextBody('An event of type ' + event.Event_Type__c + ' has been recorded.');
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] {email});
    }
}