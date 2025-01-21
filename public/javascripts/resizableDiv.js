const resizableDiv = document.getElementById("myCanvas");
const resizeHandle = document.getElementById("resizeHandle");

resizeHandle.addEventListener("mousedown", function (e) {
    e.preventDefault();
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResize);
});

function resize(e) {
    resizableDiv.style.width = e.clientX - resizableDiv.getBoundingClientRect().left + "px";
    resizableDiv.style.height = e.clientY - resizableDiv.getBoundingClientRect().top + "px";
}

function stopResize() {
    document.removeEventListener("mousemove", resize);
    document.removeEventListener("mouseup", stopResize);
}

/* <div id="myCanvas" style="width: 200px; height: 200px; border: 1px solid black; position: relative;">
    <div id="resizeHandle" style="width: 10px; height: 10px; background: gray; position: absolute; bottom: 0; right: 0; cursor: se-resize;"></div>
</div> */