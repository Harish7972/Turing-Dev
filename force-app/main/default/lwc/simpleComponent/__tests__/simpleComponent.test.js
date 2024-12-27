import { createElement } from 'lwc';
import SimpleComponent from 'c/simpleComponent';

describe('c-simple-component', () => {
    let element;

    beforeEach(() => {
        element = createElement('c-simple-component', {
            is: SimpleComponent
        });
        document.body.appendChild(element);
    });

    afterEach(() => {
        // Clean up DOM after each test
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('displays the initial message', () => {
        const messageEl = element.shadowRoot.querySelector('div');
        expect(messageEl.textContent).toBe('Hello, World!');
    });

    it('changes the message when changeMessage is called', () => {
        element.changeMessage('New Message');
        return Promise.resolve().then(() => {
            const messageEl = element.shadowRoot.querySelector('div');
            expect(messageEl.textContent).toBe('New Message');
        });
    });
});
