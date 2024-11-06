$("#login").on("click", function(e) {
    e.preventDefault()
    var email = $('#email').val();
    var password = $('#password').val();
    $('#wrongMail').remove();
    $('#wrongPass').remove();
    
    $.ajax({
        url: "/users/checkEmailOrTagname",
        type: "GET",
        data: {email,email},
        success: function(response) {
            if(response.existe === false) $("#emailContainer").append(`<p id="wrongMail" class="red">Correo no existente</p>`)
            else {
                $.ajax({
                    url: "/users/login",
                    type: "POST",
                    data: {email,password},
                    success: function(response) {
                        if (response === false) $("#passContainer").append(`<p id="wrongPass" class="red">Contraseña incorrecta</p>`)
                        else window.location.href = "/"
                    }
                })
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    })
})
