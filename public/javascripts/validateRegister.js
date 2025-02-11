
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

$("#confirmPassword").on("keyup", () => {
    $("#errorConfirm").remove()
    let password = $("#password").val()
    let confirmPassword = $("#confirmPassword").val()
    
    passwordCheckBool = password === confirmPassword
    if(password !== confirmPassword) $("#confirmContainer").append(`<p class="red" id="errorConfirm">Las contraseñas deben coincidir</p>`)
    else $("#errorConfirm").remove()
        
})

$("#password").on("keyup", () => {
    $("#capitalCheck").remove()
    $("#sizeCheck").remove()
    $("#specialCheck").remove()
    $("#numberCheck").remove()

    if(!capitalCheck.test($("#password").val()) === true) $("#passContainer").append(`<li class="red" id="capitalCheck">Debe contener una mayuscula</li>`)
    else $("#capitalCheck").remove()

    if(!sizeCheck.test($("#password").val()) === true) $("#passContainer").append(`<li class="red" id="sizeCheck">Debe contener 8 caracteres</li>`)
    else $("#sizeCheck").remove()

    if(!specialCheck.test($("#password").val()) === true) $("#passContainer").append(`<li class="red" id="specialCheck">Debe contener 1 caracter especial</li>`)
    else $("#specialCheck").remove()

    if(!numberCheck.test($("#password").val()) === true) $("#passContainer").append(`<li class="red" id="numberCheck">Debe contener 1 número</li>`)
    else $("#numberCheck").remove()

    passwordBool = allCheck.test($("#password").val())
})

$("#email").on("keyup", () => {
    let emailCheck = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    $("#errorEmail").remove()
    $("#wrongMail").remove()
    emailBool = emailCheck.test($("#email").val())

    if(emailCheck.test($("#email").val()) === false) $("#emailContainer").append(`<p class="red" id="errorEmail">Dirección de correo no válida</p>`)
    else $("#errorEmail").remove()
})

$("#name").on("keyup",()=>{

    $("#letterCheck").remove()
    $("#letterSizeCheck").remove()

    nombreBool = nameLikeCheck.test($("#name").val()) && nameLikeSizeCheck.test($("#name").val()) 
   
    if(nameLikeCheck.test($("#name").val()) === false ) $("#nameContainer").append(`<p class="red" id="letterCheck">Solo puede contener letras</p>`)
    else $("#letterCheck").remove()

    if(nameLikeSizeCheck.test($("#name").val()) === false ) $("#nameContainer").append(`<p class="red" id="letterSizeCheck">Nombre demasiado corto</p>`)
    else $("#letterSizeCheck").remove()

})

$("#tagname").on("keyup",() => {

    tagnameBool = specialCheck.test($("#tagname").val())
    
    if(tagnameBool === true) {
        $("#wrongTagname").remove()
        $("#tagnameContainer").append(`<p id="wrongTagname" class="red">No puede contener caracteres especiales</p>`)
        $("#correctTagname").remove()
        $("#wrongTagname2").remove()
    }
    else {
        
        let tagname = $("#tagname").val().trim()
        $.ajax({
            url: "/users/checkTagname",
            type: "GET",
            data: { tagname },
            success: function(response) {
                $("#correctTagname").remove()
                $("#wrongTagname2").remove()
                $("#wrongTagname").remove()
                tagnameBool = response.valido
                if(response.valido === false) $("#tagnameContainer").append(`<p id="wrongTagname2" class="red">Ese alias ya está en uso</p>`)
                else $("#tagnameContainer").append(`<p id="correctTagname" class="green">Alias disponible</p>`)
                

            }, error: function(jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            }
        })
    }

})

$('#myForm input, #myForm select').on('change', function() {
    if(nombreBool && passwordBool && passwordCheckBool && emailBool ) $('#register').prop('disabled', false);
    else $('#register').prop('disabled', true);
});


$("#register").on("click", () => {
    console.log("Estoy en register")
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
            if(response.valido === false) $("#emailContainer").append(`<p id="wrongMail" class="red">Correo ya existente</p>`)
            else {  
                $.ajax({
                    url: "/users/register",
                    type: "POST",
                    data: user,
                    success: function(response) {
                        $("#modalLaunch").trigger("click")
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

// Deshabilitar la funcionalidad de copiar
formulario.addEventListener("copy", function (e) {
    e.preventDefault();
});

// Deshabilitar la funcionalidad de pegar
formulario.addEventListener("paste", function (e) {
    e.preventDefault();
});

// Deshabilitar la funcionalidad de cortar
formulario.addEventListener("cut", function (e) {
    e.preventDefault();
});
document.addEventListener('keydown', function (e) {
    // Desactivar pegar (Ctrl+V) y cortar (Ctrl+X)
    if (e.ctrlKey && (e.key === 'v' || e.key === 'V' || e.key === 'x' || e.key === 'X'|| e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
    }
});
$('#register').prop('disabled', false);