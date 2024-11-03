function show() {
    document.querySelector('.hamburger').classList.toggle('open');
    document.querySelector('.side-menu').classList.toggle('active');

}

document.addEventListener('click', function(event) {
    const isClickInsideMenu = document.querySelector('.side-menu').contains(event.target);
    const isClickOnHamburger = document.querySelector('.hamburger').contains(event.target);

    if (!isClickInsideMenu && !isClickOnHamburger) {
        document.querySelector('.hamburger').classList.remove('open');
        document.querySelector('.side-menu').classList.remove('active');
    }
});