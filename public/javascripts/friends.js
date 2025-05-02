$('#noResultDiv').hide();
$('#resultDiv').hide();


$("#addFriend").on("click", function() {
  let friendId = $("#resultDiv").attr("data-id")
  sendRequest(friendId)
9})

$("#myFriendCode").on("input", function() {
  $(this).val($(this).val().replace('#', ''));
});

$(document).ready(function() {
  $('#myFriendCode').on('keypress', function(e) {
      if (e.which === 13) { // 13 is the Enter key code
          e.preventDefault();
          $('#friendBtn').click();
      }
  });
});

$("#friendBtn").on("click", async function() {
  $('#noResultDiv').hide();
  $('#resultDiv').hide();
  const friendCode = $("#myFriendCode").val().replace('#', ''); 
  console.log("El codigo es", friendCode)
  if(friendCode === "")  $('#noResultDiv').show();
  else {
    try {
      const result = await fetchUserByFriendCode(friendCode);
      if (result.length === 0) $('#noResultDiv').show();
      else {
        console.log( result[0].state )
        console.log( result[0].userId )
        console.log( result[0].friendId )
        $("#addFriendDiv").hide();
        $("#acceptFriendDiv").hide();
        $("#rejectFriendDiv").hide();
        $("#deleteFriendDiv").hide();
        $("#cancelRequestDiv").hide();
        if(result[0].state === null) {
          $("#addFriendDiv").show();
        } else if(result[0].state === 'pendiente') {
            if(result[0].userId === user.id) {
              $("#cancelRequestDiv").show();
            } else {
              $("#acceptFriendDiv").hide();
              $("#rejectFriendDiv").hide();
            }  
        } else if(result[0].state === 'aceptado') {
          $("#deleteFriendDiv").hide();
        } else if(result[0].state === 'rechazado') {
          // No se usa
        } else {
          console.log("Estamos jodidos")
        }
        $('#resultDiv').show();
        $('#resultImg').attr('src', "/images/svg/" + result[0].path);
        $('#resultName').text(result[0].tagname);
        $("#resultBg").css("background-color", result[0].bgColor)
        $("#resultDiv").attr("data-id", result[0].id)

      }
      
    } catch (error) {
      console.error('Error en newfunction:', error);
    }
  }
});

async function fetchUserByFriendCode(friendCode) {
  try {
    const response = await fetch(`/users/getUserByFriendcode/${friendCode}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener los datos:', error);
  }
}

function sendRequest(friendId) {
  fetch('/users/sendRequest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({

      friendId: friendId
    })
  })
  .then(response => response.json())
  .catch(error => {
    console.error('Error al enviar la solicitud de amistad:', error);
  });
}


$("#searchFriend").on("click", function() {
  new bootstrap.Modal($("#searchFriendModal")).show();
})

$("#friendsBtn").addClass("bg-10");
$("#friendsBtn").on("click", function() {
  $(".friendsDiv").prop('hidden', false);
  $(".sentRequestDiv").prop('hidden', true);
  $(".recivedRequestDiv").prop('hidden', true);
  $("#friendsBtn").addClass("bg-10");
  $("#sentRequestBtn").removeClass("bg-10");
  $("#recivedRequestBtn").removeClass("bg-10");
})

$("#sentRequestBtn").on("click", function() {
  $(".friendsDiv").prop('hidden', true);
  $(".sentRequestDiv").prop('hidden', false);
  $(".recivedRequestDiv").prop('hidden', true);
  $("#friendsBtn").removeClass("bg-10");
  $("#sentRequestBtn").addClass("bg-10");
  $("#recivedRequestBtn").removeClass("bg-10");
})

$("#recivedRequestBtn").on("click", function() {
  $(".friendsDiv").prop('hidden', true);
  $(".sentRequestDiv").prop('hidden', true);
  $(".recivedRequestDiv").prop('hidden', false);
  $("#friendsBtn").removeClass("bg-10");
  $("#sentRequestBtn").removeClass("bg-10");
  $("#recivedRequestBtn").addClass("bg-10");
})

$(".actionFriendIcon").on("click", function() {
  let friendId = $(this).attr("data-id")
  fetch('/users/acceptRequest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({

      friendId: friendId
    })
  })
  .then(window.location.reload())
  .catch(error => {
    console.error('Error al aceptar la solicitud de amistad:', error);
  });
})

$(".actionUnfriendIcon").on("click", function() {
  let friendId = $(this).attr("data-id")
  console.log("El id es", friendId)
  fetch('/users/dropRequest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      friendId: friendId
    })
  })
  .then(window.location.reload())
  .catch(error => {
    console.error('Error al rechazar la solicitud de amistad:', error);
  });
})