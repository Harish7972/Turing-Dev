// import { LightningElement, wire } from 'lwc';
// import { refreshApex } from '@salesforce/apex';
// import getDashboardMetrics from '@salesforce/apex/MetricsController.getCurrentMetrics';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent';

// export default class Dashboard extends LightningElement {
//     metricsData = []; // Data to display in the datatable
//     isLoading = true; // Loading spinner state
//     columns = [
//         { label: 'Metric Name', fieldName: 'Metric_Name__c' },
//         { label: 'Metric Value', fieldName: 'Value__c' },
//     ];

//     // Store the wired result reference to use with refreshApex
//     wiredMetricsResult;
//     previousMetricsData = [];

//     @wire(getDashboardMetrics)
//     wiredMetrics(result) {
//         this.wiredMetricsResult = result;
//         if (result.data) {
//             // Check if the data has changed before updating
//             if (this.hasDataChanged(result.data)) {
//                 this.metricsData = result.data;
//                 this.isLoading = false;
//                 this.showToast('Success', 'Dashboard updated with the latest data', 'success'); // Show toast only if data changes
//             }
//         } else if (result.error) {
//             this.isLoading = false;
//             this.showToast('Error', 'There was an error loading data', 'error');
//         }
//     }

//     // Simulate periodic polling every 5 seconds to refresh data
//     connectedCallback() {
//         setInterval(() => {
//             this.refreshMetricsData();
//         }, 5000); // Refresh data every 5 seconds (for demonstration)
//     }

//     // Check if the data has changed by comparing it with previous data
//     hasDataChanged(newData) {
//         // Deep comparison of data using JSON.stringify
//         if (JSON.stringify(newData) !== JSON.stringify(this.previousMetricsData)) {
//             this.previousMetricsData = newData;
//             return true;
//         }
//         return false;
//     }

//     // Call refreshApex to refresh the data dynamically
//     refreshMetricsData() {
//         refreshApex(this.wiredMetricsResult)
//             .then(() => {
//                 // Do not show toast here, only if data changes
//                 console.log('Dashboard refreshed, waiting for data change...');
//             })
//             .catch(error => {
//                 this.showToast('Error', 'Error updating dashboard data', 'error');
//             });
//     }

//     // Show toast message to notify user
//     showToast(title, message, variant) {
//         const event = new ShowToastEvent({
//             title: title,
//             message: message,
//             variant: variant,
//         });
//         this.dispatchEvent(event);
//     }
// }


import { LightningElement, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getDashboardMetrics from '@salesforce/apex/MetricsController.getCurrentMetrics';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Dashboard extends LightningElement {
    metricsData = []; // All the data fetched from the backend
    paginatedData = []; // Data to display for the current page
    isLoading = true; // Loading spinner state
    columns = [
        { label: 'Metric Name', fieldName: 'Metric_Name__c' },
        { label: 'Metric Value', fieldName: 'Value__c' },
    ];
    
    // Pagination state
    currentPage = 1;
    pageSize = 10; // Number of records per page
    totalPages = 1;
    isFirstPage = true;
    isLastPage = false;

    // Store the wired result reference to use with refreshApex
    wiredMetricsResult;

    @wire(getDashboardMetrics)
    wiredMetrics(result) {
        this.wiredMetricsResult = result;
        if (result.data) {
            this.metricsData = result.data;
            this.isLoading = false;
            this.totalPages = Math.ceil(this.metricsData.length / this.pageSize);
            this.updatePaginatedData();
            this.showToast('Success', 'Dashboard updated with the latest data', 'success');
        } else if (result.error) {
            this.isLoading = false;
            this.showToast('Error', 'There was an error loading data', 'error');
        }
    }

    // Update the displayed data based on the current page
    updatePaginatedData() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.paginatedData = this.metricsData.slice(startIndex, endIndex);

        // Update pagination state
        this.isFirstPage = this.currentPage === 1;
        this.isLastPage = this.currentPage === this.totalPages;
    }

    // Handle the "Next" button click
    handleNext() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.updatePaginatedData();
        }
    }

    // Handle the "Previous" button click
    handlePrevious() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updatePaginatedData();
        }
    }

    // Show toast message to notify user
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }

    // Simulate periodic polling every 5 seconds to refresh data
    connectedCallback() {
        setInterval(() => {
            this.refreshMetricsData();
        }, 5000); // Refresh data every 5 seconds (for demonstration)
    }

    // Call refreshApex to refresh the data dynamically
    refreshMetricsData() {
        refreshApex(this.wiredMetricsResult)
            .then(() => {
                // console.log('Dashboard refreshed, waiting for data change...');
            })
            .catch(error => {
                this.showToast('Error', 'Error updating dashboard data', 'error');
            });
    }
}