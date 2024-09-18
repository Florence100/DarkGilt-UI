class Table {
    constructor(params) {
        this._rootNode = params.rootNode;
        this._titles = this._rootNode.querySelectorAll('thead th');
        this._sortableTitles = this._getSortableTitles();
        
        this._collectInstances();
        this._addListener();
        this._addStyles();
        return this;
    }

    _collectInstances() {
        Table.instances.push(this);
    }

    _addListener() {
        this._sortableTitles.forEach((title) => {
            title.addEventListener('click', (event) => {
                this._sortableTitles.forEach((title) => {
                    if (title !== event.target) {
                        title.classList.remove('ascenting');
                        title.classList.remove('descenting');
                    } else {
                        if (title.classList.contains('ascenting')){
                            title.classList.remove('ascenting');
                            title.classList.add('descenting');
                            this._sort(title.textContent, 'descenting');
                        } else if (title.classList.contains('descenting')) {
                            title.classList.remove('descenting');
                            title.classList.add('ascenting');
                            this._sort(title.textContent, 'ascenting');
                        } else {
                            title.classList.add('ascenting');
                            this._sort(title.textContent, 'ascenting');
                        }
                    }
                })
            })
        })
    }

    _getSortableTitles() {
        const sortableTitles = [];
        this._titles.forEach((title) => {
            if (title.getAttribute('data-sortable') === 'true') {
                sortableTitles.push(title);
            }
        })
        return sortableTitles;
    }

    _addStyles() {
        this._sortableTitles.forEach((title) => {
            title.classList.add('sortable');
        })
    }

    _sort(column, method) {
        console.log(`Sorting column ${column}. Sorting method ${method}`);
    }

    getRootNode() {
        return this._rootNode;
    }

    static instances = [];

    static init() {
        const elements = document.querySelectorAll('[rel="component.table"]');
        elements.forEach(function(node) {
            new Table({rootNode: node});
        })
    }

    static getInstance(node) {
        let result = null;

        if (node instanceof Node) {
            Table.instances.forEach(function(element) {
                if (element._rootNode === node | element._rootNode.contains(node)) {
                    result = element;
                    return result;
                }
            })
        }
        return result;
    }
}