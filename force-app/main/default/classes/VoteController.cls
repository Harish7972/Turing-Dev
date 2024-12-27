// public with sharing class VoteController {
//     @AuraEnabled
//     public static List<Question__c> getQuestionsWithVotes(String userId) {
//         // Retrieve the questions along with upvote and downvote user lists
//         List<Question__c> questions = [SELECT Id, Name, Votes__c, Upvoted_By_User__c, Downvoted_By_User__c FROM Question__c];
        
//         // Add flags for upvoted and downvoted
//         for (Question__c question : questions) {
//             question.addError('hasUpvoted', (question.Upvoted_By_User__c != null && question.Upvoted_By_User__c.contains(userId)));
//             question.addError('hasDownvoted', (question.Downvoted_By_User__c != null && question.Downvoted_By_User__c.contains(userId)));
//         }
//         return questions;
//     }

//     @AuraEnabled(cacheable=true)
//     public static String getUserId() {
//         //Id roleId = [SELECT UserRole.Name FROM User WHERE Id = :UserInfo.getUserId()].UserRole.Name;
//         User currentUser = [SELECT Id FROM User WHERE Id = :UserInfo.getUserId()];
//         return currentUser.id;
//         //return roleId != null ? roleId : 'No Role Assigned';
//     }

//     @AuraEnabled
//     public static Integer saveVote(String contentId, String userId, String voteType) {
//         try {
//             // Retrieve the question
//             Question__c question = [SELECT Id, Votes__c, Upvoted_By_User__c, Downvoted_By_User__c FROM Question__c WHERE Id = :contentId LIMIT 1];

//             if (voteType == 'Upvote') {
//                 // Check if user has already upvoted
//                 if (question.Upvoted_By_User__c != null && question.Upvoted_By_User__c.contains(userId)) {
//                     throw new AuraHandledException('You have already upvoted this question.');
//                 }
//                 question.Votes__c = (question.Votes__c != null ? question.Votes__c : 0) + 1;
//                 question.Upvoted_By_User__c = (question.Upvoted_By_User__c == null ? userId : question.Upvoted_By_User__c + ',' + userId);
//             } else if (voteType == 'Downvote') {
//                 // Check if user has already downvoted
//                 if (question.Downvoted_By_User__c != null && question.Downvoted_By_User__c.contains(userId)) {
//                     throw new AuraHandledException('You have already downvoted this question.');
//                 }
//                 // Ensure vote count is not negative
//                 if (question.Votes__c == null || question.Votes__c <= 0) {
//                     throw new AuraHandledException('Vote count cannot be less than 0.');
//                 }
//                 question.Votes__c -= 1;
//                 question.Downvoted_By_User__c = (question.Downvoted_By_User__c == null ? userId : question.Downvoted_By_User__c + ',' + userId);
//             }
            
//             // Update the question record with the new vote count
//             update question;
//             return (Integer)question.Votes__c;
//         } catch (Exception e) {
//             throw new AuraHandledException('Error saving vote: ' + e.getMessage());
//         }
//     }
// }


public with sharing class VoteController {
    @AuraEnabled(cacheable=true)
    public static List<Question__c> getQuestionsWithVotes(String userId) {
        try {
            // Retrieve questions with security enforced
            List<Question__c> questions = [
                SELECT Id, Name, Votes__c, Upvoted_By_User__c, Downvoted_By_User__c
                FROM Question__c
                WITH SECURITY_ENFORCED
            ];

            // Add flags for upvoted and downvoted
            for (Question__c question : questions) {
                question.put('hasUpvoted', question.Upvoted_By_User__c != null && question.Upvoted_By_User__c.contains(userId));
                question.put('hasDownvoted', question.Downvoted_By_User__c != null && question.Downvoted_By_User__c.contains(userId));
            }
            return questions;
        } catch (Exception e) {
            System.debug('Error fetching questions with votes: ' + e.getMessage());
            throw new AuraHandledException('Error fetching questions with votes.');
        }
    }

    @AuraEnabled(cacheable=true)
    public static String getUserId() {
        try {
            // Retrieve the current user's ID
            return [SELECT Id FROM User WHERE Id = :UserInfo.getUserId() WITH SECURITY_ENFORCED].Id;
        } catch (Exception e) {
            System.debug('Error fetching user ID: ' + e.getMessage());
            throw new AuraHandledException('Error fetching user ID.');
        }
    }

    @AuraEnabled
    public static Integer saveVote(String contentId, String userId, String voteType) {
        try {
            // Retrieve the question with security enforced
            Question__c question = [
                SELECT Id, Votes__c, Upvoted_By_User__c, Downvoted_By_User__c
                FROM Question__c
                WHERE Id = :contentId
                WITH SECURITY_ENFORCED
                LIMIT 1
            ];
        
            // Handle upvote logic
            if (voteType == 'Upvote') {
                if (question.Upvoted_By_User__c != null && question.Upvoted_By_User__c.contains(userId)) {
                    throw new AuraHandledException('You have already upvoted this question.');
                }
                question.Votes__c = (question.Votes__c != null ? question.Votes__c : 0) + 1;
                question.Upvoted_By_User__c = String.isEmpty(question.Upvoted_By_User__c)
                    ? userId
                    : question.Upvoted_By_User__c + ',' + userId;
            }
        
            // Handle downvote logic
            else if (voteType == 'Downvote') {
                if (question.Downvoted_By_User__c != null && question.Downvoted_By_User__c.contains(userId)) {
                    throw new AuraHandledException('You have already downvoted this question.');
                }
                if (question.Votes__c == null || question.Votes__c <= 0) {
                    throw new AuraHandledException('Vote count cannot be less than 0.');
                }
                question.Votes__c -= 1;
                question.Downvoted_By_User__c = String.isEmpty(question.Downvoted_By_User__c)
                    ? userId
                    : question.Downvoted_By_User__c + ',' + userId;
            }
        
            // Update the question record
            update question;
        
            // Explicitly convert Decimal to Integer and return
            return Integer.valueOf(question.Votes__c);
        } catch (QueryException qe) {
            throw new AuraHandledException('Question not found.');
        } catch (Exception e) {
            System.debug('Error saving vote: ' + e.getMessage());
            throw new AuraHandledException('Error saving vote.');
        }
    }

}