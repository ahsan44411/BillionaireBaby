// number of drops created.
var nbDrop = 858;
console.log('hello')
// function to generate a random number range.
function randRange(minNum, maxNum) {
    return (Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
}
console.log('hello1')
// function to generate drops
function createRain() {
    console.log('hello2')
    for (i = 1; i < nbDrop; i++) {
        var dropLeft = randRange(0, 1600);
        var dropTop = randRange(-1000, 1400);

        $('.rain').append('<div class="drop" id="drop' + i + '"></div>');
        $('#drop' + i).css('left', dropLeft);
        $('#drop' + i).css('top', dropTop);
    }

}

// Make it rain
createRain();