//SETUP STUFF
var canvas = document.getElementById('main-canvas');
var context = canvas.getContext('2d');
context.canvas.width = window.innerWidth * .50;
context.canvas.height = window.innerWidth * .350;

//GAME MODE
//0 = start screen
//1 = tutorial
//2 - run game
//3 - night end screen

const GAME_MODE = 0;

//START SCREEN IMAGES
const start_screen_bg = new Image();
start_screen_bg.src = "/static/img/start_screen_bg.png";
const start_button = new Image();
start_button.src = "/static/img/start_button.png";
const tutorial_button = new Image();
tutorial_button.src = "/static/img/tutorial_button.png";

//TO CREATE SCALEABLE GAME
const SCALE_FACTOR = start_button.width / canvas.width;

async function start_screen() {
    try {
        const images = await Promise.all([start_screen_bg, start_button, tutorial_button].map(url => loadImage(url)));
    
        context.drawImage(
            start_screen_bg, 0, 0, canvas.width, canvas.height
        );

        context.drawImage(
            start_button, canvas.width/2 - start_button.width/2, canvas.height/2, start_button.width / SCALE_FACTOR
        );
    
        context.drawImage(
            tutorial_button, canvas.width/2 - start_button.width/2, canvas.height/2 + tutorial_button.width/1.5
        );
    } catch (error) {
        console.error("Some images may have not loaded) }
}

start_screen();
