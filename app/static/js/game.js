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
let GAME_MODE = 0;

//START SCREEN IMAGES
const start_screen_bg = new Image();
start_screen_bg.src = "/static/img/start_screen_bg.png";
const start_button = new Image();
start_button.src = "/static/img/start_button.png";
const tutorial_button = new Image();
tutorial_button.src = "/static/img/tutorial_button.png";

//TO CREATE SCALEABLE GAME

function loadImage(img) {
    return new Promise((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = reject;
    });
}

async function start_screen() {
    console.log("start_screen launched");
    try {
        const images = await Promise.all([start_screen_bg, start_button, tutorial_button].map(src => loadImage(src)));
    
        //const SCALE_FACTOR = start_button.width / canvas.width;

        context.drawImage(
            start_screen_bg, 0, 0, canvas.width, canvas.height
        );

        //768 is the full screen length of canvas
        context.drawImage(
            start_button, canvas.width/2 - start_button.width*(canvas.width/768)/2, canvas.height/2, start_button.width * (canvas.width/768), start_button.height * (canvas.height/768)
        );
    
        context.drawImage(
            tutorial_button, canvas.width/2 - tutorial_button.width*(canvas.width/768)/2, canvas.height/2 + tutorial_button.height*(canvas.width/768), tutorial_button.width * (canvas.width/768), tutorial_button.height * (canvas.height/768)
        );
    } catch (error) {
        console.error("Some images may have not loaded"); 
    }
}


//TO GET COORDINATES OF CLICK
function get_coordinates(event) {
  const rect = canvas.getBoundingClientRect();
  return {  
    x: (event.clientX - rect.left) * (canvas.width / rect.width),  
    y: (event.clientY - rect.top) * (canvas.height / rect.height)
  };  
}  

//detects what screen the buttons are pressed on
canvas.addEventListener('click', trigger_buttons);

function trigger_buttons(event){
    console.log("get_coordinates click detected");  
    const coords = get_coordinates(event);

    if (GAME_MODE==0) {
        console.log("click detected on start page");
        trigger_buttons_start(coords);
    }

    else if (GAME_MODE==1) {
        console.log("click detected on tutorial page");
    }
    else if (GAME_MODE == 2) {
        console.log("click detected on game page");
    }
    else if (GAME_MODE == 3){
        console.log("click detected on night page");
    }     
}

function trigger_buttons_start(c) {
    console.log(c);
    if (c.x > canvas.width/2 - start_button.width*(canvas.width/768)/2 && c.x < canvas.width/2 + start_button.width*(canvas.width/768)/2) {
        if (c.y > canvas.height/2 && c.y < canvas.height/2 + start_button.height*canvas.width/768) {
            console.log("run game");
        }
    }

    if (c.x > canvas.width/2 - tutorial_button.width*(canvas.width/768)/2 && c.x < canvas.width/2 + tutorial_button.width*(canvas.width/768)/2) {
        if (c.y > canvas.height/2 + tutorial_button.height*(canvas.width/768) && c.y < canvas.height/2 + tutorial_button.height*(canvas.width/768) + tutorial_button.width) {
            console.log("run tutorial");
        }
    }  

}

function game() {
    if (GAME_MODE == 0) {
        start_screen();
    }
    else if (GAME_MODE == 1) {
        tutorial_screen();
    }
    else if (GAME_MODE == 2) {
        //run game
    }
    else if (GAME_MODE == 3) {
        //run night endgame
    }
}

//setInterval(game, 200);
game();

