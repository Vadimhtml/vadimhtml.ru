$(window).load(function () {
    $('.bodyMain__tagLine')
        .on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $(this).removeClass('flip');
        })
        .click(function () {
            $('.bodyMain__tagLine').addClass('flip').css('color', '#'+Math.floor(Math.random()*16777215).toString(16));
        })
        .addClass('flip');
});
