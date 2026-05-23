const inputField = document.getElementById('new-product-input');
const addButton = document.querySelector('.btn-add');
const productsList = document.querySelector('.products-list');

const remainingTagsContainer = document.querySelector('.remaining-tags');
const boughtTagsContainer = document.querySelector('.bought-tags');

// ДЕФОЛТНІ ТОВАРИ (якщо в localStorage немає даних, то беремо ці)
const defaultProducts = [
    { name: 'Помідори', quantity: 2, isBought: false },
    { name: 'Печиво', quantity: 2, isBought: false },
    { name: 'Сир', quantity: 1, isBought: false }
];

// БОНУС
let products = JSON.parse(localStorage.getItem('shoppingList')) || defaultProducts;

// БОНУС (зберігаємо стан при кожній зміні)
function saveToLocalStorage() {
    localStorage.setItem('shoppingList', JSON.stringify(products));
}

function renderProducts() {
    productsList.innerHTML = '';

    products.forEach((product, index) => {
        const li = document.createElement('li');
        li.className = 'product-item';
        
        if (product.isBought) {
            li.classList.add('bought');
        }

        const quantityControlsHtml = !product.isBought 
            ? `<div class="quantity-controls">
                <button class="btn-round btn-minus" data-index="${index}" ${product.quantity === 1 ? 'disabled' : ''}>−</button>
                <span class="quantity">${product.quantity}</span>
                <button class="btn-round btn-plus" data-index="${index}">+</button>
               </div>`
            : `<div class="quantity-controls">
                <span class="quantity">${product.quantity}</span>
               </div>`;

        const deleteButtonHtml = !product.isBought 
            ? `<button class="btn-delete" data-index="${index}">×</button>` 
            : '';

        li.innerHTML = `
            <span class="product-name ${product.isBought ? 'text-crossed' : ''}" data-index="${index}">${product.name}</span>
            ${quantityControlsHtml}
            <div class="action-buttons">
                <button class="btn-status" data-index="${index}">
                    ${product.isBought ? 'Куплено' : 'Не куплено'}
                </button>
                ${deleteButtonHtml}
            </div>
        `;
        
        productsList.appendChild(li);
    });

    initDeleteButtons();
    initStatusButtons();
    initEditNames();
    initQuantityControls();
    updateStatistics();
    
    // БОНУС (зберігаємо стан після кожного рендеру)
    saveToLocalStorage();
}

function updateStatistics() {
    remainingTagsContainer.innerHTML = '';
    boughtTagsContainer.innerHTML = '';

    products.forEach((product) => {
        const tag = document.createElement('span');
        tag.className = 'tag';
        if (product.isBought) {
            tag.classList.add('text-crossed');
        }
        tag.innerHTML = `${product.name} <span class="badge-count">${product.quantity}</span>`;

        if (product.isBought) {
            boughtTagsContainer.appendChild(tag);
        } else {
            remainingTagsContainer.appendChild(tag);
        }
    });
}

function initDeleteButtons() {
    document.querySelectorAll('.btn-delete').forEach((button) => {
        button.addEventListener('click', (event) => {
            const index = event.target.getAttribute('data-index');
            products.splice(index, 1);
            renderProducts();
        });
    });
}

function initStatusButtons() {
    document.querySelectorAll('.btn-status').forEach((button) => {
        button.addEventListener('click', (event) => {
            const index = event.target.getAttribute('data-index');
            products[index].isBought = !products[index].isBought;
            renderProducts();
        });
    });
}

function initEditNames() {
    document.querySelectorAll('.product-name').forEach((span) => {
        span.addEventListener('click', (event) => {
            const index = event.target.getAttribute('data-index');
            if (products[index].isBought) return;

            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'product-edit-input';
            input.value = products[index].name;

            span.replaceWith(input);
            input.focus();

            const saveChanges = () => {
                const newName = input.value.trim();
                if (newName !== '') {
                    products[index].name = newName;
                }
                renderProducts();
            };

            input.addEventListener('blur', saveChanges);
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    input.blur();
                }
            });
        });
    });
}

function initQuantityControls() {
    document.querySelectorAll('.btn-minus').forEach((button) => {
        button.addEventListener('click', (event) => {
            const index = event.target.getAttribute('data-index');
            if (products[index].quantity > 1) {
                products[index].quantity--;
                renderProducts();
            }
        });
    });

    document.querySelectorAll('.btn-plus').forEach((button) => {
        button.addEventListener('click', (event) => {
            const index = event.target.getAttribute('data-index');
            products[index].quantity++;
            renderProducts();
        });
    });
}

function handleAddProduct() {
    const productName = inputField.value.trim();
    if (productName === '') return;

    products.push({
        name: productName,
        quantity: 1,
        isBought: false
    });
    
    renderProducts();
    inputField.value = '';
    inputField.focus();
}

addButton.addEventListener('click', handleAddProduct);
inputField.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') handleAddProduct();
});

renderProducts();