$("#copyFriendCode").on("click", function() {
    let x = $("#friendCode").text()
    navigator.clipboard.writeText(x)
})
