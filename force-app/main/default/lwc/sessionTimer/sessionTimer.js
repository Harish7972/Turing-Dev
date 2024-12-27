import { LightningElement, api, track } from 'lwc';

export default class SessionTimer extends LightningElement {
    @track timerMessage = 'Session is inactive. Timer is stopped.';
    timer; // Timer ID for the interval
    seconds = 0; // Counter for seconds elapsed

    // Use a setter to monitor changes in sessionStatus
    _sessionStatus;
    @api 
    get sessionStatus() {
        return this._sessionStatus;
    }
    set sessionStatus(value) {
        this._sessionStatus = value;
        if (value === 'Active') {
            this.startTimer(); // Start the timer when session is active
        } else if (value === 'Inactive') {
            this.stopTimer(); // Stop the timer when session is inactive
        }
    }

    startTimer() {
        if (!this.timer) { // Ensure no multiple timers
            this.timerMessage = 'Session is active. Timer: 0 seconds.';
            this.timer = setInterval(() => {
                this.seconds += 1;
                this.timerMessage = `Session is active. Timer: ${this.seconds} seconds.`;
            }, 1000);
        }
    }

    stopTimer() {
        clearInterval(this.timer); // Stop the timer
        this.timer = null; // Reset timer ID
        this.seconds = 0; // Reset seconds counter
        this.timerMessage = 'Session is inactive. Timer is stopped.';
    }
}