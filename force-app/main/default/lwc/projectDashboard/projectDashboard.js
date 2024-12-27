import { LightningElement } from 'lwc';

export default class ProjectDashboard extends LightningElement {
    tasks = [
        { id: '1', name: 'Task 1', status: 'In Progress' },
        { id: '2', name: 'Task 2', status: 'Completed' },
        { id: '3', name: 'Task 3', status: 'Not Started' },
    ];

    columns = [
        { label: 'Task Name', fieldName: 'name' },
        { label: 'Status', fieldName: 'status' },
    ];
}