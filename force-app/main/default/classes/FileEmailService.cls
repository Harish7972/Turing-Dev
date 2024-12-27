/*public class FileEmailService {

    public static void sendFileByEmail(Id contentDocId, String recipientEmail) {
        // Retrieve file version data
        ContentVersion cv = [SELECT VersionData, Title FROM ContentVersion WHERE ContentDocumentId = :contentDocId LIMIT 1];

        // Create email attachment
        Messaging.EmailFileAttachment attachment = new Messaging.EmailFileAttachment();
        attachment.setFileName(cv.Title + '.pdf');
        attachment.setBody(cv.VersionData);
        attachment.setContentType('application/pdf');

        // Create email
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        email.setToAddresses(new String[] { recipientEmail });
        email.setSubject('Document: ' + cv.Title);
        email.setPlainTextBody('Please find the attached document.');
        email.setFileAttachments(new Messaging.EmailFileAttachment[] { attachment });

        // Send email
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { email });

        // Log the email sent
        Email_File__c emailLog = new Email_File__c(
            File__c = contentDocId,
            Email_Recipient__c = recipientEmail,
            Sent_Date__c = System.now()
        );
        insert emailLog;
    }
}*/

public class FileEmailService {

    public static void sendFileByEmail(Id contentDocId, String recipientEmail) {
        // Verify the ContentDocumentId (you can add logging for debugging)
        System.debug('ContentDocumentId: ' + contentDocId);
        
        // Retrieve file version data
        ContentVersion cv = [SELECT VersionData, Title FROM ContentVersion WHERE ContentDocumentId = :contentDocId LIMIT 1];

        // Create email attachment
        Messaging.EmailFileAttachment attachment = new Messaging.EmailFileAttachment();
        attachment.setFileName(cv.Title + '.pdf');
        attachment.setBody(cv.VersionData);
        attachment.setContentType('application/pdf');

        // Create email
        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        email.setToAddresses(new String[] { recipientEmail });
        email.setSubject('Document: ' + cv.Title);
        email.setPlainTextBody('Please find the attached document.');
        email.setFileAttachments(new Messaging.EmailFileAttachment[] { attachment });

        // Send email
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { email });

        // Log the email sent
        Email_File__c emailLog = new Email_File__c(
            File__c = contentDocId,  // Ensure this is the correct ContentDocumentId
            Email_Recipient__c = recipientEmail,
            Sent_Date__c = System.now()
        );

        // Add try-catch for better error handling
        try {
            insert emailLog;
        } catch (DmlException e) {
            System.debug('Error inserting Email_File__c: ' + e.getMessage());
        }
    }
}