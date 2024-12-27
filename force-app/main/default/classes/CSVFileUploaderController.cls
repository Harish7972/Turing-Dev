public with sharing class CSVFileUploaderController {

    @AuraEnabled
    public static void processCSV(String csvContent) {
        // Process CSV data and insert records into Salesforce
        List<Account> accounts = new List<Account>();

        // Example: Parsing a simple CSV with Name, Phone
        String[] lines = csvContent.split('\n');
        for (Integer i = 1; i < lines.size(); i++) {
            String[] row = lines[i].split(',');
            if (row.size() >= 2) {
                Account acc = new Account();
                acc.Name = row[0].trim();
                acc.Phone = row[1].trim();
                accounts.add(acc);
            }
        }
        
        // Insert the records
        insert accounts;
    }
}