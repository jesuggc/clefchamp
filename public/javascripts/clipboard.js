$("#copyFriendCode").on("click", function() {
    let x = $("#friendCode").text()
    navigator.clipboard.writeText(x)
    $(".friendCodeImg").attr('src', '/images/icons/copyready.svg')
    setTimeout(() => {
        $(".friendCodeImg").attr('src', '/images/icons/copy.svg')
    }, 2000)
})
