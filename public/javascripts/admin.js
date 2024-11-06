
$(".botonAceptar").on("click", function(){
    let id = $(this).attr('data-id');
    $.ajax({
        url: "/admin/acceptRequest",
        method: "POST",
        data: {id}
    })
    $(this).closest(".container").remove();   

});

$(".botonEliminar").on("click", function(){
    let id = $(this).attr('data-id');
    $.ajax({
        url: "/admin/dropRequest",
        method: "POST",
        data: {id}
    })
    $(this).closest(".container").remove();   

});

// ROLES
$(".adminSwitch").on("change", function(){
    let id= $(this).attr('data-id');
    $.ajax({
        url: "/admin/changeRols",
        method: "POST",
        data: {id}
    })
    $(this).closest(".container").remove();
})


