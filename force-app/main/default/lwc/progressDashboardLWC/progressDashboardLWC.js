// AchievementsLWC.js
import { LightningElement, track, wire } from 'lwc';
import getUserAchievements from '@salesforce/apex/DashboardController.getUserAchievements';

export default class AchievementsLWC extends LightningElement {
    @track achievements;
    @track error;

    @wire(getUserAchievements)
    wiredUserAchievements({ error, data }) {
        if (data) {
            this.achievements = data;
        } else if (error) {
            this.error = 'Failed to load achievements. Please try again later.';
        }
    }
}