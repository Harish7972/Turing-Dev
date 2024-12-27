import { LightningElement, track, wire } from 'lwc';
import getCurrentUserName from '@salesforce/apex/UserInfoHandler.getCurrentUserName';

export default class CountdownWidget extends LightningElement {
    @track formattedTime = '00:00';
    @track isComplete = false;
    @track showToast = false;
    @track hourHandRotation = 0;
    @track minuteHandRotation = 0;
    @track pauseButtonLabel = 'Pause';
    @track isPauseDisabled = true; // Initially disable the Pause button
    @track userName; // Track user name fetched from Salesforce

    timer;
    paused = false;
    timeLeft = 0;

    @wire(getCurrentUserName)
    wiredUserName({ error, data }) {
        if (data) {
            this.userName = data;
        } else if (error) {
            console.error('Error fetching user name: ', error);
        }
    }

    handleDurationClick(event) {
        const duration = event.target.dataset.time;
        this.startTimer(duration);
        this.isPauseDisabled = false; // Enable the Pause button when a time tile is clicked
    }

    startTimer(duration) {
        if (!this.paused) this.timeLeft = duration; // Reset timeLeft if not resuming
        clearInterval(this.timer);
        this.showToastMessage();
        this.isComplete = false;

        this.timer = setInterval(() => {
            this.updateClock();
            if (--this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.isComplete = true;
                this.updateClock(0);
                this.isPauseDisabled = true;
            }

            const minutes = Math.floor(this.timeLeft / 60);
            const seconds = this.timeLeft % 60;
            this.formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    updateClock() {
        const totalSeconds = this.timeLeft;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        this.hourHandRotation = (hours / 12) * 360;
        this.minuteHandRotation = (minutes / 60) * 360 + (seconds / 60) * 6;
    }

    togglePauseResume() {
        if (this.paused) {
            // If paused, resume the timer
            this.startTimer(this.timeLeft);
            this.pauseButtonLabel = 'Pause'; // Change label to 'Pause'
        } else {
            // If running, pause the timer
            clearInterval(this.timer);
            this.pauseButtonLabel = 'Resume'; // Change label to 'Resume'
        }
        this.paused = !this.paused;
    }

    showToastMessage() {
        this.showToast = true;
        setTimeout(() => {
            this.showToast = false;
        }, 3000);
    }

    dismissPopup() {
        this.isComplete = false;
    }
}