class board {
    constructor(size, width, x, y) {

        this.size = size;
        this.width = width;
        this.subBoards = [];
        for (let i=0; i<this.size; i++) {
            this.subBoards.push([]);
            for (let j=0; j<this.size; j++) {
                this.subBoards[i].push(new subBoard(size, width/size, x+j*this.width/this.size, y+i*this.width/this.size));
                stage.addChild(this.subBoards[i][j].graphic);
            }
        }
        this.subBoards[1][1].active = true;
        this.graphic = new PIXI.Graphics();
        this.graphic.position.set(x, y);
    }

    reset(){
        for (let x=0; x<this.size; x++) {
            for (let y=0; y<this.size; y++) {
                this.subBoards[y][x].reset();
            }
        }
        this.subBoards[1][1].active = true;
    }

    draw(){
        this.graphic.clear();
        this.graphic.lineStyle(7, 0x000000);
        for (let i=1; i<this.size; i++){
            this.graphic.moveTo(0, i*this.width/this.size);
            this.graphic.lineTo(this.width, i*this.width/this.size);
            this.graphic.moveTo(i*this.width/this.size, 0);
            this.graphic.lineTo(i*this.width/this.size, this.width);
        }
        for (let x=0; x<this.size; x++) {
            for (let y=0; y<this.size; y++) {

                this.subBoards[y][x].draw();
                
                if (this.subBoards[y][x].victory == 1) {
                    this.graphic.lineStyle(20, 0x000090);
                    this.graphic.drawCircle((x+0.5)*this.width/this.size, (y+0.5)*this.width/this.size, 0.35*this.width/this.size);

                } else if (this.subBoards[y][x].victory == 2) {
                    this.graphic.lineStyle(20, 0x900000);
                    this.graphic.moveTo((x+0.15)*this.width/this.size, (y+0.15)*this.width/this.size);
                    this.graphic.lineTo((x+0.85)*this.width/this.size, (y+0.85)*this.width/this.size);
                    this.graphic.moveTo((x+0.85)*this.width/this.size, (y+0.15)*this.width/this.size);
                    this.graphic.lineTo((x+0.15)*this.width/this.size, (y+0.85)*this.width/this.size);
                }
            }
        }
    }

    reactivate(next_x, next_y){
        for (let x=0; x<this.size; x++) {
            for (let y=0; y<this.size; y++) {
                this.subBoards[y][x].active = false;
            }
        }
        if (this.subBoards[next_y][next_x].victory == 0){
            this.subBoards[next_y][next_x].active = true;
        } else {
            for (let x=0; x<this.size; x++) {
                for (let y=0; y<this.size; y++) {
                    if (this.subBoards[y][x].victory == 0){
                        this.subBoards[y][x].active = true;
                    }
                }
            }
        }
    }

    checkVictory(player){
        let diag_one = true;
        let diag_two = true;
        for (let i=0; i<this.size; i++) {
            let good_row = true;
            let good_col = true;
            for (let j=0; j<this.size; j++) {
                if (this.subBoards[i][j].victory != player) {
                    good_row = false;
                }
                if (this.subBoards[j][i].victory != player) {
                    good_col = false;
                }
            }
            if (good_row || good_col) {
                return true;
            }
            if (this.subBoards[i][i].victory != player) {
                diag_one = false;
            }
            if (this.subBoards[2-i][i].victory != player) {
                diag_two = false;
            }
        }
        if (diag_one || diag_two) {
            return true;
        }
        return false;
    }
}

class subBoard {
    constructor(size, width, x, y) {
        this.graphic = new PIXI.Graphics();
        this.graphic.position.set(x, y);
        this.active = false;
        this.victory = 0;
        this.size = size;
        this.width = width;
        this.state = [];

        for (let i=0; i<this.size; i++) {
            this.state.push([]);
            for (let j=0; j<this.size; j++) {
                this.state[i].push(0);
            }
        }
    }

    reset() {
        this.victory = 0;
        this.active = false;
        for (let x=0; x<this.size; x++) {
            for (let y=0; y<this.size; y++) {
                this.state[y][x] = 0;
            }
        }
    }

    placePiece(x, y, player){
        let x_cell = Math.floor(this.size * x / this.width);
        let y_cell = Math.floor(this.size * y / this.width);
        if (this.active && this.state[y_cell][x_cell] == 0) {
            this.state[y_cell][x_cell] = player;
            if (this.checkVictory(player)) {
                this.victory = player;
            }
            return [x_cell, y_cell];
        }
        return null;
    }

    draw(){
        this.graphic.clear();
        this.graphic.beginFill(0xFFFFFF);
        this.graphic.drawRect(0,0,this.width, this.width);
        this.graphic.endFill();
        this.graphic.lineStyle(3, 0x000000);
        for (let i=1; i<this.size; i++){
            this.graphic.moveTo(0, i*this.width/this.size);
            this.graphic.lineTo(this.width, i*this.width/this.size);
            this.graphic.moveTo(i*this.width/this.size, 0);
            this.graphic.lineTo(i*this.width/this.size, this.width);
        }
        for (let x=0; x<this.size; x++) {
            for (let y=0; y<this.size; y++) {
                this.graphic.lineStyle(0);
                if (this.active && this.state[y][x] == 0) {
                    this.graphic.beginFill(0x007000, 0.2);
                    this.graphic.drawRect(x*this.width/this.size, y*this.width/this.size, this.width/this.size, this.width/this.size);
                    this.graphic.endFill();
                }
                if (this.state[y][x] == 1) {
                    this.graphic.lineStyle(7, 0x000070);
                    this.graphic.drawCircle((x+0.5)*this.width/this.size, (y+0.5)*this.width/this.size, 0.35*this.width/this.size);

                } else if (this.state[y][x] == 2) {
                    this.graphic.lineStyle(7, 0x700000);
                    this.graphic.moveTo((x+0.15)*this.width/this.size, (y+0.15)*this.width/this.size);
                    this.graphic.lineTo((x+0.85)*this.width/this.size, (y+0.85)*this.width/this.size);
                    this.graphic.moveTo((x+0.85)*this.width/this.size, (y+0.15)*this.width/this.size);
                    this.graphic.lineTo((x+0.15)*this.width/this.size, (y+0.85)*this.width/this.size);
                }
            }
        }
    }

    checkVictory(player){
        let diag_one = true;
        let diag_two = true;
        for (let i=0; i<this.size; i++) {
            let good_row = true;
            let good_col = true;
            for (let j=0; j<this.size; j++) {
                if (this.state[i][j] != player) {
                    good_row = false;
                }
                if (this.state[j][i] != player) {
                    good_col = false;
                }
            }
            if (good_row || good_col) {
                return true;
            }
            if (this.state[i][i] != player) {
                diag_one = false;
            }
            if (this.state[2-i][i] != player) {
                diag_two = false;
            }
        }
        if (diag_one || diag_two) {
            return true;
        }
        return false;
    }
}


function receiveClick(e) {
    if (playing) {
        let board_x = game_board.graphic.position.x;
        let board_y = game_board.graphic.position.y;
        let x = e.data.global.x / (renderer.screen.height / NATIVE);
        let y = e.data.global.y / (renderer.screen.height / NATIVE);
        if (board_x < x && x < game_board.width + board_x && board_y < y && y < game_board.width + board_y){
            let x_cell = Math.floor(game_board.size * (x - board_x) / game_board.width);
            let y_cell = Math.floor(game_board.size * (y - board_y) / game_board.width);
            let sub = game_board.subBoards[y_cell][x_cell];
            let player = 2;
            if (turn) {
                player = 1;
            }
            let move = sub.placePiece(x-sub.graphic.position.x, y-sub.graphic.position.y, player);
            if (move !== null) {
                turn = !turn;
                game_board.reactivate(move[0], move[1]);
                game_board.draw();
                if (game_board.checkVictory(player)){
                    playing = false;
                    stat.text = "wins! Click to reset"
                } else if (turn) {
                    o_ind.alpha = 1;
                    x_ind.alpha = 0;
                } else {
                    o_ind.alpha = 0;
                    x_ind.alpha = 1;
                }
            }
        }
    } else {
        stat.text = "Player's Turn";
        o_ind.alpha = 1;
        x_ind.alpha = 0;
        game_board.reset();
        game_board.draw();
        playing = true;
    }
}