$("#easyBtn").addClass("bg-10");
$("#easyBtn").on("click", function() {
  $(".easyDiv").prop('hidden', false);
  $(".normalDiv").prop('hidden', true);
  $(".hardDiv").prop('hidden', true);
  $("#easyBtn").addClass("bg-10");
  $("#normalBtn").removeClass("bg-10");
  $("#hardBtn").removeClass("bg-10");
})

$("#normalBtn").on("click", function() {
  $(".easyDiv").prop('hidden', true);
  $(".normalDiv").prop('hidden', false);
  $(".hardDiv").prop('hidden', true);
  $("#easyBtn").removeClass("bg-10");
  $("#normalBtn").addClass("bg-10");
  $("#hardBtn").removeClass("bg-10");
})

$("#hardBtn").on("click", function() {
  $(".easyDiv").prop('hidden', true);
  $(".normalDiv").prop('hidden', true);
  $(".hardDiv").prop('hidden', false);
  $("#easyBtn").removeClass("bg-10");
  $("#normalBtn").removeClass("bg-10");
  $("#hardBtn").addClass("bg-10");
})