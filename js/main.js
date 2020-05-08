'use-strict';

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
    cardsMenu = document.querySelector('.cards-menu');

let login = localStorage.getItem('gloDelivery');

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
        localStorage.removeItem('gloDelivery');


        buttonAuth.style.display = '';
        userName.style.display = '';
        buttonOut.style.display = '';
        buttonOut.removeEventListener('click', logOut);

        checkAuth();
        // returnMain();

    };

    console.log('Авторизован');

    userName.textContent = login;

    buttonAuth.style.display = 'none';
    userName.style.display = 'inline';
    buttonOut.style.display = 'block';

    buttonOut.addEventListener('click', logOut);

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


    // получаем разметку карточки ресторана
    const card = `
        <a class="card card-restaurant wow fadeInUp" data-wow-delay="0.2s" data-products="${products}">
        <img src="${image}" alt="Тануки" class="card-img">
            <div class="card-text">
                <div class="card-heading">
                <h3 class="card-title">${name}</h3>
                <span class="card-tag tag">${timeOfDelivery} мин</span>
            </div>
            <div class="card-info">
                <div class="rating">
                    <img src="img/star.svg" alt="star" class="rating-star">${stars}</div>
                <div class="price">От ${price} ₽</div>
                <div class="category">${kitchen}</div>
            </div>
            </div>
        </a>
    `;

    cardsRestaurants.insertAdjacentHTML('beforeend', card);


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

            <img src="${image}" alt="Окинава стандарт" class="card-img rest-img" />
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
                <span class="button-card-text">В корзину</span>
                <img src="img/cart-white.svg" alt="cart" class="button-card-img" />
                </button>
                <strong class="card-price-bold">${price} ₽</strong>
            </div>
            </div>
    `);

    cardsMenu.insertAdjacentElement('beforeend', card);

}


// открываем страницу ресторана
function openGoods(event) {
    const target = event.target;

    const restaurant = target.closest('.card-restaurant');
    if (login) {
        // если пользователь неавторизован, открывается окно авторизации
        if (restaurant) {

            console.log(restaurant.dataset.products);


            cardsMenu.textContent = ''; // очищаем карточки
            containerPromo.classList.add('hide'); // скрываем промо
            restaurants.classList.add('hide'); // скрываем рестораны
            menu.classList.remove('hide'); // открываем меню

            getData(`./db/${restaurant.dataset.products}`).then(function (data) {
                data.forEach(createCardGood); // генерируем карточки ресторанов
            });

        } else {
            toggleModalAuth();
        }
    }



};

function init() {
    getData('./db/partners.json').then(function (data) {
        data.forEach(createCardRestaurant); // генерируем карточки ресторанов
    });

    shoppingCart.addEventListener('click', toggleModal);

    close.addEventListener('click', toggleModal);

    cardsRestaurants.addEventListener('click', openGoods);

    logo.addEventListener('click', returnMain);


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