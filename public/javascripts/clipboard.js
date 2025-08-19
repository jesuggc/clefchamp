$("#copyFriendCode").on("click", function () {
    let x = $("#friendCode").text();

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(x)
            .then(() => {
                $(".friendCodeImg").attr('src', '/images/icons/copyready.svg');
                setTimeout(() => {
                    $(".friendCodeImg").attr('src', '/images/icons/copy.svg');
                }, 2000);
            })
            .catch(err => {
                console.error("No se pudo copiar:", err);
            });
    } else {
        console.warn("Clipboard API no disponible");
        const textarea = document.createElement("textarea");
        textarea.value = x;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand("copy");
            $(".friendCodeImg").attr('src', '/images/icons/copyready.svg');
            setTimeout(() => {
                $(".friendCodeImg").attr('src', '/images/icons/copy.svg');
            }, 2000);
        } catch (err) {
            console.error("Fallback de copia falló:", err);
        }
        document.body.removeChild(textarea);
    }
});
