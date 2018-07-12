// SET VARIABLES
var game = 1;
var width = 640;
var height = 480;
var grid = 20;
var speed = 10;
var c = document.getElementById("snake");
var ctx = c.getContext("2d");

// COLORS
var wall_color = "#673ab7";

var debug = true;

var score = 0;
var bestScore = 0;

var snake = {
    offset: 4,
    x: (width/2),
    y: (height/2),
    speedTimer: speed, // millisecond step for the snake move
    direction: 'right',
    size: 1
};

var gold = {
    offset: 6,
    x: (width/2) + grid,
    y: (height/2) + grid
}

var walls_collisions = {
    topLeftX: grid,
    topLeftY: grid,
    topRightX: width-grid,
    topRightY: grid,
    bottomLeftX: grid,
    bottomLeftY: height-grid,
    bottomRightX: width-grid,
    bottomRightY: height-grid,
}

// KEYBOARD
var escaped = false;

// GRID
function show_grid() {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#e8eaf6";
    for (var x = grid; x < width; x += grid) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    for (var y = grid; y < height; y += grid) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
}

function draw_walls_collision(){
    ctx.strokeStyle = "#ff1744";
    ctx.beginPath();
    ctx.moveTo(walls_collisions.topLeftX, walls_collisions.topLeftY);
    ctx.lineTo(walls_collisions.topRightX, walls_collisions.topRightY);
    ctx.lineTo(walls_collisions.bottomRightX, walls_collisions.bottomLeftY);
    ctx.lineTo(walls_collisions.bottomLeftX, walls_collisions.bottomLeftY);
    ctx.lineTo(walls_collisions.topLeftX, walls_collisions.topLeftY);
    ctx.stroke();
}

function display_position_text(){
    var string = "X: " + snake.x + " Y: " + snake.y;
    ctx.fillStyle = "#000";
    ctx.font = "30px Arial";
    ctx.fillText(string,30,50);
}

// SETTING FUNCTIONS
function set_player_movement() {
    document.addEventListener("keydown", (event) => {
        var key = event.key;

        if (key === 'Escape') {
            escaped = true;
        }
        if (key === 'ArrowLeft') {
            snake.direction = "left";
            event.preventDefault();
        }
        if (key === 'ArrowRight') {
            snake.direction = "right";
            event.preventDefault();
        }
        if (key === 'ArrowUp') {
            snake.direction = "up";
            event.preventDefault();
        }
        if (key === 'ArrowDown') {
            snake.direction = "down";
            event.preventDefault();
        }
    });
}

function set_walls() {
    ctx.fillStyle = wall_color;
    ctx.fillRect(0, 0, grid, height);
    ctx.fillRect(grid, 0, width-(grid*2), grid);
    ctx.fillRect(width-grid, 0, grid, height);
    ctx.fillRect(grid, height-grid, width-(grid*2), grid);
}

// GAMEPLAY FUNCTIONS
function snake_move(){
    snake.speedTimer--;
    if (snake.speedTimer === 0) {
        switch (snake.direction) {
            case "left":
                snake.x -= grid;
                break;
            case "right":
                snake.x += grid;
                break;
            case "up":
                snake.y -= grid;
                break;
            case "down":
                snake.y += grid;
                break;
        }
        snake.speedTimer = speed;
    }
}

function check_wall_collision(){
    if ( snake.x < walls_collisions.topLeftX ||
    snake.x + grid > walls_collisions.topRightX || 
    snake.y < walls_collisions.topLeftY ||
    snake.y + grid > walls_collisions.bottomLeftY ) {
        game = false;
    }
}

function check_gold_collision(){
    if (snake.x === gold.x && snake.y === gold.y) {
        score += 1;
        snake.size += 1;
        set_new_gold();
    }
}

function set_new_gold(){
    // The new position of the next gold shouldn't be to the same place of the snake body
    var x = 640/20;
    var y = 480/20;
    var random
    console.log("gold x:", x, " y:", y);
}

// DRAWING FUNCTIONS
function draw_background(){
    ctx.fillStyle = "#7986cb";
    ctx.fillRect(grid, grid, width-(2*grid), height-(2*grid));
}

function draw_snake(){
    ctx.fillStyle = "#e57373";
    switch (snake.direction) {
        case "left":
            ctx.fillRect(snake.x + snake.offset, snake.y + snake.offset, grid - snake.offset, grid - (snake.offset*2));
            break;
        case "right":
            ctx.fillRect(snake.x, snake.y + snake.offset,  grid - snake.offset, grid - (snake.offset*2));
            break;
        case "up":
            ctx.fillRect(snake.x + snake.offset, snake.y + snake.offset, grid - (snake.offset*2), grid - snake.offset);
            break;
        case "down":
            ctx.fillRect(snake.x + snake.offset, snake.y, grid - (snake.offset*2), grid - snake.offset);
            break;
    }
}

function draw_gold(){
    ctx.fillStyle = "#ffca28";
    ctx.fillRect(gold.x + gold.offset, gold.y + gold.offset, grid - (gold.offset*2), grid - (gold.offset*2));
}

function draw_menu(){
    ctx.fillStyle = "#9fa8da";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#000";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over",150,(height/2) - 40);
    ctx.fillText("Score:",150,height/2);
    ctx.fillText("Best:",150,(height/2) + 40);
    ctx.fillText("Space key to start a new game",150,(height/2) + 80);
    ctx.fillStyle = "#ff1744"; 
    ctx.font = "35px Arial";
    ctx.fillText(score,240,height/2 + 2);
    ctx.fillText(bestScore,220,(height/2) + 42);
}

;(function () {
    function load() {
        set_player_movement();
        set_walls();
    }

    function draw() {
        if (game) {
            draw_background();
            draw_gold()
            draw_snake();
        } else {
            draw_menu();
        }
    }

    function debug_tools() {
        show_grid();
        draw_walls_collision();
        display_position_text();
    }

    function main() {
        var req = window.requestAnimationFrame( main );
        draw();
        if (game) {
            snake_move();
            check_wall_collision();
            check_gold_collision();
            // check_snake_self_collision();
        } else {
            // game_over();
        }
        if (escaped) {
            window.cancelAnimationFrame(req);
        }
        if (debug) {
            debug_tools();
        }
    } 
    
    load();
    draw();
    main();
})();
      
