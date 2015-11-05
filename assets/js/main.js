	$('.toggle-icon').each(function(el, i) {

        this.addEventListener('click', function() {
            $('#nav-container').toggleClass('pushed');
            $('nav').toggleClass('show');
            $('.header .container .text').toggleClass('hide');
        });
    });

    $('#nav-container').sticky({
        offsetTop: -20
    });
    $('#title').sticky({
        offsetTop: -230,
        setLeft: false
    });
    $('#post-title').sticky({
        offsetTop: 0,
        setLeft: false
    });

    $('.aside').magic({
        offsetTop: 500
    });

    $('article.summary').magic({
        offsetTop: 500,
        reverse: false,
        firstVisible: true
    });
