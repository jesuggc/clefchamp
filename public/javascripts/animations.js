function flashBackground(div, color) {
    if (!div) return;
    
    $(div)
    .css({ transition: 'none', backgroundColor: color })
    .delay(250)
    .queue(function(next) {
        $(this).css({
            transition: 'background-color 1s ease-in-out',
            backgroundColor: 'white'
        });
        next();
    });
}
function fadeOut(div) {
    if (!div) return;
    
    $(div)
    .css({ transition: 'none', opacity: 1 })
    .delay(100)
    .queue(function(next) {
        $(this).css({
            transition: 'opacity 1s ease-in-out',
            opacity: 0
        });
        next();
    });
}

function addPointsAnimation(element, points) {
    element
    .show()
    .text(`+${points}`)
    .addClass('point-animation')
    .delay(200)
    .queue(function(next) {
        $(this).hide().removeClass('point-animation');
        next();
    });
}

function addProgresively(element, start, end, duration) {
    const fps = 60;
    const frameDuration = 1000 / fps;
    const frames = duration / frameDuration;
    const increment = (end - start) / frames;
    
    let current = start;
    const interval = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(interval);
        }
        element.text(Math.round(current));
    }, frameDuration);
}
  
function growAndBack (div) {
    div.addClass("pulse-animation");

    setTimeout(() => {
        div.removeClass("pulse-animation");
    }, 100);
}

function secuencialShow(selector) {
    setTimeout(() => {
        $(selector).each(function(index) {
        setTimeout(() => {
            $(this).css('opacity', 1);
        }, 500 * index);
        });
    }, 500); 
}

export { flashBackground, fadeOut, addPointsAnimation, addProgresively, growAndBack, secuencialShow};
