
let nombreBool=false;
let emailBool=false;
let passwordBool=false;
let passwordCheckBool=false;
let tagnameBool=false;

let sizeCheck = /^.{8,}$/
let capitalCheck = /[A-ZÁÉÍÓÚ]/
let specialCheck = /[^a-zA-Z0-9]/
let numberCheck = /\d/
let nameLikeCheck = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/
let nameLikeSizeCheck = /^.{3,}$/
let allCheck = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/


$("#confirmPassword").on("input", () => {
    $("#confirmPassword").removeClass("is-invalid")
    $("#invalidConfirm").prop("hidden",true)

    let password = $("#password").val()
    let confirmPassword = $("#confirmPassword").val()
    
    passwordCheckBool = password === confirmPassword
    if(!passwordCheckBool) {
        $("#confirmPassword").addClass("is-invalid")
        $("#invalidConfirm").prop("hidden",false)
    } 
})

$("#password").on("input", () => {
    let $password = $("#password");
    let passwordVal = $password.val()
    $password.removeClass("is-invalid")
    $("#capitalCheck").prop("hidden",true)
    $("#sizeCheck").prop("hidden",true)
    $("#specialCheck").prop("hidden",true)
    $("#numberCheck").prop("hidden",true)

    if(capitalCheck.test(passwordVal) === false) $("#capitalCheck").prop("hidden",false)

    if(sizeCheck.test(passwordVal) === false) $("#sizeCheck").prop("hidden",false)

    if(specialCheck.test(passwordVal) === false) $("#specialCheck").prop("hidden",false)

    if(numberCheck.test(passwordVal) === false) $("#numberCheck").prop("hidden",false)

    passwordBool = allCheck.test(passwordVal)
    if(!passwordBool) $password.addClass("is-invalid")
})

$("#email").on("input", () => {
    let $email = $("#email")
    $email.removeClass("is-invalid")
    $("#existentCheck").prop("hidden",true)
    let emailVal = $email.val()
    let emailCheck = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    emailBool = emailCheck.test(emailVal)
    if(emailBool === false) $email.addClass("is-invalid")
})

$("#name").on("keyup",()=>{
    let $name = $("#name");
    let $nameCheck = $("#nameCheck");
    
    $name.removeClass("is-invalid");
    $nameCheck.text("");
    
    let nameValue = $name.val();
    let nameNoNumber = nameLikeCheck.test(nameValue);
    let nameEnoughSize = nameLikeSizeCheck.test(nameValue);
    
    nombreBool = nameEnoughSize && nameNoNumber;
    if (!nameEnoughSize) {
        $nameCheck.text("Nombre demasiado corto");
        $name.addClass("is-invalid");
    } else if (!nameNoNumber) {
        $nameCheck.text("Solo puede contener letras");
        $name.addClass("is-invalid");
    }
})

$("#tagname").on("keyup",() => {
    let $tagname = $("#tagname");
    $tagname.removeClass("is-invalid")
    $tagname.removeClass("is-valid")
    let $tagCheck = $("#tagCheck");
    let tagnameValue = $tagname.val();
    tagnameBool = !(specialCheck.test(tagnameValue))
    if(tagnameBool === false) {
        $tagname.addClass("is-invalid")
        $tagCheck.text("No puede contener caracteres especiales")
    }  
    else {
        let tagname = $("#tagname").val().trim()
        $.ajax({
            url: "/users/checkTagname",
            type: "GET",
            data: { tagname },
            success: function(response) {
                tagnameBool = response.valido
                if(tagnameBool===true) {
                    $tagname.addClass("is-valid")
                }
                else {
                    $tagname.addClass("is-invalid")
                    $tagCheck.text("Este alias ya está en uso")
                }

            }, error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            }
        })
    }
})

$('#myForm input, #myForm select').on('keyup', function() {
  $('#register').prop('disabled', !(nombreBool && tagnameBool&& passwordBool && passwordCheckBool && emailBool ));
});


$("#register").on("click", () => {
    let tagname = $("#tagname").val().trim()
    let email = $("#email").val()
    let password = $("#password").val()
    let name = $("#name").val()
    let friendCode = generarCodigo()
    
    let user = {
        tagname,
        email,  
        password,    
        name,
        friendCode
    }
    $.ajax({
        url: "/users/checkEmail",
        type: "GET",
        data: { email },
        success: function(response) {
            if(response.valido === false) $("#existentCheck").prop("hidden",false)
            else {  
                $.ajax({
                    url: "/users/register",
                    type: "POST",
                    data: user,
                    success: function(response) {
                        new bootstrap.Modal($("#registerModal")).show()
                    }
                })
            }

        }, error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    })
})

function generarCodigo() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = '#';
    for (let i = 0; i < 9; i++) {
        const randomIndex = Math.floor(Math.random() * caracteres.length);
        codigo += caracteres[randomIndex];
    }
    return codigo;
  }

var formulario = document.getElementById("myForm");

formulario.addEventListener("copy", function (e) {
    e.preventDefault();
});

formulario.addEventListener("paste", function (e) {
    e.preventDefault();
});

formulario.addEventListener("cut", function (e) {
    e.preventDefault();
});
document.addEventListener('keydown', function (e) {
    if (e.ctrlKey && (e.key === 'v' || e.key === 'V' || e.key === 'x' || e.key === 'X'|| e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
    }
});

$('#register').prop('disabled', true);