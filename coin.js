// http://www.williammalone.com/articles/create-html5-canvas-javascript-sprite-animation/
var coinImage = new Image();
coinImage.src = "coin-sprite-animation-sprite-sheet.png";

function sprite (options) {
    var that = {};
    that.context = options.context;
    that.width = options.width;
    that.height = options.height;
    that.image = options.image;
    that.render = function () {
        // Draw the animation
        that.context.drawImage(
           that.image,
           0,
           0,
           that.width,
           that.height,
           0,
           0,
           that.width,
           that.height);
    };
    return that;
}

var coin = sprite({
    context: ctx,
    width: 100,
    height: 100,
    image: coinImage
});

coin.render();