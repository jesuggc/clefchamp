let deleteModal = new bootstrap.Modal($("#deleteModal"))

$("#confirmBtn").attr("disabled",true)

$("#textfield").on("input", function() {
  if($("#textfield").val() === "BORRAR CUENTA")$("#confirmBtn").removeAttr("disabled")
  else $("#confirmBtn").attr("disabled",true)
})

$("#deleteBtn").on("click", function() {
  deleteModal.show();
})

$("#cancelBtn").on("click", function() {
  deleteModal.hide();
  $("#textfield").val("")
  
})