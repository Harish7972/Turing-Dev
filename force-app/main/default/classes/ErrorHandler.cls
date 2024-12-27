public with sharing class ErrorHandler {
    
    @AuraEnabled(cacheable=true)
    public static String getErrorMessage(String userRole) {
        if (userRole == 'Admin') {
            return 'Admin Error: Unable to access sensitive financial data at this time.';
        } else if (userRole == 'User') {
            return 'User Error: Your financial request cannot be processed at the moment.';
        } else if (userRole == 'Guest') {
            return 'Guest Error: We are currently unable to process your request, please try again later.';
        }
        return 'An unknown error occurred.';
    }

    @AuraEnabled(cacheable=true)
    public static String getUserRole() {
        User currentUser = [SELECT UserRole.Name FROM User WHERE Id = :UserInfo.getUserId()];
        String roleName = currentUser.UserRole != null ? currentUser.UserRole.Name : 'No Role Assigned';
        return roleName;
    }

    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getPaginatedFinancialData(Integer pageSize, Integer pageNumber, String userRole) {
        try {
        Integer offsetValue = (pageNumber - 1) * pageSize;
        Map<String, Object> response = new Map<String, Object>();
        List<FinancialData__c> records;
        Integer totalRecords;

        // Role-based filtering by Name
        if (userRole == 'Admin') {
            records = [
                SELECT Id, Name, Amount__c, Date__c
                FROM FinancialData__c
                WHERE Name LIKE '%Admin%'
                ORDER BY Date__c DESC
                LIMIT :pageSize OFFSET :offsetValue
            ];
            totalRecords = [SELECT COUNT() FROM FinancialData__c WHERE Name LIKE '%Admin%'];
        } else if (userRole == 'User') {
            records = [
                SELECT Id, Name, Amount__c, Date__c
                FROM FinancialData__c
                WHERE Name LIKE '%User%'
                ORDER BY Date__c DESC
                LIMIT :pageSize OFFSET :offsetValue
            ];
            totalRecords = [SELECT COUNT() FROM FinancialData__c WHERE Name LIKE '%User%'];
        } else if (userRole == 'Guest') {
            records = [
                SELECT Id, Name, Amount__c, Date__c
                FROM FinancialData__c
                WHERE Name LIKE '%Guest%'
                ORDER BY Date__c DESC
                LIMIT :pageSize OFFSET :offsetValue
            ];
            totalRecords = [SELECT COUNT() FROM FinancialData__c WHERE Name LIKE '%Guest%'];
        } else {
            throw new AuraHandledException('Invalid user role.');
        }

        // Calculate total pages
        Integer totalPages = (Integer) Math.ceil((Double)totalRecords / pageSize);

        // Add results to the response map
        response.put('records', records);
        response.put('totalPages', totalPages);

        return response;
        
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching data: ' + e.getMessage());
        }
    }

}