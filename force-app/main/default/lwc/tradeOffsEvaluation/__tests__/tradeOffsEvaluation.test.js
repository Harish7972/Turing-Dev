// import { createElement } from 'lwc';
// import TradeOffsEvaluation from 'c/tradeOffsEvaluation';

// describe('c-trade-offs-evaluation', () => {
//     it('renders component with correct heading', () => {
//         // Create an instance of the component
//         const element = createElement('c-trade-offs-evaluation', {
//             is: TradeOffsEvaluation
//         });

//         // Append the element to the DOM
//         document.body.appendChild(element);

//         // Query the shadow DOM for the <h1> element
//         const heading = element.shadowRoot.querySelector('h1');

//         // Check that the <h1> element is rendered with the expected text
//         expect(heading).not.toBeNull();
//         expect(heading.textContent).toBe('Trade-Offs Evaluation Component');
//     });
// });




// import { LightningElement } from 'lwc';

// export default class TradeOffsEvaluation extends LightningElement {
//     content = '';
//     loadTime = 0;

//     // Simulate loading with or without lazy loading
//     loadContent(lazyLoad) {
//         const start = performance.now();

//         if (lazyLoad) {
//             // Simulate lazy loading (with delay)
//             setTimeout(() => {
//                 this.content = 'Lazy-loaded content';
//                 this.loadTime = performance.now() - start;
//             }, 500); // 500ms delay to simulate lazy loading
//         } else {
//             // Load everything at once
//             this.content = 'Instant content';
//             this.loadTime = performance.now() - start;
//         }
//     }
// }


import { createElement } from 'lwc';
import TradeOffsEvaluation from 'c/tradeOffsEvaluation';

describe('c-trade-offs-evaluation', () => {
    let element;

    beforeEach(() => {
        element = createElement('c-trade-offs-evaluation', {
            is: TradeOffsEvaluation
        });
        document.body.appendChild(element);
    });

    afterEach(() => {
        document.body.removeChild(element);
    });

    // Helper function to wait until the content is loaded or timeout after 5 seconds
    async function waitForContentLoaded(element, timeout = 5000) {
        const startTime = Date.now();
        return new Promise((resolve, reject) => {
            const checkContent = () => {
                if (element.content) {
                    resolve();
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error('Timeout waiting for content to load'));
                } else {
                    setTimeout(checkContent, 100); // Check every 100ms until content is loaded
                }
            };
            checkContent();
        });
    }

    it(
        'should measure load time with lazy loading (delayed load)',
        async () => {
            element.loadContent(true); // Simulate lazy loading
            await waitForContentLoaded(element); // Wait for the lazy loading to complete

            const lazyLoadTime = element.loadTime;
            console.log(`Lazy Load Time: ${lazyLoadTime}ms`);

            expect(lazyLoadTime).toBeGreaterThan(0); // Lazy loading should have some delay
        },
        15000 // Timeout set to 15 seconds for Jest to complete
    );

    it(
        'should measure load time without lazy loading (immediate load)',
        async () => {
            element.loadContent(false); // Simulate instant loading
            await waitForContentLoaded(element); // Wait for the content to be loaded

            const instantLoadTime = element.loadTime;
            console.log(`Instant Load Time: ${instantLoadTime}ms`);

            expect(instantLoadTime).toBeGreaterThan(0);
        },
        15000 // Timeout set to 15 seconds for Jest to complete
    );

    it(
        'should compare load times and expect lazy loading to take longer',
        async () => {
            element.loadContent(false); // Instant loading
            await waitForContentLoaded(element);
            const instantLoadTime = element.loadTime;

            element.loadContent(true); // Lazy loading
            await waitForContentLoaded(element);
            const lazyLoadTime = element.loadTime;

            console.log(`Instant Load Time: ${instantLoadTime}ms`);
            console.log(`Lazy Load Time: ${lazyLoadTime}ms`);

            expect(lazyLoadTime).toBeGreaterThan(instantLoadTime);
        },
        15000 // Timeout set to 15 seconds for Jest to complete
    );
});
