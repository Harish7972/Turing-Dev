public class UserRoleController {
    @AuraEnabled(cacheable=true)
    public static String getUserRole() {
        // Fetch the profile of the current user to determine their role
        User currentUser = [SELECT Profile.Name FROM User WHERE Id = :UserInfo.getUserId()];
        return currentUser.Profile.Name; // Return the profile name
    }
}