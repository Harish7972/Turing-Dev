public with sharing class ImageGalleryDataController {
    /**
     * Retrieves image files from ContentVersion in Salesforce.
     * Filters by file type (JPG, PNG) and returns image metadata.
     */
    @AuraEnabled(cacheable=true)
    public static List<FileWrapper> getFiles() {
        List<FileWrapper> files = new List<FileWrapper>();

        // Query ContentVersion to fetch image files (e.g., JPG, PNG)
        for (ContentVersion cv : [
            SELECT Id, Title, Description, ContentDocumentId, FileType, 
                   ContentSize, CreatedDate 
            FROM ContentVersion 
            WHERE FileType IN ('JPG', 'PNG') 
            ORDER BY CreatedDate DESC
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