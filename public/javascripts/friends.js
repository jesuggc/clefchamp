let userId = null;

// Initialize user ID when document is ready
$(document).ready(async function() {
    userId = await getSelfId();
});

$('#noResultDiv').hide();
$('#resultDiv').hide();

$("#addFriend").on("click", function() {
    let friendId = $("#resultDiv").attr("data-id");
    sendRequest(friendId);
});

$("#myFriendCode").on("input", function() {
  $(this).val($(this).val().replace('#', ''));
});

$(document).ready(function() {
  $('#myFriendCode').on('keypress', function(e) {
      if (e.which === 13) {
          e.preventDefault();
          $('#friendBtn').click();
      }
  });
});

async function getSelfId() {
    try {
        const response = await fetch('/users/getSelfId');
        if (!response.ok) throw new Error('Error getting user ID');
        const data = await response.json();
        return data.id;
    } catch (error) {
        console.error('Error al obtener el ID del usuario:', error);
        return null;
    }
}

$("#friendBtn").on("click", async function() {
    $('#noResultDiv').hide();
    $('#resultDiv').hide();
    const friendCode = $("#myFriendCode").val().replace('#', ''); 
    console.log("El codigo es", friendCode);
    
    if(friendCode === "") {
        $('#noResultDiv').show();
    } else {
        try {
            const result = await fetchUserByFriendCode(friendCode);
            if (result.length === 0) {
                $('#noResultDiv').show();
            } else {
                console.log(result[0].state);
                console.log(result[0].userId);
                console.log(result[0].friendId);
                
                $("#addFriendDiv").hide();
                $("#acceptFriendDiv").hide();
                $("#rejectFriendDiv").hide();
                $("#deleteFriendDiv").hide();
                $("#cancelRequestDiv").hide();
                
                if(result[0].state === null) {
                    $("#addFriendDiv").show();
                } else if(result[0].state === 'pendiente') {
                    if(result[0].userId === userId) {
                        $("#cancelRequestDiv").show();
                    } else {
                        $("#acceptFriendDiv").show();
                        $("#rejectFriendDiv").show();
                    }  
                } else if(result[0].state === 'aceptado') {
                    $("#deleteFriendDiv").show();
                } else if(result[0].state === 'rechazado') {
                    // No se usa
                } else {
                    console.log("Estamos jodidos")
                }
                
                $('#resultDiv').show();
                $('#resultImg').attr('src', "/images/svg/" + result[0].path);
                $('#resultName').text(result[0].tagname);
                $("#resultBg").css("background-color", result[0].bgColor);
                $("#resultDiv").attr("data-id", result[0].id);
            }
        } catch (error) {
            console.error('Error en la búsqueda:', error);
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

// Friend request functions
function acceptFriendRequest(friendId) {
    return fetch('/users/acceptRequest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ friendId })
    })
    .then(response => {
        if (!response.ok) throw new Error('Error accepting friend request');
    })
    .catch(error => {
        console.error('Error al aceptar la solicitud de amistad:', error);
    });
}

function rejectFriendRequest(friendId) {
    return fetch('/users/dropRequest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ friendId })
    })
    .then(response => {
        if (!response.ok) throw new Error('Error rejecting friend request');
    })
    .catch(error => {
        console.error('Error al rechazar la solicitud de amistad:', error);
    });
}

function cancelFriendRequest(friendId) {
    return fetch('/users/cancelRequest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ friendId })
    })
    .then(response => {
        if (!response.ok) throw new Error('Error canceling friend request');
    })
    .catch(error => {
        console.error('Error al cancelar la solicitud de amistad:', error);
    });
}

function deleteFriend(friendId) {
    return fetch('/users/deleteFriend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ friendId })
    })
    .then(response => {
        if (!response.ok) throw new Error('Error deleting friend');
    })
    .catch(error => {
        console.error('Error al eliminar amigo:', error);
    });
}

function sendFriendRequest(friendId) {
    return fetch('/users/sendRequest', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ friendId })
    })
    .then(response => {
        if (!response.ok) throw new Error('Error sending friend request');
    })
    .catch(error => {
        console.error('Error al enviar solicitud de amistad:', error);
    });
}

// Event listeners
$(document).ready(function() {
    // Accept friend request
    $(".actionFriendIcon").on("click", function() {
        const friendId = $(this).attr("data-id");
        acceptFriendRequest(friendId);
    });

    // Reject friend request
    $(".actionUnfriendIcon").on("click", function() {
        const friendId = $(this).attr("data-id");
        rejectFriendRequest(friendId);
    });

    // Cancel friend request
    $(".actionDeleteIcon").on("click", function() {
      const friendId = $(this).attr("data-id");
      deleteFriend(friendId);
    });  
    // Delete friend
    $(".actionCancelIcon").on("click", function() {
      const friendId = $(this).attr("data-id");
      cancelFriendRequest(friendId);
    });

                    
    $("#addFriend").on("click", function() {
        const friendId = $("#resultDiv").attr("data-id");
        $("#addFriendDiv").hide();
        $("#deleteFriendDiv").show();
        // mover a div de solicitudes enviadas
        // sendFriendRequest(friendId);
    });
    
    $("#acceptFriend").on("click", function() {
        const friendId = $("#resultDiv").attr("data-id");
        $("#acceptFriendDiv").hide();
        $("#deleteFriendDiv").show();
        //mover a div de amigos
        //quitar de div de solicitudes recibidas
        $(".friend" + friendId).detach().appendTo(".friendsDiv");
        // acceptFriendRequest(friendId);
      });
      
      $("#rejectFriend").on("click", function() { 
        const friendId = $("#resultDiv").attr("data-id");
        $("#rejectFriendDiv").hide();
        $("#addFriendDiv").show();
        // quitar de div de solicitudes recibidas
        // rejectFriendRequest(friendId);
      });
      
      $("#cancelRequest").on("click", function() {
        const friendId = $("#resultDiv").attr("data-id");
        $("#cancelRequestDiv").hide();
        $("#addFriendDiv").show();
        // quitar de div de solicitudes enviadas
        // cancelFriendRequest(friendId);
      });
      
      $("#deleteFriend").on("click", function() {
        const friendId = $("#resultDiv").attr("data-id");
        $("#deleteFriendDiv").hide();
        $("#addFriendDiv").show();
  
        $(".friend"+friendId).hide();
        
        // deleteFriend(friendId);
    });     
});
ç