$(document).ready(function () {
    $('.minus').click(function() {
        if(parseInt($('.number').text()) > 0) {
            $('.number').text(parseInt($('.number').text()) - 1)
        }
    })
    $('.plus').click(function() {
        $('.number').text(parseInt($('.number').text()) + 1)
    })
  });