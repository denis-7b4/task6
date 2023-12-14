// Вставляет текущий год в копирайт
document.getElementById('year').innerHTML = new Date().getFullYear();

// Делает плавную прокрутку по ссылкам внутри страницы
document.querySelectorAll('a[href^="#"').forEach(link => {

    link.addEventListener('click', function(e) {
        e.preventDefault();

        let href = this.getAttribute('href').substring(1);

        const scrollTarget = document.getElementById(href);

        const topOffset = document.querySelector('.navbar').offsetHeight;
        // const topOffset = 0; // если не нужен отступ сверху 
        const elementPosition = scrollTarget.getBoundingClientRect().top;
        const offsetPosition = elementPosition - topOffset;

        window.scrollBy({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});

// Модальное окно
var open_modal = document.querySelectorAll(".open_modal");
var close_modal = document.getElementById("close_modal");
var modal = document.getElementById("modal");
var body = document.getElementsByTagName("body")[0];
for (var i = 0; i < open_modal.length; i++) {
    open_modal[i].onclick = function() {
        modal.classList.add("modal_vis");
        modal.classList.remove("bounceOutDown");
        body.classList.add("body_block");
    }
}
close_modal.onclick = function () {
    modal.classList.add("bounceOutDown");
    window.setTimeout(function () {
        modal.classList.remove("modal_vis");
        body.classList.remove("body_block");
    })
};
//