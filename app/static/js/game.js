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

start_screen_bg.onload = function () {

    console.log("image loaded");

    context.drawImage(
        start_screen_bg, 0, 0, canvas.width, canvas.height
    );
};

start_screen();