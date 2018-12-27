export {init}

function init() {
    getFromJson().then(successCallback);
    selectRemove();

    function successCallback(resp) {
        if (!resp.data.length) {
            console.log('wrong')
        }
         
        showContent(resp.data);
    }
}

function getFromJson() {
    return new Promise(function (resolve, reject) {
        const request = new XMLHttpRequest();
        request.open('GET', 'https://api.myjson.com/bins/ks6cq', true);
        request.onload = function() {
            if (this.status === 200) {
                resolve(JSON.parse(request.responseText));
            } else {
                reject (new Error(this.statusText));
            }
        };
        request.onerror = function () {
            reject(new Error(this.statusText))
        }
        request.send(null);
    })
}

function showContent(data) {
    
    data.map(function (product) {
        return selectCat(product)
    })

    addToCompare();
    searchProduct()
}

function selectRemove() {
    const select = document.querySelector('.products__select');

    select.addEventListener('change', _=> {
        var contentBox = document.querySelector('#product__list');

        while (contentBox.firstChild) {
            contentBox.removeChild(contentBox.firstChild);
        }
    })
}

function selectCat(product) {
    const select = document.querySelector('.products__select');

    createProduct(product)

    select.addEventListener('change', _=> {
        var contentBox = document.querySelector('#product__list');

        if (select.value == product.cat) {
            return createProduct(product);
        } 

        if (select.value == "All") {
            return createProduct(product);
        }
    })
}

function createProduct(product) {
    const contentBox = document.querySelector('#product__list');
    const element = prepareElement('div',['product__elem']);
    const imageElement = prepareElement('img', ['product__img'], element);
    const nameProd = prepareElement('p',['product__name'], element);
    const catProd = prepareElement('p',['product__cat'], element);
    const yearProd = prepareElement('p',['product__year'], element);
    const textComp = prepareElement('p',['product__txt'], element);

    contentBox.appendChild(element)

    imageElement.setAttribute('src', product.img);
    nameProd.innerText = product.name;
    catProd.innerText = 'Category:' + ' ' + product.cat;
    yearProd.innerText = 'Year:' + ' ' + product.year;
    textComp.innerHTML = "<p>Click to add to compare</p><input type='checkbox' class='product__checkbox'>";
}

function prepareElement(type, additionalClasses, parent) {
    const item = document.createElement(type);
    
    if (additionalClasses.length) {
        additionalClasses.forEach(function(className) {
            item.classList.add(className)
        });
    }

    if (parent) {
        parent.appendChild(item);
    }

    return item;
}

function addToCompare() {
    const productElem = document.querySelectorAll('.product__elem');
    const buttonCompare = document.querySelector('.header__btn');
    let totalItems = 0;

    productElem.forEach(item => {
        item.addEventListener('click', _=> {
            const check = item.querySelector('.product__checkbox');

            if (item.classList.contains('checked')) {
                check.removeAttribute('checked', true);
                item.classList.remove('checked');
                totalItems--;
                return;
            }{
                check.setAttribute('checked', true);
                item.classList.add('checked');
                totalItems++;
            }

            if (totalItems > 3) {
                alert('you can add only three products')
                check.removeAttribute('checked', true);
                item.classList.remove('checked');
                totalItems--;
            }

            if (totalItems < 2) {
                buttonCompare.setAttribute('disabled', 'disabled');
                return
            }{
                buttonCompare.removeAttribute('disabled');
            }
        })
    })

    compareElements();

    if (totalItems < 2) {
        buttonCompare.setAttribute('disabled', 'disabled');
        return
    }{
        buttonCompare.removeAttribute('disabled');
    }
}

function compareElements() {
    const buttonCompare = document.querySelector('.header__btn');
    const elements = document.querySelectorAll('.checked');
    const closeBtn = document.querySelector('.popup__close');

    buttonCompare.addEventListener('click', _=> {
        const elements = document.querySelectorAll('.checked');
        const popup = document.querySelector('.popup');
        popup.classList.add('popup__active');

        elements.forEach(elem => {
            const check = elem.querySelector('.product__checkbox');
            const info = elem.cloneNode(true);

            elem.classList.add('product__compare');
            popup.appendChild(info);
            closeBtn.addEventListener('click', _=> {
                while (info.firstChild) {
                    info.removeChild(info.firstChild);
                }
            })

        })
    })

    closePopoup(closeBtn);
}

function closePopoup(closeBtn) {
    const popup = document.querySelector('.popup');
    const elements = document.querySelectorAll('.checked');

    closeBtn.addEventListener('click', _=> {
        popup.classList.remove('popup__active');
    })
}

function searchProduct(product) {
    const inputSearch = document.querySelector('.products__input');

    inputSearch.onkeydown = function() {
        const productElem = document.querySelectorAll('.product__elem');
        const filter = inputSearch.value.toUpperCase();

        productElem.forEach(elem=> {
            if(elem.innerHTML.toUpperCase().indexOf(filter) > -1) {
                elem.style.display = '';
                return
            } {
                elem.style.display = 'none';
            }
        })
    }
}