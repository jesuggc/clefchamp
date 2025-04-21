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

$(".iconBtn").on("click", function() {
  const path = $(this).find("img").attr("src");
  const id = $(this).data("id");
  $("#selectionIcon").attr("src", path);
  $("#selectionIcon").attr("data-id", id);
  hasSelectedIcon = true;
  updateSaveButtonState();
});

$("#selectionColor").on("input", function() {
  const color = $(this).val();
  $("#selectionBg").css("background-color", color);
  hasSelectedColor = true;
  updateSaveButtonState();
});

$("#saveBtn").on("click", async function() {
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

$('#exampleModal').on('show.bs.modal', function () {
  hasSelectedIcon = false;
  hasSelectedColor = false;
  updateSaveButtonState();
});

