public with sharing class AssistanceRequestHandler {
    /**
     * Retrieves the categories for the assistance request form.
     *
     * @return A list of Assistance_Request_Type__c records for use in the form dropdown.
     */
    @AuraEnabled(cacheable=true)
    public static List<Assistance_Request_Type__c> getCategories() {
        try {
            return [SELECT Id, Name FROM Assistance_Request_Type__c];
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching categories: ' + e.getMessage());
        }
    }

    /**
     * Saves a new assistance request record in Salesforce.
     *
     * @param name     The name of the requester.
     * @param contact  The contact information of the requester.
     * @param details  The details of the request.
     * @param category The selected category for the request.
     * @return         A success message upon successful insertion.
     */
    @AuraEnabled
    public static String saveRequest(String name, String contact,  String email, String details, String category) {
        try {
            Assistance_Request__c newRequest = new Assistance_Request__c(
                Name__c = name,
                Contact__c = contact,
                Details__c = details,
                Category__c = category,
                Email__c = email
            );
            insert newRequest;
            return 'Assistance request submitted successfully!';
        } catch (Exception e) {
            throw new AuraHandledException('Error saving request: ' + e.getMessage());
        }
    }
}