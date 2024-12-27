public with sharing class ImageUploaderController {
    @AuraEnabled
    public static void uploadFileToRecord(Id recordId, String fileName, String fileType, String fileContents) {
        try {
            if (!Schema.sObjectType.ContentVersion.isAccessible()) {
                throw new AuraHandledException('Insufficient permissions to access Files.');
                }
            // Debug input parameters
            System.debug('Record ID: ' + recordId);
            System.debug('File Name: ' + fileName);
            System.debug('File Type: ' + fileType);

            // Decode the file contents from Base64
            Blob fileBlob = EncodingUtil.base64Decode(fileContents);

            // Debug file blob size
            System.debug('File Blob Size: ' + fileBlob.size());

            // Create a ContentVersion record
            ContentVersion cv = new ContentVersion();
            cv.Title = fileName;
            cv.PathOnClient = fileName;
            cv.VersionData = fileBlob;
            cv.FirstPublishLocationId = recordId;
            // cv.FileType = fileType;

            insert cv;

            // Debug success
            System.debug('ContentVersion created with Id: ' + cv.Id);
        } catch (Exception e) {
            System.debug('Error: ' + e.getMessage());
            throw new AuraHandledException('Error uploading the image: ' + e.getMessage());
        }
    }
}
