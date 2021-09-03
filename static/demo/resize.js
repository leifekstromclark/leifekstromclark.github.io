function horizBound() {
    if (canvas.parentElement.clientHeight / 9 * 16 > canvas.parentElement.clientWidth) {
        return true;
    }
    return false;
}

function setSize() {
    if (horizBound()) {
        WIDTH = canvas.parentElement.clientWidth;
        HEIGHT = canvas.parentElement.clientWidth / 16 * 9;
    }
    else {
        HEIGHT = canvas.parentElement.clientHeight;
        WIDTH = canvas.parentElement.clientHeight / 9 * 16;
    }
}

function resize() {
    setSize();
    renderer.resize(WIDTH, HEIGHT);
}