class AO {
    constructor(map) {
        this.load_map(map);
    }

    load_map(map) {
        this.gravity = map['gravity'];
        this.terminal_velocity = map['terminal_velocity'];
        this.terrain = [];
        for (let chunk of map['terrain']) {
            let points = [];
            for (let point of chunk['points']) {
                points.push(new Vector(point.x, point.y))
            }
            this.terrain.push(new Chunk(new Polygon(points), chunk['ground'], chunk['connect_left'], chunk['connect_right']))
        }
    }
}