class Modal {
    _isOpen = false;
    _focusElement = null;
    _timeAnimation = 250;

    constructor(params) {
        this._rootNode = params.rootNode;
        this._closeButtons = this._rootNode.querySelectorAll('[rel="modal.close"]') || null;
        this._modalWindow = this._rootNode.querySelector('[rel="modal.window"]');
        this._coverage = this._rootNode.querySelector('[rel="modal.coverage"]');
        this._title = this._rootNode.querySelector('[rel="modal.title"]')?.getAttribute('data-title') || null;
        this._focusableEls = this._rootNode.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])');
        this._firstFocusableEl = this._focusableEls.length > 0 ? this._focusableEls[0] : null;
        this._lastFocusableEl = this._focusableEls.length > 1 ? this._focusableEls[this._focusableEls.length - 1] : null;
        this._onOpen = typeof params?.onOpen == 'function' ? params.onOpen : undefined;
        this._onClose = typeof params?.onClose == 'function' ? params.onClose : undefined;

        this._registerInstance();
        this._trapFocus();
        this.setTitle();

        //listeners
        this._closeButtons.length > 0 ? this._addCloseButtonListener() : null;
        this._coverage? this._addCoverageListener() : null;
        this._onOpen? this._addOpenModalListener(this._onOpen) : null;
        this._onClose? this._addCloseModalListener(this._onClose) : null;

        return this;
    }

    _trapFocus() {
        document.addEventListener('keydown', (e) => {
            if (!this._isOpen) {
                return;
            }

            const isTabPressed = e.key === 'Tab' ? true : false;
            if (!isTabPressed) {
                return;
            }

            if (this._focusableEls.length > 1) {
                if (e.shiftKey) /* shift + tab */ {
                    if (document.activeElement === this._firstFocusableEl) {
                        this._lastFocusableEl.focus();
                        this._focusElement = this._lastFocusableEl;
                        e.preventDefault();
                    }
                } else /* tab */ {
                    if (document.activeElement === this._lastFocusableEl) {
                        this._firstFocusableEl.focus();
                        this._focusElement = this._firstFocusableEl;
                        e.preventDefault();
                    }
                }
            } else if (this._focusableEls.length === 1) {
                this._firstFocusableEl.focus();
                this._focusElement = this._firstFocusableEl;
                e.preventDefault();
            } else if (this._focusableEls.length === 0) {
                e.preventDefault();
            }
        });
    }

    _disableScrolling(e) {
        switch(e.type) {
            case 'wheel':
                !e.ctrlKey ? e.preventDefault() : null;
                break;
            case 'touchmove': {
                e.preventDefault();
                break;
            }
            case 'keydown': {
                const scrollKeys = ['ArrowUp', 'ArrowDown', 'PageDown', 'PageUp', 'Home', 'End'];
                if (scrollKeys.includes(e.code)) {
                    e.preventDefault();
                }
                break;
            }
        }
    }

    _toggleTwoClasses(element, firstClass, secondClass, timeAnimation) {
        if (!element.classList.contains(firstClass)) {
            element.classList.add(firstClass);
            element.classList.remove(secondClass);
        } else {
            element.classList.add(secondClass);
            window.setTimeout(() => {
                element.classList.remove(firstClass);
            }, timeAnimation);
        }
    }

    _addDarkBackground() {
        this._toggleTwoClasses(this._coverage, 'is-visible', 'is-hidden', this._timeAnimation);
    }

    _removeDarkBackground() {
        this._toggleTwoClasses(this._coverage, 'is-visible', 'is-hidden', this._timeAnimation);
    }

    _focusOnModal() {
        if (this._focusElement) {
            this._focusElement.focus();
        } else {
            if (this._closeButtons.length !== 0) {
                this.focus(this._closeButtons[0]);
                this._focusElement = this._closeButtons[0];
            }
        }
    }

    _addOpenModalListener(callback) {
        if(typeof callback == 'function') {
            function wrapper() {
                return callback.apply(Modal.getInstance(this));
            }
            this._rootNode.addEventListener('open-modal', wrapper);
        }
    }

    _addCloseModalListener(callback) {
        if(typeof callback == 'function') {
            function wrapper() {
                return callback.apply(Modal.getInstance(this));
            }
            this._rootNode.addEventListener('close-modal', wrapper);
        }
    }

    _addCloseButtonListener() {
        this._closeButtons.forEach(closeButton => {
            closeButton.addEventListener('click', () => {
                this.close();
            })
        })
    }

    _addCoverageListener() {
        this._coverage.addEventListener('click', () => {
            this.close();
        })
    }

    //scroll with mouse
    _addWheelListener() {
        this._rootNode.addEventListener('wheel', this._disableScrolling, {passive: false});
    }

    //scroll with touch
    _addTouchListener() {
        this._rootNode.addEventListener('touchmove', this._disableScrolling, {passive: false});
    }

    //scroll with keyboard
    _addKeyboardListener() {
        this._rootNode.addEventListener('keydown', this._disableScrolling);
    }

    _removeWheelListener() {
        this._rootNode.removeEventListener('wheel', this._disableScrolling, {passive: false});
    }

    _removeTouchListener() {
        this._rootNode.removeEventListener('touchmove', this._disableScrolling, {passive: false});
    }

    _removeKeyboardListener() {
        this._rootNode.removeEventListener('keydown', this._disableScrolling);
    }

    _registerInstance() {
        Modal.instances.push(this);
    }

    open() {
        if (!this._isOpen) {
            this._toggleTwoClasses(this._modalWindow, 'is-visible', 'is-hidden', this._timeAnimation);
            this._addDarkBackground();
            this._focusOnModal();

            const eventOpenModal = new Event('open-modal', { bubbles: true });
            this._rootNode.dispatchEvent(eventOpenModal);

            this._addWheelListener();
            this._addTouchListener();
            this._addKeyboardListener();

            this._isOpen = true;
        } else {
            console.log('Modal window is already open');
        }
        return this;
    }

    close() {
        if (this._isOpen) {
            this._toggleTwoClasses(this._modalWindow, 'is-visible', 'is-hidden', this._timeAnimation);
            this._removeDarkBackground();

            const eventCloseModal = new Event('close-modal', { bubbles: true });
            this._rootNode.dispatchEvent(eventCloseModal);

            this._removeWheelListener();
            this._removeTouchListener();
            this._removeKeyboardListener();

            this._isOpen = false;
        } else {
            console.log('Modal window is already close');
        }
        return this;
    }

    //for work 2 USER CASE
    onOpen(callback) {
        this._addOpenModalListener(callback);
        return this;
    }

    //for work 2 USER CASE
    onClose(callback) {
        this._addCloseModalListener(callback);
        return this;
    }

    focus(element) {
        if (element && this._modalWindow.contains(element)) {
            this._focusElement = element;
            element.focus();
        }
        return this;
    }

    setTitle(title = this._title) {
        if (this._rootNode.querySelector('[rel="modal.title"]') && title) {
            this._rootNode.querySelector('[rel="modal.title"]').textContent = title;
        }
        return this;
    }

    getRootNode() {
        return this._rootNode;
    }

    static instances = [];

    static init() {
        const elements = document.querySelectorAll('[rel="control.modal"]');
        elements.forEach(function(node) {
            new Modal(node);
        })
    }

    static getInstance(node) {
        let result = null;

        if (node instanceof Node) {
            Modal.instances.forEach(function(element) {
                if (element._rootNode === node | element._rootNode.contains(node)) {
                    result = element;
                    return result;
                }
            })
        }
        return result;
    }
}