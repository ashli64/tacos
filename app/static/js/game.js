//TODO
//fix image flickering
//add putting together food feature
//add customer and requests
//add baking
//lower main game arrows
//display whats in plate lists
//display in order (push in order)

//CANVAS SETUP AND SCALABILITY
var canvas = document.getElementById('main-canvas');
var context = canvas.getContext('2d');
context.canvas.width = window.innerWidth * .50;
context.canvas.height = window.innerWidth * .350;

let SCALE = (canvas.width/800); //800 is about the size it would normally appear as

//GAME MODE
//0 = start screen
//1 = tutorial
//2 - run game
//3 - night end screen
let GAME_MODE = 0;

//SOURCING START SCREEN IMAGES
const start_screen_bg = new Image();
start_screen_bg.src = "/static/img/start_screen_bg.png";
const start_button = new Image();
start_button.src = "/static/img/start_button.png";
const tutorial_button = new Image();
tutorial_button.src = "/static/img/tutorial_button.png";

//SOURCING TUTORIAL IMAGES
let TUTORIAL_CARD = 0;
let GAME_CARD = 0;

const tutorial_card_0 = new Image();
tutorial_card_0.src = "/static/img/tutorial_card_0.png";
const tutorial_card_1 = new Image();
tutorial_card_1.src = "/static/img/tutorial_card_1.png";
const tutorial_card_2 = new Image();
tutorial_card_2.src = "/static/img/tutorial_card_2.png";
const tutorial_card_3 = new Image();
tutorial_card_3.src = "/static/img/tutorial_card_3.png";

//tutorial images put together into list
const tutorial_card_list = [tutorial_card_0, tutorial_card_1, tutorial_card_2, tutorial_card_3];

//MOVING BETWEEN MODES / CARDS
const left_arrow = new Image();
left_arrow.src = "/static/img/left_arrow.png";
const right_arrow = new Image();
right_arrow.src = "/static/img/right_arrow.png";

const exit_cross = new Image();
exit_cross.src = "/static/img/exit_cross.png";

//INVENTORY BAR
const inventory_background = new Image();
inventory_background.src = "/static/img/inventory_background.png"

// INVENTORY SLOTS
const empty_inventory_slot_background = new Image();
empty_inventory_slot_background.src = "/static/img/empty_inventory_slot_background.png";
const INVENTORY = [null, null, null, null];

//MAIN GAME BACKGROUNDS
const background_card_0 = new Image();
background_card_0.src = "/static/img/background_card_0.png";
const background_card_1 = new Image();
background_card_1.src = "/static/img/background_card_1.png";
const background_card_2 = new Image();
background_card_2.src = "/static/img/background_card_2.png";
const background_card_3 = new Image();
background_card_3.src = "/static/img/background_card_3.png";

const main_game_card_list = [background_card_0, background_card_1, background_card_2, background_card_3];

// INGREDIENTS located in shelves, fridge
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

//Connects JSON to JS
fetch('/static/js/foods.json')
    .then(response => response.json())
    .then(data => {

        FOOD = data;
        for (const foodName in FOOD) {

            const inventoryImage = new Image();
            inventoryImage.src = FOOD[foodName].inventory_image;
            FOOD[foodName].loadedInventoryImage = inventoryImage;

            if (foodName == "bun_hotdog" || foodName == "bun_burger") {
                const platedTopImage = new Image();
                platedTopImage.src = FOOD[foodName].plated_image_top;
                FOOD[foodName].loadedPlatedTopImage = platedTopImage;

                const platedBottomImage = new Image();
                platedBottomImage.src = FOOD[foodName].plated_image_bottom;
                FOOD[foodName].loadedPlatedBottomImage = platedBottomImage;

            } else {
                const platedImage = new Image();
                platedImage.src = FOOD[foodName].plated_image;
                FOOD[foodName].loadedPlatedImage = platedImage;
            }
        }

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

//USES JSON AS TEMPLATE FOR FOODS
function createFood(type) {
    return {
        type: type,
        isCooked: false, //if its a sausage or meat, show cooked variant
        isStock: true //if its in stock, show stock, if in inventory, show its basic image
    };
}

//TO LOAD IMG
function loadImage(img) {
    return new Promise((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = reject;
    });
}

//TO GET COORDINATES OF CLICK
function get_coordinates(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * (canvas.width / rect.width),
    y: (event.clientY - rect.top) * (canvas.height / rect.height)
  };
}

//LISTENS FOR USER CLICK
canvas.addEventListener('click', trigger_buttons);

//convert this into the one above
//canvas.addEventListener('click', gather_stock_food);

function trigger_buttons(event){
    //console.log("get_coordinates click detected");
    const coords = get_coordinates(event);
    //console.log(coords);
    if (GAME_MODE==0) {
        //.log("click detected on start page");
        trigger_buttons_start(coords);
    } else if (GAME_MODE==1) {
        //console.log("click detected on tutorial page");
        trigger_buttons_tutorial(coords);
    } else if (GAME_MODE == 2) {
        //console.log("click detected on game page");
        trigger_buttons_main_game(coords);
    } else if (GAME_MODE == 3){
        //console.log("click detected on night page");
    }
}

//CHECKS TO SEE IF BUTTONS ON START WERE PRESSED
function trigger_buttons_start(c) {
    let start_button_x = canvas.width/8;
    let start_button_y = canvas.height*2/3;
    let start_button_width = start_button.width * (SCALE)/2;
    let start_button_height = start_button.height * (SCALE)/2;

    let tutorial_button_x = canvas.width*5/8;
    let tutorial_button_y = canvas.height*2/3;
    let tutorial_button_width = tutorial_button.width * (SCALE)/2;
    let tutorial_button_height = tutorial_button.height * (SCALE)/2;

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

    let left_arrow_x = left_arrow.width*(SCALE)/6;
    let left_arrow_y = canvas.height/2;

    let right_arrow_x = canvas.width - right_arrow.width*(SCALE)/1.6;
    let right_arrow_y = canvas.height/2;

    let arrow_width = left_arrow.width*(SCALE)/2;
    let arrow_height = left_arrow.height*(SCALE)/2;

    let exit_cross_x = canvas.width - (exit_cross.width)*(SCALE)/1.5;
    let exit_cross_y = (exit_cross.height)*(SCALE)/6.5;
    let exit_cross_width = exit_cross.width*(SCALE)/2;
    let exit_cross_height = exit_cross.height*(SCALE)/2;

    if (c.x > left_arrow_x && c.x < left_arrow_x + arrow_width) {
        if (c.y > left_arrow_y && c.y < left_arrow_y + arrow_height) {
            trigger_arrows(true);
            //console.log("left");
        }
    } else if (c.x > right_arrow_x && c.x < right_arrow_x + arrow_width) {
        if (c.y > right_arrow_y && c.y < right_arrow_y + arrow_height) {
            trigger_arrows(false);
            //console.log("right");
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

    let left_arrow_x = left_arrow.width*(SCALE)/24;
    let left_arrow_y = canvas.height/2;

    let right_arrow_x = canvas.width - right_arrow.width*(SCALE)/1.8;
    let right_arrow_y = canvas.height/2;

    let arrow_width = left_arrow.width*(SCALE)/2;
    let arrow_height = left_arrow.height*(SCALE)/2;

    if (c.x > left_arrow_x && c.x < left_arrow_x + arrow_width) {
        if (c.y > left_arrow_y && c.y < left_arrow_y + arrow_height) {
            trigger_arrows(true);
        }
    } else if (c.x > right_arrow_x && c.x < right_arrow_x + arrow_width) {
        if (c.y > right_arrow_y && c.y < right_arrow_y + arrow_height) {
            trigger_arrows(false);
        }
    }

    check_inventory_interaction(c);
}

let SELECTED_ITEM = null;
let isPrevInv = false; //prevents ability to dupe items in inventory ;D
let prevInv = -1;

let PLATE00 = [];
let PLATE01 = [];
let PLATE10 = [];
let PLATE11 = [];

let PAN0 = null;
let PAN1= null;

function contains_burger(plate) {
    return (
        plate.includes("bun_burger") ||
        plate.includes("tomato") ||
        plate.includes("lettuce") ||
        plate.includes("patty")
    );
}

function contains_hotdog(plate) {
    return (
        plate.includes("bun_hotdog") ||
        plate.includes("sausage") ||
        plate.includes("sauce")
    );
}

function plate_food(food, plate) {
    if (plate.includes(food)) {
        console.log("food added");
        return;
    }

    if (
        (food == "bun_hotdog" ||
        food == "sausage" ||
        food == "sauce")
        &&
        contains_burger(plate)
    ) {
        console.log("cannot mix burgers and hotdogs");
        return;
    }

    if (
        (food == "bun_burger" ||
        food == "tomato" ||
        food == "lettuce" ||
        food == "patty")
        &&
        contains_hotdog(plate)
    ) {
        console.log("cannot mix burgers and hotdogs");
        return;
    }

    console.log("food added");
    plate.push(food);
    INVENTORY[prevInv] = null;
}

function check_inventory_interaction(c) {
    //console.log(c);
    //console.log(prevInv);

    const in_width = 200 * SCALE * 0.5 //inventory item width/height, knowing they're 200x200
    //c.x is x, c.y is y
    // CHECKS IF AN INGREDIENT WAS SELECTED ON THE TWO PAGES, ADDS TO SELECTED_ITEM
    //fix coordinates of items

    if (GAME_CARD == 0) {
        const tomatoImage = new Image();
        tomatoImage.src = FOOD[INGREDIENTS[0][0]].stock_image;

        const tomatoX = tomatoImage.width * SCALE * 0.6;
        const tomatoY = 0.7 * tomatoImage.height * SCALE;

        if (
            c.x >= tomatoX &&
            c.x <= tomatoX + in_width &&
            c.y >= tomatoY &&
            c.y <= tomatoY + in_width
        ) {SELECTED_ITEM = INGREDIENTS[0][0];}

        const burgerBunImage = new Image();
        burgerBunImage.src = FOOD[INGREDIENTS[0][1]].stock_image;

        const burgerBunX = 2.9 * burgerBunImage.width * SCALE;
        const burgerBunY = 1.3 * burgerBunImage.height * SCALE;

        if (
            c.x >= burgerBunX &&
            c.x <= burgerBunX + in_width &&
            c.y >= burgerBunY &&
            c.y <= burgerBunY + in_width
        ) {SELECTED_ITEM = INGREDIENTS[0][1];}

        const hotdogBunImage = new Image();
        hotdogBunImage.src = FOOD[INGREDIENTS[0][2]].stock_image;

        const hotdogBunX = 2.4 * hotdogBunImage.width * SCALE;
        const hotdogBunY = 1.3 * hotdogBunImage.height * SCALE;

        if (
            c.x >= hotdogBunX &&
            c.x <= hotdogBunX + in_width &&
            c.y >= hotdogBunY &&
            c.y <= hotdogBunY + in_width
        ) {SELECTED_ITEM = INGREDIENTS[0][2];}

        const sauceImage = new Image();
        sauceImage.src = FOOD[INGREDIENTS[0][3]].stock_image;

        const sauceX = 1.2 * sauceImage.width * SCALE;
        const sauceY = 1.4 * sauceImage.height * SCALE;
        if (
            c.x >= sauceX &&
            c.x <= sauceX + in_width &&
            c.y >= sauceY &&
            c.y <= sauceY + in_width
        ) {SELECTED_ITEM = INGREDIENTS[0][3];}

    }
    else if (GAME_CARD == 1) {

        const lettuceImage = new Image();
        lettuceImage.src = FOOD[INGREDIENTS[1][0]].stock_image;

        const lettuceX = 0.6 * lettuceImage.width * SCALE;
        const lettuceY = 0.8 * lettuceImage.height * SCALE;

        if (
            c.x >= lettuceX &&
            c.x <= lettuceX + in_width &&
            c.y >= lettuceY &&
            c.y <= lettuceY + in_width
        ) {SELECTED_ITEM = INGREDIENTS[1][0];}

        const pattyImage = new Image();
        pattyImage.src = FOOD[INGREDIENTS[1][1]].stock_image;

        const pattyX = 1.2 * pattyImage.width * SCALE;
        const pattyY = 1.5 * pattyImage.height * SCALE;

        if (
            c.x >= pattyX &&
            c.x <= pattyX + in_width &&
            c.y >= pattyY &&
            c.y <= pattyY + in_width
        ) {SELECTED_ITEM = INGREDIENTS[1][1];}

        const sausageImage = new Image();
        sausageImage.src = FOOD[INGREDIENTS[1][2]].stock_image;

        const sausageX = 0.65 * sausageImage.width * SCALE;
        const sausageY = 1.5 * sausageImage.height * SCALE;

        if (
            c.x >= sausageX &&
            c.x <= sausageX + in_width &&
            c.y >= sausageY &&
            c.y <= sausageY + in_width
        ) {SELECTED_ITEM = INGREDIENTS[1][2];}

    }
    else if (GAME_CARD == 2) {
        //TRASH FEATURE
        //hard coding coordinates cuz sad and tired
        const trashXI = canvas.width/15;
        const trashYI = canvas.height - canvas.height/3;
        const trashXF = canvas.width/4;
        const trashYF = canvas.height - canvas.height/5;
        //console.log(trashXI, trashYI, trashXF, trashYF);

        if (
            c.x >= trashXI &&
            c.x <= trashXF &&
            c.y >= trashYI &&
            c.y <= trashYF
        ) {
            //console.log("TRASH CLICKED");
    if (SELECTED_ITEM != null) {

        // if item came from inventory, clear inventory slot too
        if (isPrevInv && prevInv != -1) {
            INVENTORY[prevInv] = null;
        }

        SELECTED_ITEM = null;
        isPrevInv = false;
        prevInv = -1;

        console.log("item trashed");
    }
}

        //PLATES AND PANS ASSEMBLY
        const p1x = canvas.width/2.10 * SCALE; //0.
        const p1y = canvas.height/1.5*SCALE; //..

        const p2x = canvas.width/2.10 * SCALE; //..
        const p2y = canvas.height/0.8*SCALE;  //0.

        const p3x = canvas.width/0.8*SCALE;  //.0
        const p3y = canvas.height/1.5*SCALE;//..

        const p4x = canvas.width/0.725*SCALE; //..
        const p4y = canvas.width/1.175*SCALE; //.0

        const pan1x = canvas.width/0.47*SCALE;
        const pan1y = canvas.height/1.3*SCALE;

        const pan2x = canvas.width/0.45*SCALE;
        const pan2y = canvas.width/1.175*SCALE;

        const p_width = canvas.width/2.5*SCALE;
        const p_height = canvas.height/2.5*SCALE;

        //console.log(p1x, p1y, p1x+p_width, p1y+p_height);
        if (
            c.x >= p1x &&
            c.x <= p1x + p_width &&
            c.y >= p1y &&
            c.y <= p1y + p_height
        ) {
            //console.log("PLATE 1");
            if (INVENTORY[prevInv] != null) {
                plate_food(INVENTORY[prevInv], PLATE00);
            } else if (PLATE00.length > 0) {
                SELECTED_ITEM = {
                    type: "plate",
                    items: [...PLATE00]
                };
                PLATE00 = [];
            }
        }

        if (
            c.x >= p2x &&
            c.x <= p2x + p_width &&
            c.y >= p2y &&
            c.y <= p2y + p_height
        ) {
            if (INVENTORY[prevInv] != null) {
                plate_food(INVENTORY[prevInv], PLATE01);
            } else if (PLATE01.length > 0) {
                SELECTED_ITEM = {
                    type: "plate",
                    items: [...PLATE01]
                };
                PLATE01 = [];
            }
        }

        if (
            c.x >= p3x &&
            c.x <= p3x + p_width &&
            c.y >= p3y &&
            c.y <= p3y + p_height
        ) {
            if (INVENTORY[prevInv] != null) {
                plate_food(INVENTORY[prevInv], PLATE10)
            }  else if (PLATE10.length > 0) {
                SELECTED_ITEM = {
                    type: "plate",
                    items: [...PLATE10]
                };
                PLATE10 = [];
            }
        }

        if (
            c.x >= p4x &&
            c.x <= p4x + p_width &&
            c.y >= p4y &&
            c.y <= p4y + p_height
        ) {
            if (INVENTORY[prevInv] != null) {
                plate_food(INVENTORY[prevInv], PLATE11)
            } else if (PLATE11.length > 0) {
                SELECTED_ITEM = {
                    type: "plate",
                    items: [...PLATE11]
                };
                PLATE11 = [];
            }
        }

        if (
            c.x >= pan1x &&
            c.x <= pan1x + p_width &&
            c.y >= pan1y &&
            c.y <= pan1y + p_height
        ) {
            //can only put meat, or can put all but only does something to meat
            if (INVENTORY[prevInv] != null && PAN0 == null) {
                PAN0 = INVENTORY[prevInv];
                INVENTORY[prevInv] = null;
            }
        }

        if (
            c.x >= pan2x &&
            c.x <= pan2x + p_width &&
            c.y >= pan2y &&
            c.y <= pan2y + p_height
        ) {
            if (INVENTORY[prevInv] != null && PAN1 == null) {
                PAN1 = INVENTORY[prevInv];
                INVENTORY[prevInv] = null;
            }
        }
    }

    // ---------- INVENTORY ----------
    console.log(SELECTED_ITEM)


    const slotWidth = empty_inventory_slot_background.width*0.5*SCALE;
    const slotHeight = empty_inventory_slot_background.height*0.5*SCALE;
    for (let i = 0; i < 4; i++) {
        const slotX = 0.2*empty_inventory_slot_background.width*SCALE + i*empty_inventory_slot_background.width*SCALE;
        const slotY = canvas.height - 0.4*empty_inventory_slot_background.height*1.5*SCALE;

        if (
            c.x >= slotX &&
            c.x <= slotX + slotWidth &&
            c.y >= slotY &&
            c.y <= slotY + slotHeight
        ) { prevInv = i;
            if (SELECTED_ITEM != null && INVENTORY[i] == null) {
                //console.log("pressed " + i + " inventory slot, placed item");
                INVENTORY[i] = SELECTED_ITEM;
                SELECTED_ITEM = null;
                isPrevInv = false;
            } else if (INVENTORY[i] != null) {
                //console.log("pressed inventory slot with item");
                SELECTED_ITEM = INVENTORY[i];
                prevInv = i;
                isPrevInv = true;
            }
        }
    }
}

function trigger_arrows(IsLeft) {
    if (GAME_MODE == 1) {
        if (IsLeft == true) {
            TUTORIAL_CARD = TUTORIAL_CARD - 1;
            if (TUTORIAL_CARD == -1) {
                TUTORIAL_CARD = 3;
            }
        }
        else if (IsLeft == false) {
            TUTORIAL_CARD = TUTORIAL_CARD + 1;
            //console.log("RIGHT ARROW");
            if (TUTORIAL_CARD == 4) {
                TUTORIAL_CARD = 0;
            }
        }
        //console.log(TUTORIAL_CARD);
    } else if (GAME_MODE == 2) {
        if (IsLeft == true) {
            GAME_CARD = GAME_CARD - 1;
            //console.log("LEFT ARROW");
            if (GAME_CARD == -1) {
                GAME_CARD = 3;
            }
        }
        else if (IsLeft == false) {
            GAME_CARD = GAME_CARD + 1;
            //console.log("RIGHT ARROW");
            if (GAME_CARD == 4) {
                GAME_CARD = 0;
            }
        }
    }
}

function trigger_exit_cross() {
    if (GAME_MODE == 1) {
        GAME_MODE = 0;
        TUTORIAL_CARD = 0;
    } else if (GAME_MODE == 3) {
        GAME_MODE = 2;
    }
}

//DRAWS ALL ENTITIES ON START SCREEN
function start_screen() {
    //console.log("start_screen launched");
    try {
        //const images = await Promise.all([start_screen_bg, start_button, tutorial_button].map(src => loadImage(src)));

        //const SCALE_FACTOR = start_button.width / canvas.width;

        context.drawImage(
            start_screen_bg, 0, 0, canvas.width, canvas.height
        );

        context.drawImage(
            start_button, canvas.width/8, canvas.height*2/3, start_button.width * (SCALE)/2, start_button.height * (SCALE)/2
        );

        context.drawImage(
            tutorial_button, canvas.width*5/8, canvas.height*2/3, tutorial_button.width * (SCALE)/2, tutorial_button.height * (SCALE)/2
        );
    } catch (error) {
        console.error("Some images may have not loaded");
    }
}

//DRAWS ALL ENTITIES ON TUTORIAL SCREEN
function tutorial_screen() {
    //console.log("tutorial_screen launched");
    try {
        context.drawImage(
            tutorial_card_list[TUTORIAL_CARD], 0, 0, canvas.width, canvas.height
        );
        context.drawImage(
            exit_cross, canvas.width - (exit_cross.width)*(SCALE)/1.5, (exit_cross.height)*(SCALE)/6.5, exit_cross.width*(SCALE)/2, exit_cross.height*(SCALE)/2
        );

        context.drawImage(
            left_arrow, left_arrow.width*(SCALE)/6, canvas.height/2, left_arrow.width*(SCALE)/2, left_arrow.height*(SCALE)/2
        );
        context.drawImage(
            right_arrow, canvas.width - right_arrow.width*(SCALE)/1.6, canvas.height/2, right_arrow.width*(SCALE)/2, right_arrow.height*(SCALE)/2
        );
    } catch (error) {
        console.error("Some images may have not loaded");
    }
}

function draw_plated_food() {

    const p1x = canvas.width/2.10 * SCALE;
    const p1y = canvas.height/1.5 * SCALE;

    const p2x = canvas.width/2.10 * SCALE;
    const p2y = canvas.height/0.8 * SCALE;

    const p3x = canvas.width/0.8 * SCALE;
    const p3y = canvas.height/1.5 * SCALE;

    const p4x = canvas.width/0.725 * SCALE;
    const p4y = canvas.width/1.175 * SCALE;

    const pan1x = canvas.width/0.47 * SCALE;
    const pan1y = canvas.height/1.3 * SCALE;

    const pan2x = canvas.width/0.45 * SCALE;
    const pan2y = canvas.width/1.175 * SCALE;

    const foodWidth = 60 * SCALE;
    const foodHeight = 60 * SCALE;

    //PLATE STUFFFFF
    for (let i = 0; i < PLATE00.length; i++) {

        if (PLATE00[i] != null && FOOD[PLATE00[i]] != null) {
            if (PLATE00[i] == "bun_burger" || PLATE00[i] == "bun_hotdog") {
                const img1 = FOOD[PLATE00[i]].loadedPlatedTopImage;
                const img2 = FOOD[PLATE00[i]].loadedPlatedBottomImage;

                if (img2 && img2.complete) {
                    context.drawImage(
                        img2,
                        p1x + i * 15 * SCALE,
                        p1y,
                        foodWidth,
                        foodHeight
                    );
                    context.drawImage(
                        img1,
                        p1x + i * 15 * SCALE,
                        p1y,
                        foodWidth,
                        foodHeight
                    );
                }
            } else {
                const img = FOOD[PLATE00[i]].loadedPlatedImage;

                if (img && img.complete) {

                    context.drawImage(
                        img,
                        p1x + i * 15 * SCALE,
                        p1y,
                        foodWidth,
                        foodHeight
                        );

                    }
                }
            }
        }

    for (let i = 0; i < PLATE01.length; i++) {

        if (PLATE01[i] != null && FOOD[PLATE01[i]] != null) {
            if (PLATE01[i] == "bun_burger" || PLATE01[i] == "bun_hotdog") {
                const img1 = FOOD[PLATE01[i]].loadedPlatedTopImage;
                const img2 = FOOD[PLATE01[i]].loadedPlatedBottomImage;

                if (img2 && img2.complete) {
                    context.drawImage(
                        img2,
                        p2x + i * 15 * SCALE,
                        p2y,
                        foodWidth,
                        foodHeight
                    );
                    context.drawImage(
                        img1,
                        p2x + i * 15 * SCALE,
                        p2y,
                        foodWidth,
                        foodHeight
                    );
                }
            } else {
                const img = FOOD[PLATE01[i]].loadedPlatedImage;

                if (img && img.complete) {

                    context.drawImage(
                        img,
                        p2x + i * 15 * SCALE,
                        p2y,
                        foodWidth,
                        foodHeight
                        );

                    }
                }
            }
        }

    for (let i = 0; i < PLATE10.length; i++) {

        if (PLATE10[i] != null && FOOD[PLATE10[i]] != null) {
            if (PLATE10[i] == "bun_burger" || PLATE10[i] == "bun_hotdog") {
                const img1 = FOOD[PLATE10[i]].loadedPlatedTopImage;
                const img2 = FOOD[PLATE10[i]].loadedPlatedBottomImage;

                if (img2 && img2.complete) {
                    context.drawImage(
                        img2,
                        p3x + i * 15 * SCALE,
                        p3y,
                        foodWidth,
                        foodHeight
                    );
                    context.drawImage(
                        img1,
                        p3x + i * 15 * SCALE,
                        p3y,
                        foodWidth,
                        foodHeight
                    );
                }
            } else {
                const img = FOOD[PLATE10[i]].loadedPlatedImage;

                if (img && img.complete) {

                    context.drawImage(
                        img,
                        p3x + i * 15 * SCALE,
                        p3y,
                        foodWidth,
                        foodHeight
                        );

                    }
                }
            }
        }

    for (let i = 0; i < PLATE11.length; i++) {

        if (PLATE11[i] != null && FOOD[PLATE11[i]] != null) {
            if (PLATE11[i] == "bun_burger" || PLATE11[i] == "bun_hotdog") {
                const img1 = FOOD[PLATE11[i]].loadedPlatedTopImage;
                const img2 = FOOD[PLATE11[i]].loadedPlatedBottomImage;

                if (img2 && img2.complete) {
                    context.drawImage(
                        img2,
                        p4x + i * 15 * SCALE,
                        p4y,
                        foodWidth,
                        foodHeight
                    );
                    context.drawImage(
                        img1,
                        p4x + i * 15 * SCALE,
                        p4y,
                        foodWidth,
                        foodHeight
                    );
                }
            } else {
                const img = FOOD[PLATE11[i]].loadedPlatedImage;

                if (img && img.complete) {

                    context.drawImage(
                        img,
                        p4x + i * 15 * SCALE,
                        p4y,
                        foodWidth,
                        foodHeight
                        );

                    }
                }
            }
        }

    // PANM STUFF
    if (
        PAN0 != null &&
        FOOD[PAN0] != null
    ) {

        const img = FOOD[PAN0].loadedPlatedImage;

        if (img && img.complete) {

            context.drawImage(
                img,
                pan1x,
                pan1y,
                foodWidth,
                foodHeight
            );

        }
    }

    if (
        PAN1 != null &&
        FOOD[PAN1] != null
    ) {

        const img = FOOD[PAN1].loadedPlatedImage;

        if (img && img.complete) {

            context.drawImage(
                img,
                pan2x,
                pan2y,
                foodWidth,
                foodHeight
            );

        }
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
            left_arrow, left_arrow.width*(SCALE)/24, canvas.height/2, left_arrow.width*(SCALE)/2, left_arrow.height*(SCALE)/2
        );
        context.drawImage(
            right_arrow, canvas.width - right_arrow.width*(SCALE)/1.8, canvas.height/2, right_arrow.width*(SCALE)/2, right_arrow.height*(SCALE)/2
        );
    } catch (error) {
        console.error("Some images may have not loaded");
    }

    //drawing the inventory bar
    try {
        for (let i = 0; i < 4; i++) {
            if (INVENTORY[i] == null) {
                //console.log("EMPTYYYY");
                //console.log(i);
                context.drawImage(
                    empty_inventory_slot_background, 0.2*empty_inventory_slot_background.width*SCALE + i*empty_inventory_slot_background.width*SCALE, canvas.height - 0.4*empty_inventory_slot_background.height*1.5*SCALE, empty_inventory_slot_background.width*0.5*SCALE, empty_inventory_slot_background.height*0.5*SCALE
                )
            } else if (INVENTORY[i] != null) {

    // NORMAL INGREDIENT
    if (typeof INVENTORY[i] === "string") {

        const inventory_image = new Image();
        inventory_image.src = FOOD[INVENTORY[i]].inventory_image;

        inventory_image.onload = function () {
            context.drawImage(
                inventory_image,
                0.2*inventory_image.width*SCALE + i*inventory_image.width*SCALE,
                canvas.height - 0.4*inventory_image.height*1.5*SCALE,
                inventory_image.width*0.5*SCALE,
                inventory_image.height*0.5*SCALE
            );
        };
    }

    // PLATED MEAL
    else if (INVENTORY[i].type == "plate") {

        // draw a plate icon
        // or draw first ingredient
        const firstFood = INVENTORY[i].items[0];

        const inventory_image = new Image();
        inventory_image.src = FOOD[firstFood].inventory_image;

        inventory_image.onload = function () {
            context.drawImage(
                inventory_image,
                0.2*inventory_image.width*SCALE + i*inventory_image.width*SCALE,
                canvas.height - 0.4*inventory_image.height*1.5*SCALE,
                inventory_image.width*0.5*SCALE,
                inventory_image.height*0.5*SCALE
            );
        };
    }
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
                context.drawImage(tomatoImage, tomatoImage.width * SCALE * 0.6, 0.7 * tomatoImage.height * SCALE, tomatoImage.width * SCALE * 0.5, tomatoImage.height * SCALE * 0.5);
            };

            // BURGER BUN
            const burgerBunImage = new Image();
            burgerBunImage.src = FOOD[INGREDIENTS[0][1]].stock_image;

            burgerBunImage.onload = function () {
                context.drawImage(burgerBunImage, 2.9 * burgerBunImage.width * SCALE, 1.3 * burgerBunImage.height * SCALE, burgerBunImage.width * SCALE * 0.5, burgerBunImage.height * SCALE * 0.5);
            };

            // HOTDOG BUN
            const hotdogBunImage = new Image();
            hotdogBunImage.src = FOOD[INGREDIENTS[0][2]].stock_image;

            hotdogBunImage.onload = function () {
                context.drawImage(hotdogBunImage, 2.4 * hotdogBunImage.width * SCALE, 1.3 * hotdogBunImage.height * SCALE, hotdogBunImage.width * SCALE * 0.5, hotdogBunImage.height * SCALE * 0.5);
            };

            // SAUCE
            const sauceImage = new Image();
            sauceImage.src = FOOD[INGREDIENTS[0][3]].stock_image;

            sauceImage.onload = function () {
                context.drawImage(sauceImage, 1.2 * sauceImage.width * SCALE, 1.4 * sauceImage.height * SCALE, sauceImage.width * SCALE * 0.5, sauceImage.height * SCALE * 0.5);
            };
        } else if (GAME_CARD == 1) {

            // LETTUCE
            const lettuceImage = new Image();
            lettuceImage.src = FOOD[INGREDIENTS[1][0]].stock_image;

            lettuceImage.onload = function () {
                context.drawImage(lettuceImage, 0.6 * lettuceImage.width * SCALE, 0.8 * lettuceImage.height * SCALE, lettuceImage.width * SCALE * 0.5, lettuceImage.height * SCALE * 0.5);
            };

            // PATTY
            const pattyImage = new Image();
            pattyImage.src = FOOD[INGREDIENTS[1][1]].stock_image;

            pattyImage.onload = function () {
                context.drawImage(pattyImage, 1.2 * pattyImage.width * SCALE, 1.5 * pattyImage.height * SCALE, pattyImage.width * SCALE * 0.5, pattyImage.height * SCALE * 0.5);
            };

            // SAUSAGE
            const sausageImage = new Image();
            sausageImage.src = FOOD[INGREDIENTS[1][2]].stock_image;

            sausageImage.onload = function () {
                context.drawImage(sausageImage, 0.65 * sausageImage.width * SCALE, 1.5 * sausageImage.height * SCALE, sausageImage.width * SCALE * 0.5, sausageImage.height * SCALE * 0.5);
            };

        }
    } catch (error) {
        console.error("Some images may have not loaded");
    }

    if (GAME_CARD == 2) {
        draw_plated_food();
    }
}

//function main_game() {
//    main_game_screen();
//}


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
        main_game_screen();
    }
    else if (GAME_MODE == 3) {
        //run night endgame
    }
}

setInterval(game, 240);
//game();
