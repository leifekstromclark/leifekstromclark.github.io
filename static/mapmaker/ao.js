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
                points.push(new Vector(point.x, point.y));
            }
            this.terrain.push(new Chunk(new Polygon(points), chunk['ground'], false, false));
        }
    }
    
    find_neighbors(chunk, ordered) {
        for (let other of this.terrain) {
            let index = ordered.indexOf(chunk);
            if (!ordered.includes(other) && other.ground) {
                other.connect_left = false;
                other.connect_right = false;
                if (chunk.poly.points[1].x == other.poly.points[0].x && chunk.poly.points[1].y == other.poly.points[0].y) {
                    ordered.splice(index + 1, 0, other);
                    chunk.connect_right = true;
                    other.connect_left = true;
                    ordered = this.find_neighbors(other, ordered);
                }
                else if (other.poly.points[1].x == chunk.poly.points[0].x && other.poly.points[1].y == chunk.poly.points[0].y) {
                    ordered.splice(index, 0, other);
                    other.connect_right = true;
                    chunk.connect_left = true;
                    ordered = this.find_neighbors(other, ordered);
                }
            }
        }
        return ordered;
    }

    update_connections() {
        let ordered = [];
        for (let chunk of this.terrain) {
            if (!ordered.includes(chunk)) {
                chunk.connect_left = false;
                chunk.connect_right = false;

                ordered.push(chunk);

                if (chunk.ground) {
                    ordered = this.find_neighbors(chunk, ordered);
                }
            }
        }
        this.terrain = ordered;
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