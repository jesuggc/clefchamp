$(".svgIcons").on("click", function(){
  $("#exampleModal").modal("show")
})

$(".iconBtn").on("click", function(){
  console.log(this.getAttribute("data-id"))
})