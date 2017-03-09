// START Cookie Information
function setCookie(cname, cvalue, exdays) {
    // cname=username cvalue=myusername exdays=#ofdays
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function checkCookie(cookieName) {
    var cookie = getCookie(cookieName);
    if (cookie != "") {
        return true;
    } else {
        return false;
    }
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
// END COOKIE Information
// GET USER Information
function getUsername() {
    return getCookie('username');
}
// END USER Information

// MAIN
function divAlert(type, jumbo, content) {
    // alert-success, alert-info, alert-warning, alert-danger
    $('#management-alert').removeClass('alert-success').removeClass('alert-info').removeClass('alert-warning').removeClass('alert-danger');
    $('#management-alert').addClass(type);
    $('#management-alert').fadeIn(1000);
    $('#alert-content').html('<strong>'+jumbo+'</strong> '+ content);

    setTimeout(function(){
        $('#management-alert').fadeOut(1000);
    }, 7000);
}

// HIDE ALERTS
$('#close-alert').click(function() {
    $(this).parent().fadeOut(1000);
});


// LOGIN PAGE
if (getUsername()) {
    $('#nav-logout').removeClass('disabled');
} else {
    $('#nav-logout').addClass('disabled').attr('disabled');
}

$('#loginForm').submit(function(e) {
    e.preventDefault();
    var formData = $(this).serialize();
    $.ajax({
        type: "POST",
        url: "/user/create",
        data: formData,
        success: function (msg, status, jqXHR) {
            location.href = '/'
        },
         error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert("Status: " + textStatus); alert("Error: " + errorThrown);
         }
    });
});

// HOME PAGE
$('#h1-welcome-username').html(decodeURIComponent(getUsername()));

// SET-SECRET
$('#set-secret-key-form').submit(function(e) {
    e.preventDefault();
    var secretKey = $('#secret-key').val();
    var secretKeyConfirm = $('#secret-key-confirm').val();

    if (secretKey == secretKeyConfirm) {
        divAlert('alert-success', 'Yay!', 'The keys match');
    } else {
        divAlert('alert-danger', 'Opps!', 'The keys do not match');
    }
});