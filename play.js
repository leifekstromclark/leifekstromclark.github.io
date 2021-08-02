function play() {
    let heading = 0;
    if (keys[0]) {
        heading -= 1;
    }
    if (keys[1]) {
        heading += 1;
    }
    let jump = false;
    if (keys[2] && !jumped) {
        jump = true;
        jumped = true;
    }
    if (!keys[2]) {
        jumped = false;
    }

    player.update_position(heading, jump, false, ticker.elapsedMS / 1000);
    if (player.position.y > 2500) {
        player.translate(new Vector(1900, 600).subtract(player.position));
        player.velocity = 0;
    }

    let half_width = WIDTH / 2;
    let half_height = HEIGHT / 2;

    let scale = renderer.screen.height / 720;
    game.scale.set(scale, scale);

    camera = new Vector(player.position.x * scale - half_width + (mouse.x - half_width) / 2, player.position.y * scale - half_height + (mouse.y - half_height) / 2);
    
    rect.position.set(player.position.x, player.position.y);
    rect.rotation = player.rotation;
    crosshair.position.set(mouse.x, mouse.y);
    crosshair.scale.set(scale, scale);
    game.position.set(-camera.x, -camera.y);
    renderer.render(stage);
}