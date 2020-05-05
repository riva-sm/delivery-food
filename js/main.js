const shoppingCart = document.querySelector('#shopping-cart');
const modal = document.querySelector('.modal');
const close = document.querySelector('.close');

shoppingCart.addEventListener('click', toggleModal);
close.addEventListener('click', toggleModal);

function toggleModal() {
    modal.classList.toggle('is-open');
}

new WOW().init();

//

const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');

let login = localStorage.getItem('gloDelivery');

function toggleModalAuth() {
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

    function logIn(event) {
        event.preventDefault(); // отменяем перезагрузку страницы
        login = loginInput.value; // получаем введенный логин и сохраняем в перменную

        localStorage.setItem('gloDelivery', login);

        toggleModalAuth();
        buttonAuth.removeEventListener('click', toggleModalAuth);
        closeAuth.removeEventListener('click', toggleModalAuth);
        logInForm.removeEventListener('submit', logIn);
        logInForm.reset(); // очищаем поля ввода
        checkAuth(); // проверка авторизации пользователя



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