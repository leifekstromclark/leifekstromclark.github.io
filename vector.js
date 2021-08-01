class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.norm = -1;
    }
    get_norm() {
        if (this.norm == -1) {
            this.norm = (this.x ** 2 + this.y ** 2) ** 0.5;
        }
        return this.norm;
    }
    add(other) {
        return new Vector(this.x + other.x, this.y + other.y);
    }
    subtract(other) {
        return new Vector(this.x - other.x, this.y - other.y);
    }
    multiply(other) {
        return new Vector(this.x * other, this.y * other);
    }
    divide(other) {
        return new Vector(this.x / other, this.y / other);
    }
    floor_divide(other) {
        return new Vector(Math.floor(this.x / other), Math.floor(this.y / other));
    }
    dot(other) {
        return this.x * other.x + this.y * other.y;
    }
    normalize() {
        return this.divide(this.get_norm());
    }
    round() {
        return new Vector(Math.round(this.x), Math.round(this.y));
    }
    rotate(origin, rotation) {
        let dx = this.x - origin.x;
        let dy = this.y - origin.y;
        let cos = Math.cos(rotation);
        let sin = Math.sin(rotation);
        return new Vector(origin.x + dx * cos + dy * -1 * sin, origin.y + dx * sin + dy * cos);
    }
}