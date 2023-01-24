//Assign a canvas for pixi to use
const canvas = document.getElementById('canvas');

const ASPECT = [3, 4];
const NATIVE = 1000;

//Create a renderer and assign resize event
const renderer = new PIXI.Renderer({
    view: canvas,
    resolution: window.devicePixelRatio,
    backgroundColor: 0xFFFFFF
})
resize();
window.addEventListener('resize', resize);


//Create a main container
const stage = new PIXI.Container();
stage.interactive = true;
stage.on('click', receiveClick);
let turn = true;
let playing = true;
let game_board = new board(3, 750, 0, 250);
stage.addChild(game_board.graphic);
game_board.draw()

const style = new PIXI.TextStyle({
    fontFamily: 'Calibri',
    fontSize: 80,
    fill: 0x000000,
    dropShadow: true,
    dropShadowColor: 0x505050,
    dropShadowBlur: 4,
    dropShadowAngle: 2 * Math.PI / 6,
    dropShadowDistance: 10
});

const title = new PIXI.Text('Ultimate Tic-Tac-Toe!', style);
title.position.set(30, 20);
stage.addChild(title);

const stat = new PIXI.Text("Player's Turn", style);
stat.position.set(120, 120);
stage.addChild(stat);

const x_ind = new PIXI.Graphics();
x_ind.lineStyle(10, 0x900000);
x_ind.moveTo(0, 80);
x_ind.lineTo(80, 0);
x_ind.moveTo(80, 80);
x_ind.lineTo(0, 0);
x_ind.position.set(20, 115);
stage.addChild(x_ind);
x_ind.alpha = 0;

const o_ind = new PIXI.Graphics();
o_ind.lineStyle(10, 0x000090);
o_ind.drawCircle(40, 40, 40);
o_ind.position.set(20, 115);
stage.addChild(o_ind);

//Main loop
function gameLoop(){
    let scale = renderer.screen.height / NATIVE;
    stage.scale.set(scale, scale);
    renderer.render(stage);
}

//Create the ticker
const ticker = new PIXI.Ticker();
ticker.add(gameLoop);
ticker.start();