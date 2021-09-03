//Assign a canvas for pixi to use
const canvas = document.getElementById('mycanvas');

//Set the initial size of the canvas
let WIDTH = canvas.parentElement.clientWidth;
let HEIGHT = canvas.parentElement.clientHeight;

//Create a renderer and assign resize event
const renderer = new PIXI.Renderer({
    view: canvas,
    width: WIDTH,
    height: HEIGHT,
    resolution: window.devicePixelRatio,
    autoDensity: true,
    backgroundColor: 0x808080
})
window.addEventListener('resize', resize);

//Create a main container and assign mousemove event
const stage = new PIXI.Container();
stage.interactive = true;
canvas.addEventListener('mousedown', mouseDown);
canvas.addEventListener('mousemove', mouseMove);
canvas.addEventListener('mouseup', mouseUp);
canvas.addEventListener("wheel", mouseWheel);
window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

//Some variables
let viewport = new PIXI.Container();
stage.addChild(viewport);
let style = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 14,
    fill: '#ff0000',
});
let coords = new PIXI.Text('', style);
stage.addChild(coords);
let mouse_loc;
let mouse_down = false;
let down_loc;
let moving = null;
let move_start;
let dot_size = 5;
let snapping = false;
let bg;
let place_ground = false;
let placing = [];
let place_next;
let save_data = null;
const download = document.getElementById('download');

//Save
const save = document.getElementById('save');
save.addEventListener('click', function() {
    let obj = ao.save();
    save_data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
    download.setAttribute('href', 'data:' + save_data);
    download.setAttribute('download', 'map.json');
});

//Ground Toggle
const gt = document.getElementById('gt');
gt.addEventListener('click', function() {
    place_ground = !place_ground;
});

//Mode Selector
const ms = document.getElementById('ms');
ms.addEventListener('change', function() {
    if (this.value != 'add') {
        placing = [];
        place_next = null;
    }
});

//Image Upload
const upload = document.getElementById('upload');
upload.addEventListener('change', function() {
    if (this.files && this.files[0]) {
        viewport.removeChild(bg);
        bg = PIXI.Sprite.from(URL.createObjectURL(this.files[0]));
        bg.scale.set(zoom, zoom);
        viewport.addChild(bg);
        viewport.removeChild(grid);
        viewport.addChild(grid);
        viewport.removeChild(outlines);
        viewport.addChild(outlines);
        for (let chunk of ao.terrain) {
            for (let g of chunk.graphics) {
                viewport.removeChild(g);
                viewport.addChild(g);
            }
        }
    }
});

let grid = new PIXI.Graphics();
viewport.addChild(grid);
let grid_size = new Vector(4000, 2000);
let zoom = 2;
let ao = new AO();

function drawGrid() {
    grid.clear();
    for (let i = 0; i <= grid_size.x; i += 5) {
        if (i % 100 == 0) {
            grid.lineStyle(1, 0xffffff, 0.3);
        }
        else if (i % 25 == 0) {
            grid.lineStyle(1, 0xffffff, 0.2);
        }
        else {
            grid.lineStyle(1, 0xffffff, 0.1);
        }
        grid.moveTo(i * zoom, 0);
        grid.lineTo(i * zoom, grid_size.y * zoom);
    }
    for (let i = 0; i <= grid_size.y; i += 5) {
        if (i % 100 == 0) {
            grid.lineStyle(1, 0xffffff, 0.3);
        }
        else if (i % 25 == 0) {
            grid.lineStyle(1, 0xffffff, 0.2);
        }
        else {
            grid.lineStyle(1, 0xffffff, 0.1);
        }
        grid.moveTo(0, i * zoom);
        grid.lineTo(grid_size.x * zoom, i * zoom);
    }
}

drawGrid();

outlines = new PIXI.Graphics();
viewport.addChild(outlines);

//Main loop
function gameLoop() {

    outlines.clear();
    
    for (let chunk of ao.terrain) {
        let path = [];
        for (let i = 0; i < chunk.poly.points.length; i++) {
            if (chunk.ground && i == 0) {
                outlines.lineStyle(3, 0xB7EF35);
            }
            else {
                outlines.lineStyle(3, 0xf7ce1e);
            }
            let inc = (i + 1) % chunk.poly.points.length;
            if (i == 0) {
                outlines.moveTo(chunk.poly.points[i].x * zoom, chunk.poly.points[i].y * zoom);
            }
            outlines.lineTo(chunk.poly.points[inc].x * zoom, chunk.poly.points[inc].y * zoom);

        }
    }
    for (let chunk of ao.terrain) {
        for (let i = 0; i < chunk.poly.points.length; i++) {
            outlines.lineStyle(1, 0xf7ce1e);
            outlines.beginFill(0xf7ce1e);
            outlines.drawCircle(chunk.poly.points[i].x * zoom, chunk.poly.points[i].y * zoom, dot_size);
            outlines.endFill();
        }
    }

    for (let i = 0; i < placing.length - 1; i++) {
        if (place_ground && i == 0) {
            outlines.lineStyle(3, 0xB7EF35);
        }
        else {
            outlines.lineStyle(3, 0xf7ce1e);
        }
        outlines.moveTo(placing[i].x * zoom, placing[i].y * zoom);
        outlines.lineTo(placing[i + 1].x * zoom, placing[i + 1].y * zoom);
        outlines.lineStyle(1, 0xf7ce1e);
        outlines.beginFill(0xf7ce1e);
        outlines.drawCircle(placing[i].x * zoom, placing[i].y * zoom, dot_size);
        outlines.endFill();
    }
    if (place_next != null) {
        if (placing.length > 0) {
            if (place_ground && placing.length - 1 == 0) {
                outlines.lineStyle(3, 0xB7EF35);
            }
            else {
                outlines.lineStyle(3, 0xf7ce1e);
            }
            outlines.moveTo(placing[placing.length - 1].x * zoom, placing[placing.length - 1].y * zoom)
            outlines.lineTo(place_next.x * zoom, place_next.y * zoom);
            outlines.lineStyle(1, 0xf7ce1e);
            outlines.beginFill(0xf7ce1e);
            outlines.drawCircle(placing[placing.length - 1].x * zoom, placing[placing.length - 1].y * zoom, dot_size);
            outlines.endFill();
        }
        outlines.lineStyle(1, 0xf7ce1e);
        outlines.beginFill(0xf7ce1e);
        outlines.drawCircle(place_next.x * zoom, place_next.y * zoom, dot_size);
        outlines.endFill();
    }

    renderer.render(stage);
}

//Create the ticker
const ticker = new PIXI.Ticker();

ticker.add(gameLoop);

//Start the ticker
ticker.start();