class Soldier {

    constructor(ao, position, width, height, walking_speed, hitpoints, gun) {
        this.ao = ao;
        this.position = position;
        this.shoulder_offset = new Vector(width * -0.1, height * -0.7);
        this.shoulder = this.position.add(this.shoulder_offset);
        this.crouched_shoulder_offset = new Vector(0, height * -0.4);
        this.crouched_shoulder = this.position.add(this.crouched_shoulder_offset);
        this.width = width;
        this.height = height;
        let foot1 = new Vector(this.position.x - this.width / 2, this.position.y);
        let foot2 = new Vector(this.position.x + this.width / 2, this.position.y);
        this.rectangle = new Polygon([foot1, foot2, new Vector(foot2.x, foot2.y - this.height), new Vector(foot1.x, foot1.y - this.height)]);
        this.crouch_speedmod = 0.5;
        this.crouch_heightmod = 0.7;
        this.crouched = false;
        this.climbing = 0;
        this.rotation = 0;
        this.velocity = 0;
        this.grounded = -1;
        this.hitpoints = hitpoints;
        this.walking_speed = walking_speed;
        this.gun = gun;
    }
    

    //BRING BACK VELINCOL
    update_position(heading, jump, crouch, dt) {

        //if crouch input and not crouched and grounded
        if (crouch && !this.crouched && this.grounded != -1) {
            this.crouch(true);
        }
        //if no crouch input and crouched
        else if (!crouch && this.crouched) {
            this.uncrouch();
        }

        //if jump input (btw in the main file make it so that you have to release before jumping again)
        if (jump) {
            this.jump();
        }

        //if in the air
        if (this.grounded == -1) {
            let move;
            //if climbing and moving in climb direction
            if (this.climbing != 0 && this.climbing == this.heading) {
                move = new Vector(heading * this.walking_speed * dt, -this.walking_speed * dt);
            }
            else {
                //set translation
                let t1 = Math.min((this.ao.terminal_velocity - this.velocity) / this.ao.gravity, dt);
                move = new Vector(heading * this.walking_speed * dt, this.velocity * t1 + 0.5 * this.ao.gravity * t1 ** 2 + this.ao.terminal_velocity * (dt - t1));
                //update velocity
                this.velocity = Math.min(this.velocity + this.ao.gravity * dt, this.ao.terminal_velocity);
            }
            
            this.climbing = 0;

            let landed = false;
            let max_negation = 0;
    
            this.translate(move);

            //check all terrain for air collision
            for (let i = 0; i < this.ao.terrain.length; i++) {//OLD PYTHON COMMENT: MIGHT ADD THE FURTHER ITERATION THING
                

                //removed previous (now only land if falling down)

                let chunk = this.ao.terrain[i];
                let result = air_collision(this.rectangle, chunk.poly);

                //collision
                if (result[0]) {
                    //extricate soldier from ground
                    this.translate(result[1]);
                    //hit valid ground
                    if (chunk.ground) {
                        landed = this.land(i, result[1]);
                        //successful landing abort the air collision detection
                        if (landed) {
                            break;
                        }
                    }
                    let negation = result[1].normalize().y;
                    if (negation > max_negation) {
                        max_negation = negation;
                    }
                }
            }

            if (!landed && this.velocity < 0) {
                this.velocity -= this.velocity * max_negation;
            }
        }

        //on ground and moving
        else if (heading != 0) {
            let mod = 1;
            if (this.crouched) {
                mod = this.crouch_speedmod;
            }
            this.run(heading * this.walking_speed * mod * dt);
        }
    }
    
    land(i, translation_vector) {
        let chunk = this.ao.terrain[i];
        let to_ground = -1;
        let origin;
        let target;
        
        //OLD PYTHON COMMENTS
        //!!! this whole business might not work on vertical ledges !!!
        //add repeated checking after a collision until it collides with nothing (watch out for "just on edge" being a trigger)

        //create a vector representing the ground
        let ground_edge = chunk.poly.points[1].subtract(chunk.poly.points[0]);

        //both shoulders above the ground
        if (side(chunk.poly.points[1], chunk.poly.points[0], this.rectangle.points[3]) > 0 && side(chunk.poly.points[1], chunk.poly.points[0], this.rectangle.points[2]) > 0) {
            //determine the sign of the slope of ground (ground will always be left to right)
            if (chunk.poly.points[1].y >= chunk.poly.points[0].y) {
                //left foot within ground x
                if (chunk.poly.points[0].x < this.rectangle.points[0].x && this.rectangle.points[0].x < chunk.poly.points[1].x) {
                    //connection to the right and position after rotate will be off ground
                    if (chunk.connect_right && this.rectangle.points[0].x + ground_edge.normalize().x * this.width / 2 > chunk.poly.points[1].x) {
                        //keep falling - no adjustment
                        this.translate(translation_vector.multiply(-1));
                    }
                    else {
                        //flip as normal
                        to_ground = i;
                        origin = this.rectangle.points[0];
                        target = Math.asin(ground_edge.normalize().y);
                    }
                }
                //right foot within ground x
                else if (chunk.poly.points[0].x < this.rectangle.points[1].x && this.rectangle.points[1].x < chunk.poly.points[1].x) {
                    //flip around left end of ground
                    origin = chunk.poly.points[0];
                    //connection to the left and position after rotate will be off ground
                    if (chunk.connect_left && this.position.x < chunk.poly.points[0].x) {
                        //flip onto left connect
                        to_ground = i - 1;
                        target = Math.asin(this.ao.terrain[to_ground].poly.points[1].subtract(this.ao.terrain[to_ground].poly.points[0]).normalize().y);
                    }
                    else {
                        //flip onto ground
                        to_ground =  i;
                        target = Math.asin(ground_edge.normalize().y);
                    }
                }
            }
            else {
                if (chunk.poly.points[0].x < this.rectangle.points[1].x && this.rectangle.points[1].x < chunk.poly.points[1].x) {
                    if (chunk.connect_left && this.rectangle.points[1].x - ground_edge.normalize().x * this.width / 2 < chunk.poly.points[0].x) {
                        //keep falling - no adjustment
                        this.translate(translation_vector.multiply(-1));
                    }
                    else {
                        //flip as normal
                        to_ground = i;
                        origin = this.rectangle.points[1];
                        target = Math.asin(ground_edge.normalize().y);
                    }
                }
                else if (chunk.poly.points[0].x < this.rectangle.points[0].x && this.rectangle.points[0].x < chunk.poly.points[1].x) {
                    //flip around right end of ground
                    origin = chunk.poly.points[1];
                    if (chunk.connect_right && this.position.x >= chunk.poly.points[1].x) {
                        //flip onto right connect
                        to_ground = i + 1;
                        target = Math.asin(this.ao.terrain[to_ground].poly.points[1].subtract(this.ao.terrain[to_ground].poly.points[0]).normalize().y);
                    }
                    else {
                        //flip onto ground
                        to_ground = i;
                        target = Math.asin(ground_edge.normalize().y);
                    }
                }
            }
        }
        
        //mantling
        if (to_ground == -1) {
            //make y check be shoulder or something later on
            //we could merge these if statements but it would be pretty unreadable
            if (this.heading == -1 && this.rectangle.points[3].y <= chunk.poly.points[1].y && (this.rectangle.points[0].x == chunk.poly.points[1].x || (chunk.poly.points[1].x < this.rectangle.points[0].x && this.rectangle.points[0] <= chunk.poly.points[2].x))) {
                this.velocity = 0;
                this.climbing = -1;
            }
            else if (this.heading == 1 && this.rectangle.points[2].y <= chunk.poly.points[0].y && (this.rectangle.points[1].x == chunk.poly.points[0].x || (chunk.poly.points[-1].x <= this.rectangle.points[1].x && this.rectangle.points[1].x < chunk.poly.points[0].x))) {
                this.velocity = 0;
                this.climbing = 1;
            }
        }
        
        //land or dont land depending on results (set rotation and grounded and zero velocity) be sure to check collision on rotate (if collision dont rotate or land)
        else {
            let ignore = [to_ground];
            if (this.ao.terrain[to_ground].connect_left) {
                ignore.push(to_ground - 1);
            }
            if (this.ao.terrain[to_ground].connect_right) {
                ignore.push(to_ground + 1);
            }

            let success = this.rotate(origin, target, ignore, true); //doesnt matter if last param is true or false

            if (success) {
                this.grounded = to_ground;
                this.velocity = 0;
                return true;
            }
        return false;
        }
    }

    run(distance) {
        let ground = this.ao.terrain[this.grounded];
        let ground_edge = ground.poly.points[1].subtract(ground.poly.points[0]);
        let success = true;
        let fall = 0;
        let translation;
        do {
            //modify translation to correct angle
            translation = ground_edge.normalize().multiply(distance);
            let d1 = translation;
            let ignore = [this.grounded];
            let rotate = -1;

            if (ground.connect_left) {
                ignore.push(this.grounded - 1);
            }
            if (ground.connect_right) {
                ignore.push(this.grounded + 1);
            }

            if (ground.connect_left && this.position.x + translation.x < ground.poly.points[0].x) {
                d1 = ground.poly.points[0].subtract(this.position);
                rotate = this.grounded - 1;
            }
            else if (ground.connect_right && this.position.x + translation.x > ground.poly.points[1].x) {
                d1 = ground.poly.points[1].subtract(this.position);
                rotate = this.grounded + 1;
            }
            else if (this.rectangle.points[1].x + translation.x < ground.poly.points[0].x) {
                d1 = ground.poly.points[0].subtract(this.rectangle.points[1]);
                fall = -1;
            }
            else if (this.rectangle.points[0].x + translation.x > ground.poly.points[1].x) {
                d1 = ground.poly.points[1].subtract(this.rectangle.points[0]);
                fall = 1;
            }

            translation = translation.subtract(d1);

            for (let i = 0; i < this.ao.terrain.length; i++) {
                if (!ignore.includes(i)) {
                    let result = grounded_collision(this.rectangle, this.ao.terrain[i].poly, d1, i);
                    if (result[0]) {
                        d1 = d1.add(result[1]);
                        success = false;
                    }
                }
            }
            
            this.translate(d1);

            if (success) {
                if (rotate >= 0) {
                    let next_ground = this.ao.terrain[rotate];
                    let next_ground_edge = next_ground.poly.points[1].subtract(next_ground.poly.points[0]);
                    let target = Math.asin(next_ground_edge.normalize().y);
                    
                    success = this.rotate(this.position, target, ignore, false);

                    if (success) {
                        this.grounded = rotate;
                        ground = next_ground;
                        ground_edge = next_ground_edge;
                    }
                }

                if (fall != 0) {
                    let origin = this.rectangle.points[1];
                    if (fall == 1) {
                        origin = this.rectangle.points[0];
                    }

                    let success = this.rotate(origin, 0, [this.grounded], true);
                    
                    if (success) {
                        this.crouch(false);
                        let d2 = new Vector(fall * (Math.abs(distance) - d1.get_norm()), 0);
                        for (let i = 0; i < this.ao.terrain.length; i++) {
                            if (i != this.grounded) {
                                let result = grounded_collision(this.rectangle, this.ao.terrain[i].poly, d2);
                                if (result[0]) {
                                    d2 = d2.add(result[1]);
                                }
                            }
                        }
                    
                        this.translate(d2);
                        this.grounded = -1;
                    }
                }
            }
        } while (success && translation.x > 0 && translation.y > 0 && fall == 0);
    }

/*
    #compare position + velocity to endpoint of ground
    
    #if position past a connected end
        #split velocity into before and after
        #check for collision and move before (stop after any of these steps if collision)
        #check for collision and rotate
        #if we get to rotate set grounded to new ground
        #check for collision and move after
    #if position past an edge + half width
        #split velocity into before and after
        #check for collision and move before (stop after any of these steps if collision)
        #check for collision and rotate
        #if we get to rotate set grounded to None
        #check for collision and move after
    */

    crouch(crouch) {
        let base = this.rectangle.points[1].subtract(this.rectangle.points[0]);
        let side = new Vector(base.y, -base.x).normalize().multiply(this.height);
        if (crouch) {
            side = side.multiply(this.crouch_heightmod);
        }
        this.rectangle.points[3] = this.rectangle.points[0].add(side);
        this.rectangle.points[2] = this.rectangle.points[1].add(side);
        this.crouched = crouch;
    }
    
    uncrouch() {
        let ground = this.ao.terrain[this.grounded];
        
        let ignore = [this.grounded];
        if (ground.connect_left) {
            ignore.push(this.grounded - 1);
        }
        if (ground.connect_right) {
            ignore.push(this.grounded + 1);
        }

        let success = true;

        let base = this.rectangle.points[1].subtract(this.rectangle.points[0]);
        let side = new Vector(base.y, -base.x).normalize().multiply(this.height);

        let standing_rectangle = new Polygon([this.rectangle.points[0], this.rectangle.points[1], this.rectangle.points[1].add(side), this.rectangle.points[0].add(side)]);

        for (let i = 0; i < this.ao.terrain.length; i++) {
            if (!ignore.includes(i)) {
                let result = grounded_collision(standing_rectangle, this.ao.terrain[i].poly, ZERO_VECTOR) //maybe this should be air? lets have a look at the collision algorithms later and optimize them a bit
                if (result[0]) {
                    success = false;
                    break;
                }
            }
        }

        if (success) {
            this.rectangle = standing_rectangle;
            this.crouched = false;
            return true;
        }
        return false;
    }
    /*
    climb(i, terrain) {

        let boulder = terrain[i];
        let ground = terrain[this.grounded];
        
        let success = false;

        //make y check be shoulder or something later on
        if (this.heading == -1 && this.standing_rectangle.points[3].y <= boulder.poly.points[1].y) || (this.heading == 1 && this.standing_rectangle.points[2].y <= boulder.poly.points[0].y) {
            if (ground.poly.points[1].y >= ground.poly.points[0].y) {
                origin = this.standing_rectangle.points[0]
            }
            else {
                origin = this.standing_rectangle.points[1]
            }
            success = this.rotate(terrain, origin, 0, (this.grounded,), True)
        }

        if success:
            this.grounded = None
            this.crouched = False
            this.translate(vector.Vector(0, -6))
            return true;
        return false;
    }
    */
    
    jump() {

        let ground = this.ao.terrain[this.grounded];

        let origin;

        if (ground.poly.points[1].y >= ground.poly.points[0].y) {
            origin = this.rectangle.points[0];
        }
        else {
            origin = this.rectangle.points[1];
        }

        if (this.rotate(origin, 0, [this.grounded], true)) {
            let previous = this.grounded;
            this.grounded = -1;
            this.crouched = false;
            this.velocity = -10;
            return [true, previous];
        }
        return [false];
    }
    
    translate(velocity) {
        this.position = this.position.add(velocity);
        this.shoulder = this.shoulder.add(velocity);
        this.crouched_shoulder = this.crouched_shoulder.add(velocity);
        this.rectangle.translate(velocity);
    }
    
    /*
    Check if a rotation is safe from a crouched or standing state and rotate accordingly.
    Take the terrain of the ao, the origin of the rotation, the target angle, a tuple of chunks to ignore, and a boolean representing whether the rotation must be made standing.
    Rotate the soldier if able.
    Return a boolean representing the success or failure of the transformation.
    */
    rotate(origin, target, ignore, stand) {
        let success = true;
        if (this.rotation != target) { //might save some operations in a few cases

            if (this.crouched && stand) {
                let base = this.rectangle.points[1].subtract(this.rectangle.points[0]);
                let side = new Vector(base.y, -base.x).normalize().multiply(this.height);

                this.rectangle = new Polygon([this.rectangle.points[0], this.rectangle.points[1], this.rectangle.points[1].add(side), this.rectangle.points[0].add(side)]);
            }

            let standing = stand;

            if (!this.crouched) {
                standing = true;
            }
            
            //might make this a helper function (there are 2 occurances but i have no idea what to call the function or how to justify it)
            if (target == 0) { //we can have funny conditionals in here because the only case where the origin is not one of these conditions is when this.rotation = 0 (see top conditional) (but right now imma justbe safe)
                if (origin.x == this.position.x && origin.y == this.position.y) {
                    this.reset(origin);
                }
                else if (origin.x == this.rectangle.points[0].x && origin.y == this.rectangle.points[0].y) {
                    this.reset(origin.add(new Vector(this.width / 2, 0)));
                }
                else if (origin.x == this.rectangle.points[1].x && origin.y == this.rectangle.points[1].y) {
                    this.reset(origin.add(new Vector(this.width / -2, 0)));
                }
            }
            else {
                this.rectangle.rotate(origin, target - this.rotation);
            }

            for (let i; i < this.ao.terrain.length; i++) {
                if (!ignore.includes(i)) {
                    let result = grounded_collision(this.rectangle, terrain[i].poly, ZERO_VECTOR); //maybe this should be air? lets have a look at the collision algorithms later and optimize them a bit
                    if (result[0]) {
                        this.rectangle.rotate(origin, this.rotation - target); //add reset in here
                        success = false;
                        break;
                    }
                }
            }
            
            if (success) {
                if (target == 0) { //we can have funny conditionals in here because the only case where the origin is not one of these conditions is when this.rotation = 0 (see top conditional) (but right now imma justbe safe)
                    if (origin.x == this.position.x && origin.y == this.position.y) {
                        this.shoulder = origin.add(this.shoulder_offset);
                        this.crouched_shoulder = origin.add(this.crouched_shoulder_offset);
                    }
                    else if (origin.x == this.rectangle.points[0].x && origin.y == this.rectangle.points[0].y) {
                        this.position = origin.add(new Vector(this.width / 2, 0));
                        this.shoulder = this.position.add(this.shoulder_offset);
                        this.crouched_shoulder = this.position.add(this.crouched_shoulder_offset);
                    }
                    else if (origin.x == this.rectangle.points[1].x && origin.y == this.rectangle.points[1].y) {
                        this.position = origin.add(new Vector(this.width / -2, 0));
                        this.shoulder = this.position.add(this.shoulder_offset);
                        this.crouched_shoulder = this.position.add(this.crouched_shoulder_offset);
                    }
                }
                else {
                    this.position = this.position.rotate(origin, target - this.rotation)
                    this.crouched_shoulder = this.crouched_shoulder.rotate(origin, target - this.rotation)
                    this.shoulder = this.shoulder.rotate(origin, target - this.rotation)
                }
                
                this.rotation = target
            }
        }
        return success
    }
    
    reset(position) {
        let height = this.height;
        if (this.crouched) {
            height *= this.crouch_heightmod;
        }
        
        this.rectangle.points[0] = position.add(new Vector(this.width / -2, 0));
        this.rectangle.points[1] = position.add(new Vector(this.width / 2, 0));
        this.rectangle.points[2] = position.add(new Vector(this.width / 2, -1 * height));
        this.rectangle.points[3] = position.add(new Vector(this.width / -2, -1 * height));
    }
}