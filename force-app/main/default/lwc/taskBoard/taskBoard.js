import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class TaskBoard extends LightningElement {
    @track tasks = [
        { id: '1', name: 'Task 1' },
        { id: '2', name: 'Task 2' },
        { id: '3', name: 'Task 3' },
    ];

    // Handle button click inside a task
    handleClick(event) {
        event.stopPropagation(); // Prevents bubbling to parent elements
        this.showToast('Info', 'stopPropagation called: Task button clicked', 'info');
    }

    // Handle dragstart for tasks
    handleDragStart(event) {
        event.stopPropagation(); // Prevents bubbling
        const taskId = event.target.dataset.id;
        this.showToast('Info', `stopPropagation called: Drag started for Task ${taskId}`, 'info');
    }

    // Show toast notification
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }
}