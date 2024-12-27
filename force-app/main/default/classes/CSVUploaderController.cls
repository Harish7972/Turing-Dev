public with sharing class CSVUploaderController {
    @AuraEnabled
    public static String uploadCSV(Id contentDocumentId) {
        try {
            // Get the ContentVersion from ContentDocument
            ContentVersion cv = [
                SELECT VersionData
                FROM ContentVersion
                WHERE ContentDocumentId = :contentDocumentId
                AND IsLatest = true
                LIMIT 1
            ];

            // Convert the file content to string
            String csvContent = cv.VersionData.toString();
            List<Map<String, String>> records = new List<Map<String, String>>();
            
            // Split content into lines
            List<String> lines = csvContent.split('\n');
            if (lines.isEmpty()) {
                throw new AuraHandledException('No data found in file');
            }

            // Process headers
            List<String> headers = lines[0].split(',');
            for (Integer i = 0; i < headers.size(); i++) {
                headers[i] = headers[i].trim();
            }

            // Process data rows
            for (Integer i = 1; i < lines.size(); i++) {
                String line = lines[i].trim();
                if (String.isBlank(line)) continue;

                List<String> values = line.split(',');
                Map<String, String> record = new Map<String, String>();
                record.put('id', String.valueOf(i));

                for (Integer j = 0; j < headers.size() && j < values.size(); j++) {
                    record.put(headers[j], values[j].trim());
                }

                records.add(record);
            }

            // Clean up the ContentDocument if needed
            delete new ContentDocument(Id = contentDocumentId);

            return JSON.serialize(records);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}