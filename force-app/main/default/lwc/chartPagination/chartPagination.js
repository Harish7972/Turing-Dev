import { LightningElement, api } from 'lwc';

export default class ChartPagination extends LightningElement {
    @api currentPage;
    @api totalRecords;
    @api pageSize;

    // get totalPages() {
    //     return Math.ceil(this.totalRecords / this.pageSize);
    // }

    get totalPages() {
        return Math.ceil(this.totalRecords / this.pageSize);
    }

    get isPreviousDisabled() {
        return this.currentPage === 1;
    }

    get isNextDisabled() {
        return this.currentPage === this.totalPages;
    }

    handlePrevious() {
        if (this.currentPage > 1) {
            this.dispatchPageChangeEvent(this.currentPage - 1);
        }
    }

    handleNext() {
        if (this.currentPage < this.totalPages) {
            this.dispatchPageChangeEvent(this.currentPage + 1);
        }
    }

    dispatchPageChangeEvent(page) {
        const event = new CustomEvent('pagechange', {
            detail: page
        });
        this.dispatchEvent(event);
    }
}