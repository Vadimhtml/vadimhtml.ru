var easters = 0;

$(window).on("load", function (e) {

    var tag_lines = $('.bodyMain__tagLine');

    function egg() {
        tag_lines.each(function () {
            var inner_text = this.innerText;
            inner_text = inner_text.split('').map(function (s) {
                return '<span style="animation: rainbow ' + (Math.random() * 5000).toString() + 'ms infinite">' + s + '</span>';
            }).join('');
            this.innerHTML = inner_text;
        });
    }

    tag_lines
        .on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $(this).removeClass('flip');
        })
        .click(function () {
            $('.bodyMain__tagLine').addClass('flip').css('color', '#' + Math.floor(Math.random() * 16777215).toString(16));
            if (++easters > 5) {
                egg();
            }
        })
        .addClass('flip');
});
