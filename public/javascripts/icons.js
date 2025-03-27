$(function() {
  $("#exampleModal").modal("show")
})
$(".svgIcons").on("click", function(){
  $("#exampleModal").modal("show")
})

$(".iconBtn").on("click", function(){
  console.log(this.getAttribute("data-id"));
  let img = $(this).find("img").attr("src");
  $("#selectionIcon").attr("src", img); // O $(this).attr("src")
});


$("#selectionColor").on("change", function(){
  $("#selectionBg").css("background-color",$("#selectionColor").val())
})
$("#saveBtn").on("click", function(){
  console.log("Imagen: ", $("#selectionIcon").attr("src"))
  console.log("Color: ", $("#selectionColor").val())
//     try {
//         const response = await fetch('/users/api/getLocals');
//         const data = await response.json();
//         this.userData.locals = data.locals;
//     } catch (error) {
//         console.error('Error:', error);
//     }
})
