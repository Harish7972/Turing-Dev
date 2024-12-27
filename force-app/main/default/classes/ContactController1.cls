public with sharing class ContactController1 {
    /**
     * Method to retrieve filtered and sorted contacts along with the total record count.
     * @param status The status filter for contacts (optional).
     * @param startDate The start date for created date filter (optional).
     * @param endDate The end date for created date filter (optional).
     * @param accountId The account ID filter for contacts (optional).
     * @param sortField The field by which contacts should be sorted (optional).
     * @param sortDirection The direction of the sort (optional).
     * @return Map<String, Object> - A map containing the filtered contacts list and the total count.
     */
    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getFilteredAndSortedContacts(
        String status,
        Date startDate,
        Date endDate,
        String accountId,
        String sortField,
        String sortDirection
    ) {
        Map<String, Object> result = new Map<String, Object>();
        
        try {
            // Build the base query
            String query = 'SELECT Id, FirstName, LastName, Email, CreatedDate, AccountId FROM Contact';
            
            // Add filtering conditions
           /* if (status != null) {
                query += ' AND Status__c = \'' + String.escapeSingleQuotes(status) + '\'';
            }
            if (startDate != null && endDate != null) {
                query += ' AND CreatedDate >= :startDate AND CreatedDate <= :endDate';
            }
            if (accountId != null) {
                query += ' AND AccountId = \'' + String.escapeSingleQuotes(accountId) + '\'';
            }

            // Add sorting conditions
            if (sortField != null && sortDirection != null) {
                query += ' ORDER BY ' + String.escapeSingleQuotes(sortField) + ' ' + sortDirection;
            }*/
            
            // Execute the query and retrieve records
            List<Contact> contacts = Database.query(query);
            
            // Prepare the result map
            result.put('contacts', contacts);
            result.put('totalCount', contacts.size());
            
        } catch (Exception e) {
            System.debug('Error retrieving filtered and sorted contacts: ' + e.getMessage());
            result.put('contacts', new List<Contact>());
            result.put('totalCount', 0);
        }
        
        return result;
    }
}