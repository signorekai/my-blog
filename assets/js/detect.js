var el = document.querySelector('html');


if (el.classList) {
    el.classList.add('js');
    el.classList.remove('no-js');
} else {
    el.className = 'js';
}

var doc = document.documentElement;
doc.setAttribute('data-useragent', navigator.userAgent);
