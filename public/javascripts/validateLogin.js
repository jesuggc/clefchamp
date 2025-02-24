$("#login").on("click", function(e) {
    e.preventDefault()
    var email = $('#email').val();
    var password = $('#password').val();
    $("#email").removeClass("is-invalid")
    $("#password").removeClass("is-invalid")  
    $("#invalidMessage").attr("hidden",true)
    
    $.ajax({
        url: "/users/checkEmailOrTagname",
        type: "GET",
        data: {email,email},
        success: function(response) {
            if(response.existe === false) $("#email").addClass("is-invalid")
            else {
                $.ajax({
                    url: "/users/login",
                    type: "POST",
                    data: {email,password},
                    success: function(response) {
                        if (response.existe === false) {
                            $("#invalidMessage").attr("hidden",false)
                            $("#password").addClass("is-invalid")
                        }
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

$("#email").on("click", function() {
    $("#email").removeClass("is-invalid")  
})
$("#password").on("click", function() {
    $("#password").removeClass("is-invalid")  
    $("#invalidMessage").attr("hidden",true)
})
