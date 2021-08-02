function play() {
    let heading = 0;
    if (input.left) {
        heading -= 1;
    }
    if (input.right) {
        heading += 1;
    }
    let jump = false;
    if (input.up && !jumped) {
        jump = true;
        jumped = true;
    }
    if (!input.up) {
        jumped = false;
    }
    let crouch = input.down;

    player.update_position(heading, jump, crouch, ticker.elapsedMS / 1000);
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
    if (player.crouched) {
        rect.scale.y = player.crouch_heightmod;
    }
    else {
        rect.scale.y = 1;
    }
    crosshair.position.set(mouse.x, mouse.y);
    crosshair.scale.set(scale, scale);
    game.position.set(-camera.x, -camera.y);
    renderer.render(stage);
}