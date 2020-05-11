'use-strict';

//  4 урок 09:36

const shoppingCart = document.querySelector('#shopping-cart'),
    modal = document.querySelector('.modal'),
    close = document.querySelector('.close'),
    buttonAuth = document.querySelector('.button-auth'),
    modalAuth = document.querySelector('.modal-auth'),
    closeAuth = document.querySelector('.close-auth'),
    logInForm = document.querySelector('#logInForm'),
    loginInput = document.querySelector('#login'),
    userName = document.querySelector('.user-name'),
    buttonOut = document.querySelector('.button-out'),
    cardsRestaurants = document.querySelector('.cards-restaurants'),
    containerPromo = document.querySelector('.container-promo'),
    restaurants = document.querySelector('.restaurants'),
    menu = document.querySelector('.menu'),
    logo = document.querySelector('.logo'),
    cardsMenu = document.querySelector('.cards-menu'),
    restaurantTitle = document.querySelector('.restaurant-title'),
    rating = document.querySelector('.rating'),
    minPrice = document.querySelector('.price'),
    category = document.querySelector('.category'),
    searchInput = document.querySelector('.search-input'),
    modalBody = document.querySelector('.modal-body'),
    modalPrice = document.querySelector('.modal-pricetag'),
    buttonClearCart = document.querySelector('.button-clear-cart');


let login = localStorage.getItem('gloDelivery');

const cart = [];

const loadCart = function () {
    if (localStorage.getItem(login)) {
        JSON.parse(localStorage.getItem(login)).forEach(function (item) {
            cart.push(item);
        });
    }

};



const saveCart = function () {
    localStorage.setItem(login, JSON.stringify(cart));
};

const getData = async function (url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Ошибка по адресу ${url}, 
            статус ошибки ${response.status}!`);
    }

    return await response.json();

};


const valid = function (str) {
    const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
    return nameReg.test(str);
};
valid();



const toggleModal = function () {
    modal.classList.toggle('is-open');
}


const toggleModalAuth = function (callback) {
    loginInput.style.borderColor = '';
    modalAuth.classList.toggle('is-open');
}

function returnMain() {
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
}

function authorized() {

    function logOut() {
        login = null;
        cart.length = 0;
        localStorage.removeItem('gloDelivery');
        buttonAuth.style.display = '';
        userName.style.display = '';
        buttonOut.style.display = '';
        shoppingCart.style.display = '';
        buttonOut.removeEventListener('click', logOut);

        checkAuth();
        returnMain();

    };

    console.log('Авторизован');
    userName.textContent = login;
    buttonAuth.style.display = 'none';
    userName.style.display = 'inline';
    buttonOut.style.display = 'flex';
    shoppingCart.style.display = 'flex';
    buttonOut.addEventListener('click', logOut);
    loadCart();

};

function notAuthorized() {
    console.log('Не авторизован');

    // авторизация пользователя
    function logIn(event) {
        event.preventDefault(); // отменяем перезагрузку страницы
        if (valid(loginInput.value.trim())) {
            login = loginInput.value; // получаем введенный логин и сохраняем в переменную

            localStorage.setItem('gloDelivery', login);

            toggleModalAuth();
            buttonAuth.removeEventListener('click', toggleModalAuth);
            closeAuth.removeEventListener('click', toggleModalAuth);
            logInForm.removeEventListener('submit', logIn);
            logInForm.reset(); // очищаем поля ввода
            checkAuth(); // проверка авторизации пользователя
            returnMain();
        } else {
            loginInput.style.borderColor = 'red';
            loginInput.value = '';
        }

    };

    buttonAuth.addEventListener('click', toggleModalAuth);
    closeAuth.addEventListener('click', toggleModalAuth);
    logInForm.addEventListener('submit', logIn);

};

function checkAuth() {
    if (login) {
        authorized();
    } else {
        notAuthorized();
    }
};

checkAuth();

// создаем карточку ресторана
function createCardRestaurant({
    image,
    kitchen,
    name,
    price,
    products,
    stars,
    time_of_delivery: timeOfDelivery
}) {

    const card = document.createElement('a');
    card.className = 'card card-restaurant wow fadeInUp';
    card.products = products;
    card.info = [name, price, stars, kitchen];

    // получаем разметку карточки ресторана
    card.insertAdjacentHTML('beforeend', `
        <img src="${image}" alt="${name}" class="card-img">
            <div class="card-text">
                <div class="card-heading">
                <h3 class="card-title">${name}</h3>
                <span class="card-tag tag">${timeOfDelivery} мин</span>
            </div>
            <div class="card-info">
                <div class="rating">
                    ${stars}</div>
                <div class="price">От ${price} ₽</div>
                <div class="category">${kitchen}</div>
            </div>
            </div>
    `);


    cardsRestaurants.insertAdjacentElement('beforeend', card);


};



// создаем карточку товара
function createCardGood({
    description,
    id,
    image,
    name,
    price
}) {

    const card = document.createElement('div');
    card.className = 'card';
    card.insertAdjacentHTML('beforeend', `

            <img src="${image}" alt="${name}" class="card-img rest-img" />
            <div class="card-text">
            <div class="card-heading">
                <h3 class="card-title card-title-reg">${name}</h3>
            </div>
            <div class="card-info">
                <div class="ingredients">
                ${description}
                </div>
            </div>
            <div class="card-buttons">
                <button class="button button-primary">
                <span class="button-card-text button-add-cart" id="${id}">В корзину</span>
                <img src="img/cart-white.svg" alt="cart" class="button-card-img" />
                </button>
                <strong class="card-price card-price-bold">${price} ₽</strong>
            </div>
            </div>
    `);

    cardsMenu.insertAdjacentElement('beforeend', card);

}


// открываем меню ресторана
function openGoods(event) {
    const target = event.target;


    if (login) {
        const restaurant = target.closest('.card-restaurant');

        if (restaurant) {

            const [name, price, stars, kitchen] = restaurant.info;

            cardsMenu.textContent = ''; // очищаем карточки
            containerPromo.classList.add('hide'); // скрываем промо
            restaurants.classList.add('hide'); // скрываем рестораны
            menu.classList.remove('hide'); // открываем меню

            restaurantTitle.textContent = name;
            rating.textContent = stars;
            minPrice.textContent = `От ${price} ₽`;
            category.textContent = kitchen;

            getData(`./db/${restaurant.products}`).then(function (data) {
                data.forEach(createCardGood); // генерируем карточки ресторанов
            });

        } else {
            toggleModalAuth(); // если пользователь неавторизован, открывается окно авторизации
        }
    }



};

function addToCart(event) {
    const target = event.target;

    const buttonAddToCart = target.closest('.button-add-cart');
    if (buttonAddToCart) {
        const card = target.closest('.card');
        const title = card.querySelector('.card-title-reg').textContent;
        const cost = card.querySelector('.card-price').textContent;
        const id = buttonAddToCart.id;

        const food = cart.find(function (item) {
            return item.id === id;
        });

        if (food) {
            food.count += 1;
        } else {
            cart.push({
                id,
                title,
                cost,
                count: 1
            });
        }

    }

    saveCart();

};

function renderCart() {
    modalBody.textContent = ''; // очищаем содержимое корзины
    cart.forEach(function ({
        id,
        title,
        cost,
        count
    }) {
        const itemCart = `
            <div class="food-row">
                <span class="food-name">${title}</span>
                <strong class="food-price">${cost}</strong>
                <div class="food-counter">
                <button class="counter-button counter-minus" data-id=${id}>-</button>
                <span class="count">${count}</span>
                <button class="counter-button counter-plus" data-id=${id}>+</button>
                </div>
            </div>
        `;
        modalBody.insertAdjacentHTML('afterbegin', itemCart);
    });
    const totalPrice = cart.reduce(function (result, item) {
        return result + (parseFloat(item.cost) * item.count);
    }, 0);
    modalPrice.textContent = totalPrice + ' ₽';
};

function changeCount(event) {
    const target = event.target;
    if (target.classList.contains('counter-button')) {
        const food = cart.find(function (item) {
            return item.id === target.dataset.id;
        });
        if (target.classList.contains('counter-minus')) {
            food.count--;
            if (food.count === 0) {
                cart.splice(cart.indexOf(food), 1);
            }
        };

        if (target.classList.contains('counter-plus')) food.count++;

        renderCart();
    }
    saveCart();

};

function init() {
    getData('./db/partners.json').then(function (data) {
        data.forEach(createCardRestaurant); // генерируем карточки ресторанов
    });

    shoppingCart.addEventListener('click', function () {
        renderCart();
        toggleModal();
    });

    buttonClearCart.addEventListener('click', function () {
        cart.length = 0;
        renderCart();
    });

    modalBody.addEventListener('click', changeCount);
    cardsMenu.addEventListener('click', addToCart);

    close.addEventListener('click', toggleModal);

    cardsRestaurants.addEventListener('click', openGoods);

    logo.addEventListener('click', returnMain);

    searchInput.addEventListener('keydown', function (event) {
        if (event.keyCode === 13) {
            const target = event.target;
            const value = target.value.toLowerCase().trim();

            target.value = '';
            if (!value || value.length < 2) {
                target.style.backgroundColor = 'tomato';
                setTimeout(function () {
                    target.style.backgroundColor = '';
                }, 2000);
                return;
            }

            const goods = []; // все товары по поиску

            getData('./db/partners.json')
                .then(function (data) {
                    const products = data.map(function (item) {
                        return item.products;
                    });

                    products.forEach(function (product) {
                        getData(`./db/${product}`)
                            .then(function (data) {
                                goods.push(...data);

                                const searchGoods = goods.filter(function (item) {
                                    return item.name.toLowerCase().includes(value);
                                });
                                console.log(searchGoods);

                                cardsMenu.textContent = ''; // очищаем карточки
                                containerPromo.classList.add('hide'); // скрываем промо
                                restaurants.classList.add('hide'); // скрываем рестораны
                                menu.classList.remove('hide'); // открываем меню

                                restaurantTitle.textContent = 'Результат поиска';
                                rating.textContent = '';
                                minPrice.textContent = '';
                                category.textContent = '';

                                return searchGoods;

                            })
                            .then(function (data) {
                                data.forEach(createCardGood);
                            });
                    });


                });

        }

    });


    // слайдер
    new Swiper('.swiper-container', {
        loop: true,
        autoplay: {
            delay: 3000,
        },
        sliderPerView: 1,
        slidesPerColumn: 1,


    });
};
init();