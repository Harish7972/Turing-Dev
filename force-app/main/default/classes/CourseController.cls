// CourseController Apex Class
public with sharing class CourseController {
    @AuraEnabled(cacheable=true)
    public static List<Course__c> getCourseRecommendations() {
        // Fetch user preferences and course history to refine recommendations
        User currentUser = [SELECT Id, Name FROM User WHERE Id = :UserInfo.getUserId()];
        List<Course__c> userCourses = [SELECT Name, Rating__c FROM Course__c WHERE User__c = :currentUser.Id];

        // Logic to filter and recommend courses based on user data
        List<Course__c> recommendedCourses = [SELECT Name FROM Course__c WHERE Id NOT IN :userCourses AND Rating__c > 4 LIMIT 5];
        return recommendedCourses;
    }
}