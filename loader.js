function loadComplete() {
    game = new PIXI.Container();
    stage.addChild(game);

    let texture = loader.resources['hijack.png'].texture;
    img = new PIXI.Sprite(texture);
    img.position.set(200, 440)
    game.addChild(img);

    outlines = new PIXI.Graphics();
    outlines.lineStyle(1, 0xffffff);
    
    for (let chunk of hijack['terrain']) {
        let path = [];
        for (let point of chunk['points']) {
            path.push(point.x);
            path.push(point.y);
        }
        outlines.drawPolygon(path);
    }
    game.addChild(outlines);

    rect = new PIXI.Graphics();
    rect.beginFill(0x66ff66);
    rect.drawRect(-25, -100, 50, 100);
    rect.endFill();
    game.addChild(rect);

    crosshair = new PIXI.Graphics();
    crosshair.lineStyle(1, 0xffffff);
    crosshair.drawCircle(0, 0, 10);
    crosshair.endFill();
    stage.addChild(crosshair);

    ticker.add(gameLoop);
}