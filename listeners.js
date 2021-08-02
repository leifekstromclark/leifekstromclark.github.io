function updateMouse(event) {
    if (event.data.global.x >= 0 && event.data.global.x <= WIDTH && event.data.global.y >= 0 && event.data.global.y <= HEIGHT) {
        mouse = new Vector(event.data.global.x, event.data.global.y);
    }
}

function keyDown(key) {
    if (key.keyCode === 65 || key.keyCode === 37) {
        keys[0] = true;
    }
    if (key.keyCode === 68 || key.keyCode === 39) {
        keys[1] = true;
    }
    if (key.keyCode === 87 || key.keyCode === 38 || key.keyCode === 32) {
        keys[2] = true;
    }
}

function keyUp(key) {
    if (key.keyCode === 65 || key.keyCode === 37) {
        keys[0] = false;
    }
    if (key.keyCode === 68 || key.keyCode === 39) {
        keys[1] = false;
    }
    if (key.keyCode === 87 || key.keyCode === 38 || key.keyCode === 32) {
        keys[2] = false;
    }
}