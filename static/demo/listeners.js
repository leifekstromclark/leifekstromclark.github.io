function updateMouse(event) {
    if (event.data.global.x >= 0 && event.data.global.x <= WIDTH && event.data.global.y >= 0 && event.data.global.y <= HEIGHT) {
        mouse = new Vector(event.data.global.x, event.data.global.y);
    }
}

function keyDown(key) {
    if (key.keyCode === 65 || key.keyCode === 37) {
        input.left = true;
    }
    if (key.keyCode === 68 || key.keyCode === 39) {
        input.right = true;
    }
    if (key.keyCode === 87 || key.keyCode === 38 || key.keyCode === 32) {
        input.up = true;
    }
    if (key.keyCode === 83 || key.keyCode === 40 || key.keyCode === 17) {
        input.down = true;
    }
}

function keyUp(key) {
    if (key.keyCode === 65 || key.keyCode === 37) {
        input.left = false;
    }
    if (key.keyCode === 68 || key.keyCode === 39) {
        input.right = false;
    }
    if (key.keyCode === 87 || key.keyCode === 38 || key.keyCode === 32) {
        input.up = false;
    }
    if (key.keyCode === 83 || key.keyCode === 40 || key.keyCode === 17) {
        input.down = false;
    }
}