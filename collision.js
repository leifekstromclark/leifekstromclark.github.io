function project_points(axis, points) {
    let interval;
    for (let i = 0; i < points.length; i++) {
        let dot_product = axis.dot(points[i]);
        if (i == 0) {
            interval = [dot_product, dot_product];
        }
        else if (dot_product < interval[0]) {
            interval[0] = dot_product;
        }
        else if (dot_product > interval[1]) {
            interval[1] = dot_product;
        }
    }
    return interval;
}

function get_interval_distance(interval_a, interval_b) {
    let dist_a = interval_a[0] - interval_b[1];
    let dist_b = interval_b[0] - interval_a[1];
    if (Math.abs(dist_a) < Math.abs(dist_b)) {
        return dist_a;
    }
    return dist_b;
}

function air_collision(polygon_a, polygon_b) {
    let num_points_a = polygon_a.points.length;
    let num_points_b = polygon_b.points.length;
    let min_interval_distance;
    let translation_axis;

    for(let i = 0; i < num_points_a + num_points_b; i++) {
        let axis;
        if (i < num_points_a) {
            let inc = (i + 1) % num_points_a;
            axis = new Vector(-1 * (polygon_a.points[inc].y - polygon_a.points[i].y), polygon_a.points[inc].x - polygon_a.points[i].x);
        }
        else {
            let k = i - num_points_a;
            let inc = (k + 1) % num_points_b;
            axis = new Vector(-1 * (polygon_b.points[inc].y - polygon_b.points[k].y), polygon_b.points[inc].x - polygon_b.points[k].x);
        }

        axis = axis.normalize();

        let interval_a = project_points(axis, polygon_a.points);
        let interval_b = project_points(axis, polygon_b.points);


        let interval_distance = get_interval_distance(interval_a, interval_b);
        if (interval_distance > 0) {
            return [false];
        }

        interval_distance = Math.abs(interval_distance);
        if (i == 0 || interval_distance < min_interval_distance) {
            min_interval_distance = interval_distance;
            translation_axis = axis;

            if (translation_axis.dot(polygon_a.get_center().subtract(polygon_b.get_center())) < 0) {
                translation_axis = translation_axis.multiply(-1);
            }
        }
    }
    return [true, translation_axis.multiply(min_interval_distance)];
}

function points_to_coefficients(p1, p2) {
    let a = p1.y + p2.y;
    let b = p2.x + p1.x;
    let c = p1.x * p2.y - p2.x * p1.y;
    return [a, b, -c];
}

function intersect(co1, co2) {
    let det  = co1[0] * co2[1] - co1[1] * co2[0];
    let det_x = co1[2] * co2[1] - co1[1] * co2[2];
    let det_y = co1[0] * co2[2] - co1[2] * co2[0];
    if (det != 0) {
        return [true, new Vector(det_x / det, det_y / det)];
    }
    return [false];
}

function side(p1, p2, p3) {
    return (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x);
}

function grounded_collision(rectangle, poly, velocity, x) {
    let to_project = [];
    let base_co1 = points_to_coefficients(rectangle.points[0], rectangle.points[1]);
    let base_co2 = points_to_coefficients(rectangle.points[2], rectangle.points[3]);
    for (let i = 0; i < poly.points.length; i++) {
        let side_1 = side(rectangle.points[0], rectangle.points[1], poly.points[i]);
        let side_2 = side(rectangle.points[2], rectangle.points[3], poly.points[i]);

        if ((side_1 <= 0 && side_2 <= 0) || (side_1 >= 0 && side_2 >= 0)) {
            to_project.push(poly.points[i]);
        }

        let inc = (i + 1) % poly.points.length;
        let co = points_to_coefficients(poly.points[inc], poly.points[i]);
        let base_int = intersect(base_co1, co);
        if (base_int[0]) {
            let intersection = base_int[1].round();
            if (Math.min(poly.points[inc].x, poly.points[i].x) <= intersection.x && intersection.x <= Math.max(poly.points[inc].x, poly.points[i].x) && Math.min(poly.points[inc].y, poly.points[i].y) <= intersection.y && intersection.y <= Math.max(poly.points[inc].y, poly.points[i].y)) {
                to_project.push(intersection);
            }
        }
        base_int = intersect(base_co2, co);
        if (base_int[0]) {
            let intersection = base_int[1].round();
            if (Math.min(poly.points[inc].x, poly.points[i].x) <= intersection.x && intersection.x <= Math.max(poly.points[inc].x, poly.points[i].x) && Math.min(poly.points[inc].y, poly.points[i].y) <= intersection.y && intersection.y <= Math.max(poly.points[inc].y, poly.points[i].y)) {
                to_project.push(intersection);
            }
        }
    }
    if (to_project.length > 0) {
        let axis = (rectangle.points[1].subtract(rectangle.points[0])).normalize();

        let poly_interval = project_points(axis, to_project);
        let rect_interval = project_points(axis, [rectangle.points[0], rectangle.points[1]]);

        let velocity_projection = axis.dot(velocity);

        if (velocity_projection < 0) {
            rect_interval[0] += velocity_projection;
        }
        else {
            rect_interval[1] += velocity_projection;
        }

        let interval_distance = get_interval_distance(rect_interval, poly_interval);

        if (interval_distance > 0) {
            return [false];
        }
        
        interval_distance = Math.abs(interval_distance);

        if (velocity.x > 0) {
            axis = axis.multiply(-1);
        }
        
        return [true, axis.multiply(interval_distance)];
    }
    return [false];
}