//SETUP STUFF
var canvas = document.getElementById('main-canvas');
var context = canvas.getContext('2d');
context.canvas.width = window.innerWidth * .50;
context.canvas.height = window.innerWidth * .350;

let SCALE = (canvas.width/768);

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

//TUTORIAL
let TUTORIAL_CARD = 0;
let GAME_CARD = 0;

const tutorial_card_0 = new Image();
tutorial_card_0.src = "/static/img/tutorial_card_0.png";
const tutorial_card_1 = new Image();
tutorial_card_0.src = "/static/img/tutorial_card_1.png";
const tutorial_card_2 = new Image();
tutorial_card_0.src = "/static/img/tutorial_card_2.png";
const tutorial_card_3 = new Image();
tutorial_card_0.src = "/static/img/tutorial_card_3.png";

const tutorial_card_list = [tutorial_card_0, tutorial_card_1, tutorial_card_2, tutorial_card_3];

const left_arrow = new Image();
left_arrow.src = "/static/img/left_arrow.png";
const right_arrow = new Image();
right_arrow.src = "/static/img/right_arrow.png";

const exit_cross = new Image();
exit_cross.src = "/static/img/exit_cross.png";

//MAIN GAME BACKGROUNDS
const inventory_background = new Image();
inventory_background.src = "/static/img/inventory_background.png"

const background_card_0 = new Image();
background_card_0.src = "/static/img/background_card_0.png";
const background_card_1 = new Image();
background_card_1.src = "/static/img/background_card_1.png";
const background_card_2 = new Image();
background_card_2.src = "/static/img/background_card_2.png";
const background_card_3 = new Image();
background_card_3.src = "/static/img/background_card_3.png";

const main_game_card_list = [background_card_0, background_card_1, background_card_2, background_card_3];

// INVENTORY
const INVENTORY = [];

// shelves, fridge
const INGREDIENTS = [[], []];

let FOOD;

// RECIPES
const BURGER0_RECIPE = [];
const BURGER1_RECIPE = [];
const BURGER2_RECIPE = [];
const BURGER3_RECIPE = [];

const BURGER_RECIPES = [];

const HOTDOG0_RECIPE = [];
const HOTDOG1_RECIPE = [];

fetch('/static/js/foods.json')
    .then(response => response.json())
    .then(data => {

        FOOD = data;

        // INGREDIENT GROUPS

        // shelves
        INGREDIENTS[0].push(
            'tomato',
            'bun_burger',
            'bun_hotdog',
            'sauce'
        );

        // fridge
        INGREDIENTS[1].push(
            'lettuce',
            'patty',
            'sausage'
        );

        // BURGER RECIPES

        BURGER0_RECIPE.push(
            'bun_burger',
            'patty'
        );

        BURGER1_RECIPE.push(
            'bun_burger',
            'patty',
            'lettuce'
        );

        BURGER2_RECIPE.push(
            'bun_burger',
            'patty',
            'tomato'
        );

        BURGER3_RECIPE.push(
            'bun_burger',
            'patty',
            'lettuce',
            'tomato'
        );

        BURGER_RECIPES.push(
            BURGER0_RECIPE,
            BURGER1_RECIPE,
            BURGER2_RECIPE,
            BURGER3_RECIPE
        );

        // HOTDOG RECIPES

        HOTDOG0_RECIPE.push(
            'bun_hotdog',
            'sausage'
        );

        HOTDOG1_RECIPE.push(
            'bun_hotdog',
            'sausage',
            'sauce'
        );

        //console.log(FOOD);
        //console.log(INGREDIENTS);
        //console.log(BURGER_RECIPES);
        //console.log(HOTDOG0_RECIPE);
        //console.log(HOTDOG1_RECIPE);

    })
    .catch(error => {

        console.error('Error loading food JSON:', error);

    });

const empty_inventory_slot_background = new Image();
empty_inventory_slot_background.src = "/static/img/empty_inventory_slot_background.src";

function createFood(type) {
    return {
        type: type,
        isCooked: false, //if its a sausage or meat, show cooked variant
        isStock: true //if its in stock, show stock, if in inventory, show its basic image
    };
}

//TO CREATE SCALEABLE GAME
function loadImage(img) {
    return new Promise((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = reject;
    });
}

function start_screen() {
    //console.log("start_screen launched");
    try {
        //const images = await Promise.all([start_screen_bg, start_button, tutorial_button].map(src => loadImage(src)));
    
        //const SCALE_FACTOR = start_button.width / canvas.width;

        context.drawImage(
            start_screen_bg, 0, 0, canvas.width, canvas.height
        );

        context.drawImage(
            start_button, canvas.width/2 - start_button.width*(SCALE)/2, canvas.height/2, start_button.width * (SCALE), start_button.height * (SCALE)
        );
    
        context.drawImage(
            tutorial_button, canvas.width/2 - tutorial_button.width*(SCALE)/2, canvas.height/2 + 1.2*tutorial_button.height*(SCALE), tutorial_button.width * (SCALE), tutorial_button.height * (SCALE)
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
    //console.log("get_coordinates click detected");  
    const coords = get_coordinates(event);
    console.log(coords);

    if (GAME_MODE==0) {
        //.log("click detected on start page");
        trigger_buttons_start(coords);
    }

    else if (GAME_MODE==1) {
        //console.log("click detected on tutorial page");
        trigger_buttons_tutorial(coords);
    }
    else if (GAME_MODE == 2) {
        //console.log("click detected on game page");
        trigger_buttons_main_game(coords);
    }
    else if (GAME_MODE == 3){
        //console.log("click detected on night page");
    }     
}

function trigger_buttons_start(c) {
    let start_button_x = canvas.width/2 - start_button.width*(SCALE)/2;
    let start_button_y = canvas.height/2;
    let start_button_width = start_button.width * (SCALE);
    let start_button_height = start_button.height * (SCALE);

    let tutorial_button_x = canvas.width/2 - tutorial_button.width*(SCALE)/2;
    let tutorial_button_y = canvas.height/2 + tutorial_button.height*(SCALE);
    let tutorial_button_width = tutorial_button.width * (SCALE);
    let tutorial_button_height = tutorial_button.height * (SCALE);
    
    if (c.x > start_button_x && c.x < (start_button_x+start_button_width)) {
        if (c.y > start_button_y && c.y < (start_button_y+start_button_height)) {
            //console.log("run game");
            GAME_MODE = 2;
        }
    }

    if (c.x > tutorial_button_x && c.x < (tutorial_button_x+tutorial_button_width)) {
        if (c.y > tutorial_button_y && c.y < (tutorial_button_y+tutorial_button_height)) {
            //console.log("run tutorial");
            GAME_MODE = 1;
        }
    }  
}

function trigger_buttons_tutorial(c) {

    let left_arrow_x = 2*left_arrow.width*(SCALE)/3;
    let left_arrow_y = canvas.height/2;

    let right_arrow_x = canvas.width - 3 * right_arrow.width*(SCALE)/3;
    let right_arrow_y = canvas.height/2;

    let arrow_width = right_arrow.width*(SCALE)/3;
    let arrow_height = right_arrow.height*(SCALE)/3;

    let exit_cross_x = canvas.width - 3*(exit_cross.width)*(SCALE)/3;
    let exit_cross_y = 2*(exit_cross.width)*(SCALE)/3;
    let exit_cross_width = exit_cross.width*(SCALE)/3;
    let exit_cross_height = exit_cross.height*(SCALE)/3;

    if (c.x > left_arrow_x && c.x < left_arrow_x + arrow_width) {
        if (c.y > left_arrow_y && c.y < left_arrow_y + arrow_height) {
            trigger_arrows(true);
        }
    } else if (c.x > right_arrow_x && c.x < right_arrow_x + arrow_width) {
        if (c.y > right_arrow_y && c.y < right_arrow_y + arrow_height) {
            trigger_arrows(false);
        }
    }
    
    if (c.x > exit_cross_x && c.x < exit_cross_x + exit_cross_width) {
        if (c.y > exit_cross_y && c.y < exit_cross_y + exit_cross_height) {
            //console.log("AAAAAAAAAAAAAAAAAAAA");
            trigger_exit_cross();            
        }
    }
}

function trigger_buttons_main_game(c) {

    let left_arrow_x = 0.1*left_arrow.width*(SCALE)/3;
    let left_arrow_y = canvas.height/2 - left_arrow.height*(SCALE)/6;

    let right_arrow_x = canvas.width - 1.1*(right_arrow.width*(SCALE)/3);
    let right_arrow_y = canvas.height/2 - right_arrow.height*(SCALE)/6;

    let arrow_width = right_arrow.width*(SCALE)/3;
    let arrow_height = right_arrow.height*(SCALE)/3;

    if (c.x > left_arrow_x && c.x < left_arrow_x + arrow_width) {
        if (c.y > left_arrow_y && c.y < left_arrow_y + arrow_height) {
            trigger_arrows(true);
        }
    } else if (c.x > right_arrow_x && c.x < right_arrow_x + arrow_width) {
        if (c.y > right_arrow_y && c.y < right_arrow_y + arrow_height) {
            trigger_arrows(false);
        }
    }
}

function trigger_arrows(IsLeft) {
    if (GAME_MODE == 1) {
        if (IsLeft == true) {
            TUTORIAL_CARD = TUTORIAL_CARD - 1;
            console.log("LEFT ARROW");
            if (TUTORIAL_CARD == -1) {
                TUTORIAL_CARD = 3;
            }
        }
        else if (IsLeft == false) {
            TUTORIAL_CARD = TUTORIAL_CARD + 1;
            console.log("RIGHT ARROW");
            if (TUTORIAL_CARD == 4) {
                TUTORIAL_CARD = 0;
            }
        }
    } else if (GAME_MODE == 2) {
        if (IsLeft == true) {
            GAME_CARD = GAME_CARD - 1;
            console.log("LEFT ARROW");
            if (GAME_CARD == -1) {
                GAME_CARD = 3;
            }
        }
        else if (IsLeft == false) {
            GAME_CARD = GAME_CARD + 1;
            console.log("RIGHT ARROW");
            if (GAME_CARD == 4) {
                GAME_CARD = 0;
            }
        }
    }
}

function trigger_exit_cross() {
    if (GAME_MODE == 1) {
        GAME_MODE = 0;
    } else if (GAME_MODE == 3) {
        GAME_MODE = 2;
    }
}

function tutorial_screen() {
    console.log("tutorial_screen launched");
    try {
        context.drawImage(
            tutorial_card_list[TUTORIAL_CARD], 0, 0, canvas.width, canvas.height
        );
        context.drawImage(
            exit_cross, canvas.width - 3*(exit_cross.width)*(SCALE)/3, 2*(exit_cross.width)*(SCALE)/3, exit_cross.width*(SCALE)/3, exit_cross.height*(SCALE)/3 
        );

        context.drawImage(
            left_arrow, 2*left_arrow.width*(SCALE)/3, canvas.height/2, left_arrow.width*(SCALE)/3, left_arrow.height*(SCALE)/3 
        );
        context.drawImage(
            right_arrow, canvas.width - 3 * right_arrow.width*(SCALE)/3, canvas.height/2, right_arrow.width*(SCALE)/3, right_arrow.height*(SCALE)/3
        );
    } catch (error) {
        console.error("Some images may have not loaded"); 
    }    
}

function main_game_screen() {
    //console.log("MAIN GAME SCREEN LAUNCHED");

    try {
        context.drawImage(
            main_game_card_list[GAME_CARD], 0, 0, canvas.width, canvas.height
        );

        context.drawImage(
            inventory_background, 0,0, canvas.width, canvas.height
        );
        
        context.drawImage(
            left_arrow, 0.1*left_arrow.width*(SCALE)/3, canvas.height/2 - left_arrow.height*(SCALE)/6, left_arrow.width*(SCALE)/3, left_arrow.height*(SCALE)/3 
        );
        context.drawImage(
            right_arrow, canvas.width - 1.1*(right_arrow.width*(SCALE)/3), canvas.height/2 - right_arrow.height*(SCALE)/6, right_arrow.width*(SCALE)/3, right_arrow.height*(SCALE)/3
        );
    } catch (error) {
        console.error("Some images may have not loaded");
    }

    //drawing the inventory bar
    try {
        for (let i = 0; i < 4; i++) {
            if (INVENTORY[i] == null) {
                context.drawImage(
                    empty_inventory_slot_background, 2*empty_inventory_slot_background.width + i*empty_inventory_slot_background.width + i*((canvas.width - 8*filled_inventory_slot_background.width)/3), canvas.height - empty_inventory_slot_background.height*1.5
                )
            } else if (INVENTORY[i] != null) {
                context.drawImage(
                    INVENTORY[i].inventory_image, 2*INVENTORY[i].inventory_image.width + i*INVENTORY[i].inventory_image.width + i*((canvas.width - 8*INVENTORY[i].inventory_image.width)/3), canvas.height - INVENTORY[i].inventory_image.height*1.5
                )
            }
        }
    } catch (error) {
        console.error("Some images may have not loaded");
    }

    //drawing the items in stock
    try {
        if (GAME_CARD == 0) {
        // TOMATO
            const tomatoImage = new Image();
            tomatoImage.src = FOOD[INGREDIENTS[0][0]].stock_image;

            tomatoImage.onload = function () {
                context.drawImage(tomatoImage, 0.2 * tomatoImage.width * SCALE, 0.2 * tomatoImage.height * SCALE, tomatoImage.width * SCALE * 0.25, tomatoImage.height * SCALE * 0.25);
            };

            // BURGER BUN
            const burgerBunImage = new Image();
            burgerBunImage.src = FOOD[INGREDIENTS[0][1]].stock_image;

            burgerBunImage.onload = function () {
                context.drawImage(burgerBunImage, 0.2 * burgerBunImage.width * SCALE*7, 0.2 * burgerBunImage.height * SCALE*2.2, burgerBunImage.width * SCALE * 0.25, burgerBunImage.height * SCALE * 0.25);
            };

            // HOTDOG BUN
            const hotdogBunImage = new Image();
            hotdogBunImage.src = FOOD[INGREDIENTS[0][2]].stock_image;

            hotdogBunImage.onload = function () {
                context.drawImage(hotdogBunImage, 0.2 * hotdogBunImage.width * SCALE * 6, 0.2 * hotdogBunImage.height * SCALE*2.2, hotdogBunImage.width * SCALE * 0.25, hotdogBunImage.height * SCALE * 0.25);
            };

            // SAUCE
            const sauceImage = new Image();
            sauceImage.src = FOOD[INGREDIENTS[0][3]].stock_image;

            sauceImage.onload = function () {
                context.drawImage(sauceImage, 0.2 * sauceImage.width * SCALE* 2.2, 0.2 * sauceImage.height * SCALE*2.3, sauceImage.width * SCALE * 0.25, sauceImage.height * SCALE * 0.25);
            };
        } else if (GAME_CARD == 1) {

            // LETTUCE
            const lettuceImage = new Image();
            lettuceImage.src = FOOD[INGREDIENTS[1][0]].stock_image;

            lettuceImage.onload = function () {
                context.drawImage(lettuceImage, 0.2 * lettuceImage.width * SCALE * 3.2, 0.2 * lettuceImage.height * SCALE * 2.3, lettuceImage.width * SCALE * 0.25, lettuceImage.height * SCALE * 0.25);
            };

            // PATTY
            const pattyImage = new Image();
            pattyImage.src = FOOD[INGREDIENTS[1][1]].stock_image;

            pattyImage.onload = function () {
                context.drawImage(pattyImage, 0.2 * pattyImage.width * SCALE * 2, 0.2 * pattyImage.height * SCALE * 1.1, pattyImage.width * SCALE * 0.25, pattyImage.height * SCALE * 0.25);
            };

            // SAUSAGE
            const sausageImage = new Image();
            sausageImage.src = FOOD[INGREDIENTS[1][2]].stock_image;

            sausageImage.onload = function () {
                context.drawImage(sausageImage, 0.2 * sausageImage.width * SCALE * 3, 0.2 * sausageImage.height * SCALE * 4, sausageImage.width * SCALE * 0.25, sausageImage.height * SCALE * 0.25);
            };

        }
    } catch (error) {
        console.error("Some images may have not loaded");
    }
}

function main_game() {
    main_game_screen();
}


function game() {
    //console.log(GAME_MODE);
    if (GAME_MODE == 0) {
        start_screen();
        //console.log("game() start screen");
    }
    else if (GAME_MODE == 1) {
        tutorial_screen();
        //console.log("game() tutorial screen");
    }
    else if (GAME_MODE == 2) {
        main_game();
    }
    else if (GAME_MODE == 3) {
        //run night endgame
    }
}

setInterval(game, 240);
//game();
