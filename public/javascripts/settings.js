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
  $("#confirmBtn").attr("disabled",true)
})

$("#confirmBtn").on("click", function() {
  fetch("/users/logout", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(response => {
    window.location.href = "/";
  })
  .catch(error => {
      console.error("Error logging out:", error);
  });
})
