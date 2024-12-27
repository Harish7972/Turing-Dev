public with sharing class ContactRecordHandler {
    /**
     * Saves or updates a contact record based on email.
     * Creates a new contact if no matching record exists.
     *
     * @param firstName The first name of the contact.
     * @param lastName The last name of the contact.
     * @param email The email of the contact.
     * @param phone The phone number of the contact.
     */
    @AuraEnabled
    public static void saveContact(String firstName, String lastName, String email, String phone) {
        try {
            // Query for existing contact based on email
            List<Contact> existingContacts = [SELECT Id FROM Contact WHERE Email = :email LIMIT 1];
            
            Contact con;
            if (!existingContacts.isEmpty()) {
                // If a duplicate is found, update the existing record
                con = existingContacts[0];
            } else {
                // If no duplicate is found, create a new record
                con = new Contact();
            }
            
            con.FirstName = firstName;
            con.LastName = lastName;
            con.Email = email;
            con.Phone = phone;

            upsert con; // Perform the upsert (create or update)
        } catch (Exception e) {
            throw new AuraHandledException('Error saving contact: ' + e.getMessage());
        }
    }
}