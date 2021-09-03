class Polygon {
    constructor(points) {
        this.points = points;
    }
    get_center() {
        let sum = new Vector(0, 0);
        for (let point of this.points) {
            sum = sum.add(point);
        }
        return sum.divide(this.points.length);
    }
    translate(translation) {
        for (let i = 0; i < this.points.length; i++) {
            this.points[i] = this.points[i].add(translation);
        }
    }
    rotate(origin, rotation) {
        for (let i = 0; i < this.points.length; i++) {
            this.points[i] = this.points[i].rotate(origin, rotation);
        }
    }
}