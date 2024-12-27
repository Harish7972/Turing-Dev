// Apex Method to Check Donor Status and Authenticate
public with sharing class DonorAuthHandler {
    public static Boolean authenticateDonor(Id donorId) {
        Donor__c donor = [SELECT Id, Status__c FROM Donor__c WHERE Id = :donorId];
        if (donor.Status__c == 'Active') {
            // Proceed with authentication and notification setup
            System.debug('Donor is active. Proceeding with login.');
            return true;
        } else {
            System.debug('Donor is inactive. Access restricted.');
            return false;
        }
    }
}