function horizBound() {
    if (window.innerHeight / 9 * 16 > window.innerWidth) {
        return true;
    }
    return false;
}

function setSize() {
    if (horizBound()) {
        WIDTH = window.innerWidth;
        HEIGHT = window.innerWidth / 16 * 9;
    }
    else {
        HEIGHT = window.innerHeight;
        WIDTH = window.innerHeight / 9 * 16;
    }
}

function resize() {
    setSize();
    renderer.resize(WIDTH, HEIGHT);
}