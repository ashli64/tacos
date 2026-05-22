//0 = start screen
//1 tutorial
//2 game
//3 Night Complete Screen

var canvas = document.getElementById('main-canvas');
var context = canvas.getContext('2d');
context.canvas.width = window.innerWidth * .50;
context.canvas.height = window.innerWidth * .350;

const start_screen_bg = new Image();
start_screen_bg.src = "/static/img/start_screen_bg.png";
const start_button = new Image();
start_button.src = "/static/img/start_button.png";
const tutorial_button = new Image();
tutorial_button.src = "/static/img/tutorial_button.png";

const SCALE_FACTOR = canvas.width / start_button.width;

tutorial_button.onload = function () {
    context.drawImage(
        start_screen_bg, 0, 0, canvas.width, canvas.height
    );

    //need to make buttons scaled with screen too
    context.drawImage(
        start_button, canvas.width/2 - start_button.width/2, canvas.height/2, start_button.width / SCALE_FACTOR
    );
    context.drawImage(
        tutorial_button, canvas.width/2 - start_button.width/2, canvas.height/2 + tutorial_button.width/1.5
    );
}
