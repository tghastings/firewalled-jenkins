$('#loginForm').submit(function(e) {
    e.preventDefault();
    var formData = $(this).serialize();
    $.ajax({
        type: "POST",
        url: "/user/create",
        data: formData,
        success: function (msg, status, jqXHR) {
            alert(msg.notice);
        }
    });
});