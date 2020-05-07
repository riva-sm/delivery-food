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

const valid = function (str) {
    const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
    return nameReg.test(str);
};
valid();



function toggleModal() {
    modal.classList.toggle('is-open');
}


function toggleModalAuth(callback) {
    loginInput.style.borderColor = '';
    modalAuth.classList.toggle('is-open');
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
function createCardRestaurant() {
    // получаем разметку карточки ресторана
    const card = `
        <a href="restaurant.html" class="card card-restaurant wow fadeInUp" data-wow-delay="0.2s">
        <img src="img/img1.jpg" alt="Пицца плюс" class="card-img">
            <div class="card-text">
                <div class="card-heading">
                <h3 class="card-title">Пицца плюс</h3>
                <span class="card-tag tag">50 мин</span>
            </div>
            <div class="card-info">
                <div class="rating">
                    <img src="img/star.svg" alt="star" class="rating-star">4.5</div>
                <div class="price">От 900 ₽</div>
                <div class="category">Пицца</div>
            </div>
            </div>
        </a>
    `;

    cardsRestaurants.insertAdjacentHTML('beforeend', card);


};



// создаем карточку товара
function createCardGood() {
    const card = document.createElement('div');
    card.className = 'card';
    card.insertAdjacentHTML('beforeend', `

            <img src="img/restaurants/tanuki/image2.png" alt="Окинава стандарт" class="card-img rest-img" />
            <div class="card-text">
            <div class="card-heading">
                <h3 class="card-title card-title-reg">Окинава стандарт</h3>
            </div>
            <div class="card-info">
                <div class="ingredients">
                Рис, креветка отварная, сыр сливочный, лосось, огурец
                свежий...
                </div>
            </div>
            <div class="card-buttons">
                <button class="button button-primary">
                <span class="button-card-text">В корзину</span>
                <img src="img/cart-white.svg" alt="cart" class="button-card-img" />
                </button>
                <strong class="card-price-bold">250 ₽</strong>
            </div>
            </div>
    `);

    cardsMenu.insertAdjacentElement('beforeend', card);

}


// открываем страницу ресторана
function openGoods(event) {
    event.preventDefault();
    const target = event.target;

    const restaurant = target.closest('.card-restaurant');
    if (restaurant) {
        // если пользователь неавторизован, открывается окно авторизации
        if (login) {
            cardsMenu.textContent = ''; // очищаем карточки
            containerPromo.classList.add('hide');
            restaurants.classList.add('hide');
            menu.classList.remove('hide');
            createCardGood();
            createCardGood();
            createCardGood();
            createCardGood();
        } else {
            toggleModalAuth();
        }
    }



};


shoppingCart.addEventListener('click', toggleModal);

close.addEventListener('click', toggleModal);

cardsRestaurants.addEventListener('click', openGoods);

// logo.addEventListener('click', returnMain);

logo.addEventListener('click', function () {
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
});

createCardRestaurant();
createCardRestaurant();
createCardRestaurant();

new Swiper('.swiper-container', {
    loop: true,
    autoplay: {
        delay: 3000,
    },
    sliderPerView: 1,
    slidesPerColumn: 1,


});