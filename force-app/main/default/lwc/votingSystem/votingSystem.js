import { LightningElement, track,wire} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getQuestions from '@salesforce/apex/QuestionController.getQuestions';
import saveQuestionAnswer from '@salesforce/apex/QuestionController.saveQuestionAnswer';
import saveVote from '@salesforce/apex/VoteController.saveVote';
import getUserId from '@salesforce/apex/VoteController.getUserId';

export default class VotingSystem extends LightningElement {
    @track questions = [];
    userId;
    connectedCallback() {
        this.loadQuestions();
    }

    @wire(getUserId)
    wiredUserId({ error, data }) {
        if (data) {
            this.userId = data; // Set the userId when the data is successfully returned from the Apex method
        } else if (error) {
            console.error('Error fetching user ID:', error); // Handle any error here
        }
    }
    
    loadQuestions() {
        getQuestions()
            .then(result => {
                this.questions = result.map(q => {
                    return {
                        ...q,
                        timeElapsed: this.formatTimeElapsed(new Date() - new Date(q.SystemModstamp)), // Calculate time elapsed
                        isEditing: false,  // Initialize editing state
                        isBestAnswer: q.Answer__c === "Correct answer", // Example condition for best answer
                        hasUpvoted: q.hasUpvoted,
                        hasDownvoted: q.hasDownvoted
                    };
                });
            })
            .catch(error => {
                console.error('Error fetching questions:', error);
            });
    }
    

    // Format time elapsed
    formatTimeElapsed(timeDiff) {
        const seconds = Math.floor(timeDiff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
        return `${seconds} second${seconds > 1 ? 's' : ''}`;
    }

    // Handle upvote
    upvote(event) {
        const questionId = event.target.dataset.id;
        console.log('questionId='+questionId);
        this.updateVote(questionId, 'Upvote');
        console.log('questionId=2='+questionId);
    }

    // Handle downvote
    downvote(event) {
        const questionId = event.target.dataset.id;
        this.updateVote(questionId, 'Downvote');
    }

    updateVote(questionId, voteType) {
      saveVote({ contentId: questionId, userId: this.userId,     voteType })
          .then(() => {
              // Refresh questions to update the UI
              this.questions = this.questions.map(question => {
                  if (question.Id === questionId) {
                      // Update the vote count
                      question.Votes__c += voteType === 'Upvote' ? 1 : -1;
                  }
                  return question;
              });

              // Show toast message
              this.showToast('Success', `${voteType} successful!`, 'success');
          })
          .catch(error => {
              console.error('Error:', error.message);
              this.showToast(
                  'Error',
                  'Vote count cannot be less than 0 OR You may have already submitted your vote',
                  'error'
              );
          });
   }

    
    

    // Show toast message
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }

    // Handle text change in the editing textarea
    handleChange(event) {
        const questionId = event.target.dataset.id;
        const question = this.questions.find(q => q.id === questionId);
        question.text = event.target.value;
    }

    // Save the edited answer
    saveEdit(event) {
        const questionId = event.target.dataset.Id;
        const question = this.questions.find(q => q.id === questionId);
        question.isEditing = false; // Disable editing mode
        console.log('In saveedit');
        this.showToast('Success', 'Answer updated successfully!', 'success');
        saveAnswer(questionId);
    }



    @track questions = [];

    @wire(getQuestions)
    wiredQuestions({ error, data }) {
        if (data) {
            this.questions = data.map(question => ({
                ...question,
                isEditing: false,
                tempAnswer: question.Answer__c // Temporarily store the answer while editing
            }));
        } else if (error) {
            console.error('Error loading questions:', error);
        }
    }

    // Toggle edit mode
    toggleEdit(event) {
        const questionId = event.target.dataset.id;
        const question = this.questions.find(q => q.Id === questionId);
        question.isEditing = !question.isEditing;

        // Store current answer for editing
        if (question.isEditing) {
            question.tempAnswer = question.Answer__c;
        }
    }

    // Handle input changes for the editable textarea
    handleInputChange(event) {
        const questionId = event.target.dataset.id;
        const question = this.questions.find(q => q.Id === questionId);
        question.tempAnswer = event.target.value;
    }

    saveAnswer(event) {
        const questionId = event.target.dataset.id;
        const question = this.questions.find(q => q.Id === questionId);
        question.isEditing = false; // Disable editing mode
        console.log('In saveedit');
        // this.showToast('Success', 'Answer updated successfully!', 'success');
        console.log('In saveasnwer1');

        // Save the updated answer in Salesforce
        saveQuestionAnswer({ questionId, answer: question.tempAnswer })
            .then(() => {
                console.log('In saveasnwer2');

                question.Answer__c = question.tempAnswer; // Update the original answer with the tempAnswer
                question.isEditing = false; // Exit editing mode

                // Show success toast
                this.showToast('Success', 'Answer updated successfully!', 'success');
            })
            .catch(error => {
                console.error('Error saving answer:', error);
                this.showToast('Error', 'There was an issue saving the answer', 'error');
            });
    }

    // Cancel editing the answer
    cancelEdit(event) {
        const questionId = event.target.dataset.id;
        const question = this.questions.find(q => q.Id === questionId);
        question.isEditing = false; // Exit editing mode without saving
        console.log('In cancel');
    }

   
}