function resize() {
    WIDTH = canvas.parentElement.clientWidth;
    HEIGHT = canvas.parentElement.clientHeight;
    renderer.resize(WIDTH, HEIGHT);
}