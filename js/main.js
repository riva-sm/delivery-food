const shoppingCart = document.querySelector('#shopping-cart');
const modal = document.querySelector('.modal');
const close = document.querySelector('.close');

shoppingCart.addEventListener('click', toggleModal);
close.addEventListener('click', toggleModal);

function toggleModal() {
    modal.classList.toggle('is-open');
}

new WOW().init();