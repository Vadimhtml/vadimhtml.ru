$(window).load(function () {
    $('.bodyMain__tagLine')
        .on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $(this).removeClass('flip');
        })
        .click(function () {
            $('.bodyMain__tagLine').addClass('flip');
        })
        .addClass('flip');
});