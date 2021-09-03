class AO {
    constructor() {
        this.gravity = 1000;
        this.terminal_velocity = 800;
        this.terrain = [];
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
    save() {
        let map = {'gravity': this.gravity, 'terminal_velocity': this.terminal_velocity, 'terrain': []};
        for (let chunk of this.terrain) {
            let to_add = {"points": [], "ground": chunk.ground, "connect_left": chunk.connect_left, "connect_right": chunk.connect_right};
            for (let point of chunk.poly.points) {
                to_add['points'].push({'x': point.x, 'y': point.y});
            }
            map['terrain'].push(to_add);
        }
        return map;
    }
}