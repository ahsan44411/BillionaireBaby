// Global variable
const defaultPerspective = '-150px';
// Track the mouse movemont
let mouseX = 0;
let mouseY = 0;
console.log('hey motherfucker')
let lastXDeg = 180;
let lastYDeg = 180;
// The speed of the cube following movement
const speed = 0.1;
$('.cube-animation-section').ready(() => {
    console.log('i ran')
    setInterval(rotateCube, 66)
})
$('.cube-animation-section').mousemove(updateMousePosition);

// Follow mouse movement
function updateMousePosition(e) {
    console.log('brother I also ran')
    mouseX = e.pageX / getWidth();
    mouseY = e.pageY / getHeight();
}

function rotateCube() {
    console.log('for shizal ma nizal, ma nigga')
    lastXDeg = lastXDeg + (getAngle(mouseX) - lastXDeg
    ) * speed;
    lastYDeg = lastYDeg + (getAngle(mouseY) - lastYDeg
    ) * speed;
    let newStyle = `translateZ(${defaultPerspective}) rotateY(${lastXDeg}deg) rotateX(${lastYDeg}deg)`
    $('.cube-wrapper').css('transform', newStyle);
}

// this function return the corresponding angle for an x value
function getAngle(x) {
    return 180 - 360 * x;
}

function getWidth() {
    return Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
    )
}

function getHeight() {
    return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight
    )
}