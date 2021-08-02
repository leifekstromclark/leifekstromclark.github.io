//Assign a canvas for pixi to use
const canvas = document.getElementById('mycanvas');

//Set the initial size of the canvas
let WIDTH;
let HEIGHT;
setSize();

//Create a renderer and assign resize event
const renderer = new PIXI.Renderer({
    view: canvas,
    width: WIDTH,
    height: HEIGHT,
    resolution: window.devicePixelRatio,
    autoDensity: true
})
window.addEventListener('resize', resize);

let keys = [false, false]
window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

//Create a main container and assign mousemove event
const stage = new PIXI.Container();
stage.interactive = true;
stage.on('pointermove', updateMouse);

//Some variables
state = play;
let mouse = ZERO_VECTOR;
let img;
let crosshair;
let rect;
let outlines;
let ao = new AO(hijack);
let jumped = false;
let player = new Soldier(ao, new Vector(1000, 0), 50, 100, 300, null, null);

//Main loop
function gameLoop(){
    state();
}

//Create the ticker
const ticker = new PIXI.Ticker();

//Create the loader, assign events, add assets, and start the loader
let loader = PIXI.Loader.shared;

loader.onComplete.add(loadComplete);

loader.add('hijack.png');
loader.load();

//Start the ticker
ticker.start();