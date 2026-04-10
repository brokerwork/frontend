var myScroll;
// ref https://github.com/WICG/EventListenerOptions/pull/30
function isPassive() {
    var supportsPassiveOption = false;
    try {
        addEventListener("test", null, Object.defineProperty({}, 'passive', {
            get: function () {
                supportsPassiveOption = true;
            }
        }));
    } catch (e) { }
    return supportsPassiveOption;
}

function injectIscroll() {
    myScroll = new IScroll('#wrapper', {
        probeType: 2,
        scrollbars: true,
        mouseWheel: true,
        interactiveScrollbars: true,
        shrinkScrollbars: 'scale',
        fadeScrollbars: true,
        preventDefault: false
    });
    myScroll.on("scroll", function () {
        if ((this.y < this.maxScrollY) && (this.pointY < 1)) {
            this.scrollTo(0, this.maxScrollY, 400);
            return;
        } else if (this.y > 0 && (this.pointY > window.innerHeight - 1)) {
            this.scrollTo(0, 0, 400);
            return;
        }
    })
}

function loaded() {
    setTimeout(function () {
        injectIscroll();
    }, 100);
}

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, isPassive() ? {
    capture: false,
    passive: false
} : false);

window.addEventListener("load", loaded, false)

window.addEventListener('resize',function(){
    setTimeout(function() {
        loaded()
    },500)
},false);

window.loaded  = loaded;
