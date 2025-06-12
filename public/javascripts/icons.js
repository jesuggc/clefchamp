let hasSelectedIcon = false;
let hasSelectedColor = false;

function updateSaveButtonState() {
  const saveBtn = $("#saveBtn");
  if (hasSelectedIcon && hasSelectedColor) {
    saveBtn.prop('disabled', false);
  } else {
    saveBtn.prop('disabled', true);
  }
}

$(".svgIcons").on("click", function() {
  $("#exampleModal").modal("show");
});
$("#profileIcon").on("click", function() {
  $("#exampleModal").modal("show");
});

$(".iconBtn").on("click", function() {
  const path = $(this).find("img").attr("src");
  const id = $(this).data("id");
  $("#selectionIcon, #selectionIconMobile").attr("src", path);
  $("#selectionIcon, #selectionIconMobile").attr("data-id", id);
  hasSelectedIcon = true;
  updateSaveButtonState();
});

$("#selectionColor, #selectionColorMobile").on("input", function() {
  const color = $(this).val();
  $("#selectionBg, #selectionBgMobile").css("background-color", color);
  $("#selectionColor, #selectionColorMobile").val(color);
  hasSelectedColor = true;
  updateSaveButtonState();
});

$("#saveBtn").on("click", async function() {
  const color = $("#selectionColor").val();
  const dataId = $("#selectionIcon").attr("data-id");
  const path = $("#selectionIcon").attr("src").split("/").pop();

  const change = await sendProfileData({ color, dataId, path });
  if(change === true) {
    $("#exampleModal").modal("hide");
    $("#bgDiv, #profileIcon").css("background-color", color);
    $("#imgDiv, #profileIcon img").attr("src", $("#selectionIcon").attr("src"));
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

$('#exampleModal').on('show.bs.modal', function () {
  hasSelectedIcon = false;
  hasSelectedColor = false;
  updateSaveButtonState();
  const currentColor = $("#bgDiv").css("background-color");
  const currentIcon = $("#imgDiv").attr("src");
  $("#selectionColor, #selectionColorMobile").val(currentColor);
  $("#selectionBg, #selectionBgMobile").css("background-color", currentColor);
  $("#selectionIcon, #selectionIconMobile").attr("src", currentIcon);
});

