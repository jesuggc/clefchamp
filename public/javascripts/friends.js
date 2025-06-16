let userId = null;

// Initialize user ID when document is ready
$(document).ready(async function() {
    userId = await getSelfId();
});

$('#noResultDiv').hide();
$('#resultDiv').hide();


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
let lastPath, lastTagname, lastColor, lastId;
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
                console.log(result[0]);
                $("#resultDiv").find('.friend-btn').hide(); // Hide all buttons
                
                if(result[0].state === null) {
                    $("#resultDiv").find('[data-action="add"]').show();
                } else if(result[0].state === 'pendiente') {
                    if(result[0].userId === userId) {
                        $("#resultDiv").find('[data-action="cancel"]').show();
                    } else {
                        $("#resultDiv").find('[data-action="accept"]').show();
                        $("#resultDiv").find('[data-action="reject"]').show();
                    }  
                } else if(result[0].state === 'aceptado') {
                    $("#resultDiv").find('[data-action="delete"]').show();
                } 
                lastPath =  result[0].path
                lastColor = result[0].bgColor
                lastId = result[0].id
                lastTagname = result[0].tagname
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
$('#searchFriendModal').on('hidden.bs.modal', function () {
    $('#noResultDiv').hide();
    $('#resultDiv').hide();
});
$("#searchFriend").on("click", function() {
  new bootstrap.Modal($("#searchFriendModal")).show();
})
let activeScreen = "friends"
$("#friendsBtn").addClass("bg-10");
$("#friendsBtn").on("click", function() {
    activeScreen = "friends"
    $(".friendsDiv").prop('hidden', false);
    $(".sentRequestDiv").prop('hidden', true);
    $(".recivedRequestDiv").prop('hidden', true);
    $("#friendsBtn").addClass("bg-10");
    $("#sentRequestBtn").removeClass("bg-10");
    $("#recivedRequestBtn").removeClass("bg-10");
})

$("#sentRequestBtn").on("click", function() {
    activeScreen = "sent"
    $(".friendsDiv").prop('hidden', true);
    $(".sentRequestDiv").prop('hidden', false);
    $(".recivedRequestDiv").prop('hidden', true);
    $("#friendsBtn").removeClass("bg-10");
    $("#sentRequestBtn").addClass("bg-10");
    $("#recivedRequestBtn").removeClass("bg-10");
})

$("#recivedRequestBtn").on("click", function() {
    activeScreen = "recived"
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
function dropFriendRequest(friendId) {
    return fetch('/users/dropRequest', {
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


// Check number of children in #friendsParent
function checkCount() {
    const friendsCount = $('#friendsParent').children('.friendsDiv').length;
    const sentRequestsCount = $('#friendsParent').children('.sentRequestDiv').length;
    const recivedRequestsCount = $('#friendsParent').children('.recivedRequestDiv').length;
    if (friendsCount > 1) $('#friendsNone').hide();
    else $('#friendsNone').show();
    
    if (sentRequestsCount > 1) $('#sentRequestNone').hide();
    else $('#sentRequestNone').show();
            
    if (recivedRequestsCount > 1) $('#recivedRequestNone').hide();
    else $('#recivedRequestNone').show();
}

// Call the function initially
checkCount();

// Add a MutationObserver to watch for changes in #friendsParent
const observer = new MutationObserver(checkCount);
observer.observe(document.getElementById('friendsParent'), { childList: true });

// ------------------


function changeToNothingState(element) {
    element.find('.friend-btn').hide(); // Hide all buttons
    element.find('[data-action="add"]').show();
}
function changeToPendingState(element) {
    element.find('.friend-btn').hide(); // Hide all buttons
    element.find('[data-action="cancel"]').show();
}
function changeToDecisionState(element) {
    element.find('.friend-btn').hide(); // Hide all buttons
    element.find('[data-action="accept"]').show();
    element.find('[data-action="reject"]').show();
}
function changeToFriendState(element) {
    element.find('.friend-btn').hide(); // Hide all buttons
    element.find('[data-action="delete"]').show();
}

function createSentRequestDiv(id, bgColor, path, tagname) {
    const div = $('<div>', {
        class: 'row mt-4 py-1 bg-10 rounded-3 sentRequestDiv sent' + id,
        'data-id': id,
        hidden: !(activeScreen === "sent")
    });
    
    const col1 = $('<div>', { class: 'col d-flex justify-content-center' });
    const innerDiv = $('<div>', { style: 'background-color: ' + bgColor + ';', class: 'p-2 rounded-circle' });
    const img = $('<img>', { class: 'friendIcon', src: '/images/svg/' + path });
    innerDiv.append(img);
    col1.append(innerDiv);
    
    const col2 = $('<div>', { class: 'col d-flex align-items-center justify-content-center' });
    const h3 = $('<h3>', { class: 'col', text: tagname });
    col2.append(h3);
    
    const col3 = $('<div>', { class: 'col d-flex align-items-center justify-content-center' });
    const acceptBtn = $('<button>', { 'data-action': 'accept', style: 'display: none;', class: 'friend-btn', title: 'Aceptar solicitud' }).append($('<img>', { src: '/images/icons/accept.svg' }));
    const rejectBtn = $('<button>', { 'data-action': 'reject', style: 'display: none;', class: 'friend-btn', title: 'Rechazar solicitud' }).append($('<img>', { src: '/images/icons/reject.svg' }));
    const cancelBtn = $('<button>', { 'data-action': 'cancel', class: 'friend-btn', title: 'Cancelar petición' }).append($('<img>', { src: '/images/icons/cancel.svg' }));
    const deleteBtn = $('<button>', { 'data-action': 'delete', style: 'display: none;', class: 'friend-btn', title: 'Eliminar amigo' }).append($('<img>', { src: '/images/icons/delete.svg' }));
    col3.append(acceptBtn, rejectBtn, cancelBtn, deleteBtn);
    
    div.append(col1, col2, col3);
    return div;
}

$('.friend-btn').on('click', function () {
    const action = $(this).data('action');

    switch (action) {
        case 'add':
            changeToPendingState($(this).closest("#resultDiv"));
            const sentRequestDiv = createSentRequestDiv(lastId,lastColor,lastPath,lastTagname);
            $('#friendsParent').append(sentRequestDiv);
            sendFriendRequest(lastId);
            break;
        case 'accept':
            const element = $(this).closest("#resultDiv");
            const requestId = element.length > 0 ? element.data("id") : $(this).closest(".recivedRequestDiv").data("id");
            
            if (element.length > 0) {
                changeToFriendState(element);
            }
            if(activeScreen === "friends") $(`.recived${requestId}`).prop('hidden', false);
            else $(`.recived${requestId}`).prop('hidden', true);
            changeToFriendState($(`.recived${requestId}`));
            $(`.recived${requestId}`).removeClass('recivedRequestDiv').addClass('friendsDiv').removeClass(`.recived${requestId}`).addClass(`friend${requestId}`);
            
            acceptFriendRequest(requestId);
            break;
        case 'reject':
            element = $(this).closest("#resultDiv");
            requestId = element.length > 0 ? element.data("id") : $(this).closest(".recivedRequestDiv").data("id");

            if (element.length > 0) {
                changeToNothingState(element);
            }
            $(`.recived${requestId}`).remove();
            
            dropFriendRequest(requestId);
            break;
        case 'cancel':
            element = $(this).closest("#resultDiv");
            requestId = element.length > 0 ? element.data("id") : $(this).closest(".sentRequestDiv").data("id");

            if (element.length > 0) {
                changeToNothingState(element);
            } 
            $(`.sent${requestId}`).remove();
            
            dropFriendRequest(requestId);
            break;
        case 'delete':
            element = $(this).closest("#resultDiv");
            requestId = element.length > 0 ? element.data("id") : $(this).closest(".friendsDiv").data("id");

            if (element.length > 0) {
                changeToNothingState(element);
            }
            $(`.friend${requestId}`).remove();
            
            dropFriendRequest(requestId);
            break;
        default:
            console.warn('Acción no reconocida:', action);
    }
});
