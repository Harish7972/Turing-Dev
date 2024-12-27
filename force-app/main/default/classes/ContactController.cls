public with sharing class ContactController {

    @AuraEnabled(cacheable=true)
    public static List<Contact> getAllContacts (String statusFilter, String sortBy, String sortOrder, Integer pageSize, Integer offset) {
        String query = 'SELECT Id, Name, Status, CreatedDate, AccountId FROM Contact';
        
        if (String.isNotBlank(statusFilter)) {
            query += ' WHERE Status = :statusFilter';
        }

        if (String.isNotBlank(sortBy)) {
            query += ' ORDER BY ' + sortBy + ' ' + sortOrder;
        }

        query += ' LIMIT :pageSize OFFSET :offset';

        try {
            List<Contact> contacts = Database.query(query);
            return contacts;
        } catch (Exception e) {
            throw new AuraHandledException('Error retrieving contacts: ' + e.getMessage());
        }
    }
}