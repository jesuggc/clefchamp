// $(function() {
//   $("#exampleModal").modal("show");
// });

$(".svgIcons").on("click", function() {
  $("#exampleModal").modal("show");
});

$(".iconBtn").on("click", function() {
  $("#selectionIcon").attr("data-id", this.getAttribute("data-id"));

  let img = $(this).find("img").attr("src");
  $("#selectionIcon").attr("src", img);
});

$("#selectionColor").on("change", function() {
  $("#selectionBg").css("background-color", $(this).val());
});

$("#saveBtn").on("click", async function() { // Agregar async
  const color = $("#selectionColor").val();
  const dataId = $("#selectionIcon").attr("data-id");
  const path = $("#selectionIcon").attr("src").split("/").pop()

  const change = await sendProfileData({ color, dataId, path });
  if(change === true) {
    $("#exampleModal").modal("hide");
    $("#bgDiv").css("background-color",color)
    $("#imgDiv").attr("src",$("#selectionIcon").attr("src"))
  }
});

async function sendProfileData(data) {
  try {
    const response = await fetch('/users/setProfileIcon', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return true;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}

