public with sharing class ImageGalleryPaginationController {
    @AuraEnabled(cacheable=true)
    public static List<FileWrapper> getFiles(Integer pageSize, Integer pageNumber) {
        List<FileWrapper> files = new List<FileWrapper>();

         // Calculate the offset
         Integer offsetValue = (pageNumber - 1) * pageSize;

        // Query ContentVersion to fetch image files (e.g., JPG, PNG)
        for (ContentVersion cv : [
            SELECT Id, Title, Description, ContentDocumentId, FileType, 
                   ContentSize, CreatedDate 
            FROM ContentVersion 
            WHERE FileType IN ('JPG', 'PNG') 
            ORDER BY CreatedDate DESC
            LIMIT :pageSize OFFSET :offsetValue
        ]) {
            // Generate a URL to the file using the ContentVersionId
            String fileUrl = '/sfc/servlet.shepherd/version/download/' + cv.Id;

            // Extract image dimensions (if it's an image file)
            String dimensions = 'Unknown';
            if (cv.FileType == 'JPG' || cv.FileType == 'PNG') {
                dimensions = 'Dimensions: (800x600)';  // Placeholder for actual dimensions logic
            }

            // Add the file details to the wrapper
            files.add(new FileWrapper(cv.Id, cv.Title, cv.Description, fileUrl, cv.ContentSize, cv.CreatedDate, dimensions));
        }

        return files;
    }


    @AuraEnabled(cacheable=true)
    public static Integer getImageCount() {
        try {
            // Check object-level access before querying
            if (!Schema.sObjectType.FinancialData__c.isAccessible()) {
                throw new AuraHandledException('Insufficient permissions to access Images.');
            }

            return [SELECT COUNT() FROM  ContentVersion 
            WHERE FileType IN ('JPG', 'PNG') ];
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching data count: ' + e.getMessage());
        }
    }

    // Wrapper class to send file data to the LWC
    public class FileWrapper {
        @AuraEnabled public String id;
        @AuraEnabled public String title;
        @AuraEnabled public String description;
        @AuraEnabled public String url;
        @AuraEnabled public Long contentSize;
        @AuraEnabled public DateTime createdDate;
        @AuraEnabled public String dimensions;

        public FileWrapper(String id, String title, String description, String url, Long contentSize, DateTime createdDate, String dimensions) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.url = url;
            this.contentSize = contentSize;
            this.createdDate = createdDate;
            this.dimensions = dimensions;
        }
    }
}
