function horizBound() {
    if (canvas.parentElement.clientHeight / ASPECT[1] * ASPECT[0] > canvas.parentElement.clientWidth) {
        return true;
    }
    return false;
}

function resize() {
    let width;
    let height;
    if (horizBound()) {
        width = canvas.parentElement.clientWidth;
        height = canvas.parentElement.clientWidth / ASPECT[0] * ASPECT[1];
    }
    else {
        height = canvas.parentElement.clientHeight;
        width = canvas.parentElement.clientHeight / ASPECT[1] * ASPECT[0];
    }
    renderer.resize(width, height);
}