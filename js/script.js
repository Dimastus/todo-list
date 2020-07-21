let ul = document.getElementsByTagName('ul')[0];
let div = document.querySelector('div.filters');
let countElems = div.querySelector('span');

readLS();
countElements();

document.addEventListener('click', () => {
    isChildren();
});

document.addEventListener('keypress', () => {
    isChildren();
});

enter.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();

        let li = createItem('li', [
            ['class', 'active'],
            ['data-ls', `${ul.children[ul.children.length - 1] ? +ul.children[ul.children.length - 1].dataset.ls + 1 : 1}`],
        ]);
        let checkbox = createItem('input', [
            ['type', 'checkbox']
        ]);
        let span = createItem('span', '', this.value);
        let button = createItem('button', '', 'X');
        let objLS = {
            key: ul.children[ul.children.length - 1] ? +ul.children[ul.children.length - 1].dataset.ls + 1 : 1,
            tagName: li.tagName.toLowerCase(),
            className: li.className,
            innerHTML: span.innerHTML
        };

        if (this.value !== '') {
            addItem(li, checkbox);
            addItem(li, span);
            addItem(li, button);
            addItem(ul, li);
            addItemLS(objLS);
        }
        this.value = '';
        countElements();
    }
});

ul.addEventListener('click', (e) => {
    let choiceElem = e.target;
    let parent = e.target.parentElement;

    if (choiceElem.tagName.toLowerCase() === 'input' && choiceElem.getAttribute('type') === 'checkbox') {
        let keyItem = parent.dataset.ls;

        parent.classList.toggle('completed');
        parent.classList.toggle('active');

        let {key, tagName, className, innerHTML} = JSON.parse(localStorage.getItem(`item-${keyItem}`));
        className = parent.className;
        localStorage.removeItem(`item-${keyItem}`);
        localStorage.setItem(`item-${keyItem}`, JSON.stringify({key, tagName, className, innerHTML}));
    }
    if (choiceElem.tagName.toLowerCase() === 'button') {
        if (confirm('Do you really want to remove this row?')) {
            parent.remove();
            countElements();
            localStorage.removeItem(`item-${parent.dataset.ls}`);
        }
    }
});

div.addEventListener('click', (e) => {
    // let choiceElem = e.target.tagName.toLowerCase();
    let choiceElemValue = e.target.value;
    switch (choiceElemValue) {
        case 'all':
            // console.log('all');
            filterChildren('all');
            break;
        case 'active':
            // console.log('active');
            filterChildren('active');
            break;
        case 'completed':
            // console.log('completed');
            filterChildren('completed');
            break;
        default:
            console.log('nothing');
            break;
    }
    countElements();
});

function addItem(when, what) {
    when.append(what);
}

function createItem(nameElem = 'div', arrAttrs, value) {
    let elem = document.createElement(nameElem);

    if (arrAttrs && Array.isArray(arrAttrs)) {
        arrAttrs.forEach(([nameAttr, valueAttr]) => {
            elem.setAttribute(nameAttr, valueAttr);
        });
    }
    elem.innerHTML = value || '';

    return elem;
}

function isChildren() {
    if (!ul.children.length) {
        div.style.display = 'none';
    } else {
        div.style.display = 'block';
    }
}

function filterChildren(className) {
    for (let i = 0, childrenLength = ul.children.length; i < childrenLength; i++) {
        const element = ul.children[i];
        if (element.classList.contains(className)) {
            element.style.display = 'flex';
        } else if (className === 'all') {
            element.style.display = 'flex';
        } else {
            element.style.display = 'none';
        }
    }
}

function countElements() {
    let count = 0;
    for (let i = 0, childrenLength = ul.children.length; i < childrenLength; i++) {
        const element = ul.children[i];
        let style = getComputedStyle(element);
        if (style.display === 'flex') {
            count++;
        }
    }
    countElems.innerHTML = `${count}/${ul.children.length} elements`;
}

function addItemLS(obj) {
    let {
        key
    } = obj;
    localStorage.setItem(`item-${key}`, JSON.stringify(obj));
}

function readLS() {
    for (const key in localStorage) {
        let data = localStorage.getItem(key);
        if (data) {
            // console.log(key);
            let {
                key,
                tagName,
                className,
                innerHTML
            } = JSON.parse(data);
            let li = createItem(tagName, [
                ['class', className],
                ['data-ls', key],
            ]);
            let checkbox = createItem('input', [
                ['type', 'checkbox']
            ]);
            let span = createItem('span', '', innerHTML);
            let button = createItem('button', '', 'X');
            if (className === 'completed') {
                checkbox.checked = true;
            }

            addItem(li, checkbox);
            addItem(li, span);
            addItem(li, button);
            addItem(ul, li);
        }
    }
}