class EditBox {
    constructor(params) {
        this._rootNode = params.rootNode;
        this._input = this._rootNode.querySelector('[rel="input"]');
        this._message = this._rootNode.querySelector('[rel="message"]') || '';
        this._messageText = this._message?.getAttribute('data-error') || '';
        this._pattern = this._input.getAttribute('data-pattern') || '';
        this._isValid = this._input.getAttribute('data-verify-on-input')
            ? this._input.getAttribute('data-verify-on-input')
            : 'false';
        this._value = this._input.getAttribute('value') || '';
        this._initialValue = this._value;
        this._placeholder = this._input.getAttribute('data-placeholder') || '';

        this._dataOnVerify = this._rootNode.getAttribute('data-on-verify') || null;
        this._onVerifyFromParams = typeof params?.onVerify == 'function' ? params.onVerify : null;
        this._onVerifyFromAttr = this._getFunctionFromString(this._dataOnVerify);

        this._dataOnInput = this._rootNode.getAttribute('data-on-input') || null;
        this._onInputFromParams = typeof params?.onInput == 'function' ? params.onInput : null;
        this._onInputFromAttr = this._getFunctionFromString(this._dataOnInput);

        this._initEvents();
        this._addInputListener();
        this._collectInstances();

        return this;
    }

    _addInputListener() {
        this._input.addEventListener('input', () => {
            this._value = this._input.value;
            this._input.setAttribute('value', this._value);
        })
    }

    _initEvents() {
        if (this._onVerifyFromParams) {
            this._addOnVerifyListener(this._onVerifyFromParams);
        }

        if (this._onVerifyFromAttr) {
            this._addOnVerifyListener(this._onVerifyFromAttr);
        }

        if (this._onInputFromParams) {
            this._addOnInputListener(this._onInputFromParams);
        }

        if (this._onInputFromAttr) {
            this._addOnInputListener(this._onInputFromAttr);
        }
    }

    _getFunctionFromString(functionBodyStr) {
        let func;
        if (typeof functionBodyStr === 'string') {
            const dataOnVerify = functionBodyStr;
            this._rootNode.setAttribute('onclick', dataOnVerify)
            func = this._rootNode.onclick;
            this._rootNode.removeAttribute('onclick');
        }
        return func;
    }

    _addOnVerifyListener(callback) {
        if (typeof callback == 'function') {
            function wrapper() {
                return callback.apply(EditBox.getInstance(this));
            }
            this._rootNode.addEventListener('verify', wrapper);
        }
    }

    _addOnInputListener(callback) {
        if (typeof callback == 'function') {
            function wrapper() {
                return callback.apply(EditBox.getInstance(this));
            }
            this._input.addEventListener('input', wrapper);
        }
    }

    _collectInstances() {
        EditBox.instances.push(this);
    }

    reset() {
        this._input.value = this._initialValue;
        this._input.setAttribute('value', this._initialValue);
        
        if (this._message) {
            this._message.textContent = '';
        }
    }

    getRootNode() {
        return this._rootNode;
    }

    getValue() {
        return this._value;
    }

    setValue(value) {
        if (typeof(value) !== 'undefined') {
            if (typeof(value) === 'string') {
                this._input.setAttribute('value', value);
                this._input.value = value;
                this._value = value;
            }
        }
        return this;
    }

    verify() {
        if (this._input.value.match(this._pattern) === null) {
            this._input.setAttribute('data-verify-on-input', 'false');
            this._isValid = 'false';
            if (this._message) {
                this._message.textContent = this._messageText;
            }
        } else {
            this._input.setAttribute('data-verify-on-input', 'true');
            this._isValid = 'true';
            if (this._message) {
                this._message.textContent = '';
            }
        }

        //for work 4 USER CASE
        const verifyEvent = new Event('verify', { bubbles: true });
        this._rootNode.dispatchEvent(verifyEvent);

        return this;
    }

    //for work 3 USER CASE
    onVerify(callback) {
        this._addOnVerifyListener(callback);
        return this;
    }

    onInput(callback) {
        this._addOnInputListener(callback);
        return this;
    }

    static instances = [];

    static init() {
        const elements = document.querySelectorAll('[rel="control.editBox"]');
        elements.forEach(function(node) {
            new EditBox({rootNode: node});
        })
    }

    static getInstance(node) {
        let result = null;

        if (node instanceof Node) {
            EditBox.instances.forEach(function(element) {
                if (element._rootNode === node | element._rootNode.contains(node)) {
                    result = element;
                    return result;
                }
            })
        }
        return result;
    }
}