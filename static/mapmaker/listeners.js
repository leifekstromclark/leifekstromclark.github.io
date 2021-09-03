function keyDown(key) {
    if (key.keyCode === 17) {
        snapping = true;
    }
}

function keyUp(key) {
    if (key.keyCode === 17) {
        snapping = false;
    }
}

function mouseMove(event) {
    let rect = canvas.getBoundingClientRect();
    mouse_loc = new Vector(event.clientX - rect.left, event.clientY - rect.top);
    if (ms.value == 'edit') {
        if (mouse_down) {
            if (moving != null) {
                let pos = move_start.add(mouse_loc.subtract(down_loc).divide(zoom));
                if (snapping) {
                    pos = pos.divide(5).round().multiply(5);
                }
                if (pos.x < 0) {
                    pos.x = 0;
                }
                else if (grid_size.x < pos.x) {
                    pos.x = grid_size.x;
                }
                if (pos.y < 0) {
                    pos.y = 0;
                }
                else if (grid_size.y < pos.y) {
                    pos.y = grid_size.y;
                }
                ao.terrain[moving[0]].poly.points[moving[1]] = pos;
                coords.position.set(viewport.x + pos.x * zoom + 3, viewport.y + pos.y * zoom - 17);
                coords.text = pos.x.toString() + ", " + pos.y.toString();
            }
            else {
                viewport.position.set(move_start.x + mouse_loc.x - down_loc.x, move_start.y + mouse_loc.y - down_loc.y);
            }
        }
    }
    if (ms.value == 'add') {
        if (placing.length > 0 && new Vector(mouse_loc.x - viewport.position.x, mouse_loc.y - viewport.position.y).subtract(placing[0].multiply(zoom)).get_norm() <= dot_size) {
            place_next = placing[0];
        }
        else {
            place_next = new Vector(mouse_loc.x - viewport.position.x, mouse_loc.y - viewport.position.y).divide(zoom);
            if (snapping) {
                place_next = place_next.divide(5).round().multiply(5);
            }
            if (place_next.x < 0) {
                place_next.x = 0;
            }
            else if (grid_size.x < place_next.x) {
                place_next.x = grid_size.x;
            }
            if (place_next.y < 0) {
                place_next.y = 0;
            }
            else if (grid_size.y < place_next.y) {
                place_next.y = grid_size.y;
            }
        }
        coords.position.set(viewport.x + place_next.x * zoom + 3, viewport.y + place_next.y * zoom - 17);
        coords.text = place_next.x.toString() + ", " + place_next.y.toString();
    }
}

function mouseDown(event) {
    let rect = canvas.getBoundingClientRect();
    down_loc = new Vector(event.clientX - rect.left, event.clientY - rect.top);
    mouse_down = true;
    if (ms.value == 'edit') {
        for (let i = 0; i < ao.terrain.length; i++) {
            let chunk = ao.terrain[i];
            for (let k = 0; k < chunk.poly.points.length; k++) {
                if (new Vector(down_loc.x - viewport.position.x, down_loc.y - viewport.position.y).subtract(chunk.poly.points[k].multiply(zoom)).get_norm() <= dot_size) {
                    if (moving == null) {
                        moving = [i, k];
                        move_start = new Vector(chunk.poly.points[k].x, chunk.poly.points[k].y);
                    }
                }
            }
        }
        if (moving == null) {
            move_start = new Vector(viewport.position.x, viewport.position.y);
        }
    }
    if (ms.value == 'add') {
        if (placing.length > 0 && place_next == placing[0]) {
            ao.terrain.push(new Chunk(new Polygon(placing), place_ground, false, false)); // add finding connects
            placing = [];
            place_next = null;
        }
        else {
            placing.push(place_next);
        }
    }
}

function mouseUp(event) {
    mouse_down = false;
    if (ms.value == 'edit') {
        moving = null;
        coords.text = '';
    }
}

function mouseWheel(event) {
    let last_zoom = zoom;
    zoom += event.deltaY * -0.002;
    if (zoom < 1) {
        zoom = 1;
    }
    else if (zoom > 20) {
        zoom = 20;
    }
    if (bg != null) {
        bg.scale.set(zoom, zoom);
    }
    let delta_zoom = zoom - last_zoom;
    let relative_grid_pos = new Vector((mouse_loc.x - viewport.position.x) / (grid_size.x * last_zoom), (mouse_loc.y - viewport.position.y) / (grid_size.y * last_zoom));
    viewport.position.set(viewport.position.x - grid_size.x * delta_zoom * relative_grid_pos.x, viewport.position.y - grid_size.y * delta_zoom * relative_grid_pos.y);
    drawGrid();
}