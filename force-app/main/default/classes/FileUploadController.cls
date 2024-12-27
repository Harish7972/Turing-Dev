public with sharing class FileUploadController {
    @AuraEnabled
    public static void uploadFileToRecord(Id recordId, String fileBase64, String fileName, Boolean attachToRecord) {
        try {
            // Decode the Base64 string into a Blob
            Blob fileBlob = EncodingUtil.base64Decode(fileBase64);

            // Create ContentVersion object for file storage
            ContentVersion contentVersion = new ContentVersion();
            contentVersion.Title = fileName;
            contentVersion.PathOnClient = fileName;
            contentVersion.VersionData = fileBlob;
            contentVersion.IsMajorVersion = true;
            insert contentVersion;

            // Retrieve the ContentVersion again to ensure ContentDocumentId is populated
            ContentVersion insertedVersion = [
                SELECT Id, ContentDocumentId
                FROM ContentVersion
                WHERE Id = :contentVersion.Id
                LIMIT 1
            ];

            // Ensure ContentDocumentId is not null
            if (insertedVersion.ContentDocumentId == null) {
                throw new AuraHandledException('Error: ContentDocumentId is still null after ContentVersion insert.');
            }

            // If the checkbox is checked, associate the file with the record
            if (attachToRecord) {
                // Create the ContentDocumentLink to attach the file to the record
                ContentDocumentLink docLink = new ContentDocumentLink();
                docLink.ContentDocumentId = insertedVersion.ContentDocumentId;
                docLink.LinkedEntityId = recordId; // Attach to the record
                docLink.ShareType = 'V'; // Viewer access
                docLink.Visibility = 'AllUsers'; // Optional
                insert docLink;

                System.debug('ContentDocumentLink inserted successfully.');
            }
        } catch (DmlException e) {
            // Log DML-specific errors
            System.debug('DML Exception: ' + e.getMessage());
            throw new AuraHandledException('DML Error: ' + e.getMessage());
        } catch (AuraHandledException e) {
            // Log handled exceptions
            System.debug('AuraHandledException: ' + e.getMessage());
            throw e; // Re-throw the handled exception
        } catch (Exception e) {
            // Log any unexpected errors
            System.debug('Unexpected Exception: ' + e.getMessage());
            throw new AuraHandledException('Error uploading file: ' + e.getMessage());
        }
    }
}