import { LightningElement, api } from 'lwc';

export default class TradeOffsEvaluation extends LightningElement {
    content = '';
    @api loadTime = 0;

    @api
    loadContent(lazyLoad) {
        const start = performance.now();

        if (lazyLoad) {
            // Simulate lazy loading (with delay)
            setTimeout(() => {
                this.content = 'Lazy-loaded content';
                this.loadTime = performance.now() - start;
                this.dispatchEvent(new CustomEvent('contentloaded'));
            }, 500); // 500ms delay to simulate lazy loading
        } else {
            // Load everything at once (no lazy loading)
            this.content = 'Instant content';
            this.loadTime = performance.now() - start;
            this.dispatchEvent(new CustomEvent('contentloaded'));
        }
    }
}