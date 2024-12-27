// public with sharing class QuestionController {
//     @AuraEnabled(cacheable=true)
//     public static List<Question__c> getQuestions() {
//         return [SELECT Id, Name, Answer__c, Votes__c, SystemModstamp FROM Question__c];
//     }

//     @AuraEnabled
//     public static void saveQuestionAnswer(Id questionId, String answer) {
//         try {
//             List<Question__c> questions = [SELECT Id, Answer__c FROM Question__c WHERE Id = :questionId LIMIT 1];
//             if (questions.isEmpty()) {
//                 throw new AuraHandledException('Question not found');
//             }
//             Question__c q = questions[0];
//             q.Answer__c = answer;
//             update q;
//         } catch (Exception e) {
//             throw new AuraHandledException('Error saving answer: ' + e.getMessage());
//         }
//     }

//     @AuraEnabled
//     public static void saveVote(Id questionId, String voteType) {
//         try {
//             List<Question__c> questions = [SELECT Id, Votes__c FROM Question__c WHERE Id = :questionId LIMIT 1];
//             if (questions.isEmpty()) {
//                 throw new AuraHandledException('Question not found');
//             }
//             Question__c q = questions[0];
//             Integer newVotes = voteType == 'Upvote' ? (Integer)q.Votes__c + 1 : (Integer)q.Votes__c - 1;
//             q.Votes__c = newVotes;
//             update q;
//         } catch (Exception e) {
//             throw new AuraHandledException('Error updating vote count: ' + e.getMessage());
//         }
//     }
// }

public with sharing class QuestionController {
    @AuraEnabled(cacheable=true)
    public static List<Question__c> getQuestions() {
        try {
            // Query questions with security enforced
            return [SELECT Id, Name, Answer__c, Votes__c, SystemModstamp 
                    FROM Question__c 
                    WITH SECURITY_ENFORCED];
        } catch (Exception e) {
            // Log the error for debugging and rethrow a user-friendly exception
            System.debug('Error fetching questions: ' + e.getMessage());
            throw new AuraHandledException('Error fetching questions.');
        }
    }

    @AuraEnabled
    public static void saveQuestionAnswer(Id questionId, String answer) {
        try {
            // Query the specific question with security enforced
            Question__c question = [SELECT Id, Answer__c 
                                     FROM Question__c 
                                     WHERE Id = :questionId 
                                     WITH SECURITY_ENFORCED 
                                     LIMIT 1];

            // Update the answer
            question.Answer__c = answer;
            update question;
        } catch (QueryException qe) {
            // Handle cases where the query returns no rows
            throw new AuraHandledException('Question not found.');
        } catch (Exception e) {
            // Log the error and throw a generic error message
            System.debug('Error saving answer: ' + e.getMessage());
            throw new AuraHandledException('Error saving answer.');
        }
    }
}