$("#easyBtn").on("click", function() {
  $(".easyDiv").prop('hidden', false);
  $(".normalDiv").prop('hidden', true);
  $(".hardDiv").prop('hidden', true);
})

$("#normalBtn").on("click", function() {
  $(".easyDiv").prop('hidden', true);
  $(".normalDiv").prop('hidden', false);
  $(".hardDiv").prop('hidden', true);
})

$("#hardBtn").on("click", function() {
  $(".easyDiv").prop('hidden', true);
  $(".normalDiv").prop('hidden', true);
  $(".hardDiv").prop('hidden', false);
})