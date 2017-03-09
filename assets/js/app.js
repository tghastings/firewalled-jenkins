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
    return '';
}
// END COOKIE Information
function divConsoleAlert(type, jumbo, content) {
    // alert-success, alert-info, alert-warning, alert-danger
    $('#management-alert').removeClass('alert-success').removeClass('alert-info').removeClass('alert-warning').removeClass('alert-danger');
    $('#management-alert').addClass(type);
    $('#management-alert').fadeIn(1000);
    $('#alert-content').html('<strong>'+jumbo+'</strong> '+ content);
}
function consoleAjaxCmd(method, resturl, ajaxdata, success_call) {
     $.ajax({
        type: method,
        url: resturl,
        data: ajaxdata,
        success: success_call,
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            divConsoleAlert('alert-danger', textStatus.toUpperCase()+': ', errorThrown);
         }
    });
}
function divState(page_display) {
    $('#console-wrapper').children().hide()
    switch(page_display) {
        case 'set':
            $('#set-secret').show();
            break;
        case 'provide':
            $('#provide-secret').show();
            break;
        case 'jenkins-hosts':
            $('#jenkins-hosts').show(getUsersJenkinsAPIs());
            break;
    }
}
// GET USER Information
function getUsername() {
    return getCookie('username');
}
// END USER Information
// MAIN
// Check State onload
function checkState() {
    var success = function (msg, status, jqXHR) {
        if (msg.auth == 'true') {
            if (msg.hasKey == 'true') {
                // Lets see if they've already provided a key
                if (getCookie('stored_key') !== '') {
                    divState('jenkins-hosts')
                    // User has a key and it's been stored so lets allow them access to jenkins api
                } else {
                // The user has a key so but has not set it so display page to set the key
                    divState('provide')
                }
            } else {
            // The user has to set a secret key. Show page to set key
                divState('set')
            }
        }
    }
    consoleAjaxCmd('GET', '/session/validate/', '', success)
}


// HIDE ALERTS
$('#close-alert').click(function() {
    $(this).parent().fadeOut(1000);
});


// LOGIN PAGE
if (getUsername()) {
    $('#nav-logout').removeClass('disabled').removeAttr('disabled');
} else {
    $('#nav-logout').addClass('disabled').attr('disabled', true);
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
        var success = function (msg, status, jqXHR) {
            divConsoleAlert('alert-success', 'SUCCESS: ', msg.notice);
        }
        consoleAjaxCmd('POST','/user/secret','secretKey='+secretKey, success);
        divState('provide')
    } else {
        divConsoleAlert('alert-danger', 'ERROR:', 'The keys do not match.');
    }
});

// provide-SECRET
$('#provide-secret-key-form').submit(function(e) {
    e.preventDefault();
    var secretKey = $('#provide-secret-key-input').val();
    var success = function (msg, status, jqXHR) {
        if (msg.notice == 'true') {
            divConsoleAlert('alert-success', 'SUCCESS:', 'You know your key!');
            divState('jenkins-hosts');
        } else {
            divConsoleAlert('alert-danger', 'ERROR:', 'You dont know your key!');
        }
    }
    consoleAjaxCmd('POST','/user/secret/check','secretKey='+secretKey, success);
});

// ADD-JENKINS-HOST
$('#add-jenkins-api-form').submit(function(e) {
    e.preventDefault();
    var formData = $(this).serialize();
    var success = function (msg, status, jqXHR) {
        divConsoleAlert('alert-success', 'SUCCESS: ', 'Jenkins host has been added');
        getUsersJenkinsAPIs();
    }
    consoleAjaxCmd('POST','/jenkins/create',formData, success);
    this.reset();
});

// GET-JENKINS-HOSTS
function getUsersJenkinsAPIs() {
    var success = function (msg, status, jqXHR) {
        var user_apis = msg.user[0].apis;
        if (user_apis.length > 0) {
            var template = '';
            for (var i in user_apis.reverse()) {
                var api = user_apis[i];
                template += '<li id="'+ api.id +'">'+ api.url +'<ul class="jenkins-host-list-options"><li>Connect</li><li>Destroy</li></ul></li>'
            }
            $('#list-apis-jenkins').html(template);
        } else {
            $('#jenkins-host-verbiage').append('You haven\'t added any hosts. Please add one using the form');
        }
    }
    consoleAjaxCmd('GET','/jenkins','', success);
}