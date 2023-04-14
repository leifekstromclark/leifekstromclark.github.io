class Terminal {
    constructor(cont, x, y, width, height) {
        this.contain = new PIXI.Container();
        this.contain.position.set(x, y);
        this.content = new PIXI.Container();
        this.contain.addChild(this.content);
        this.content.position.set(0, -1 * height);
        this.scroll_pos = this.content.y;
        this.line_height = 35.0;
        this.offset = 0;
        this.input = '';
        this.norm_font = new PIXI.TextStyle({
            fontFamily: 'Courier',
            fontSize: 30,
            fontWeight: 'bold',
            fill: '#00ee00',
            lineHeight: this.line_height,
            wordWrap: true,
            breakWords: true,
            wordWrapWidth: width, // probably minus some offset
        });
        this.packet_font = new PIXI.TextStyle({
            fontFamily: 'Courier',
            fontSize: 30,
            fontWeight: 'bold',
            fill: '#6655ff',
            lineHeight: this.line_height,
            wordWrap: true,
            breakWords: true,
            wordWrapWidth: width, // probably minus some offset
        });
        this.error_font = new PIXI.TextStyle({
            fontFamily: 'Courier',
            fontSize: 30,
            fontWeight: 'bold',
            fill: '#f5c045',
            lineHeight: this.line_height,
            wordWrap: true,
            breakWords: true,
            wordWrapWidth: width, // probably minus some offset
        });
        this.send_font = new PIXI.TextStyle({
            fontFamily: 'Courier',
            fontSize: 30,
            fontWeight: 'bold',
            fill: '#f095f5',
            lineHeight: this.line_height,
            wordWrap: true,
            breakWords: true,
            wordWrapWidth: width, // probably minus some offset
        });
        this.int_font = new PIXI.TextStyle({
            fontFamily: 'Courier',
            fontSize: 30,
            fontWeight: 'bold',
            fill: '#ee0000',
            lineHeight: this.line_height,
            wordWrap: true,
            breakWords: true,
            wordWrapWidth: width, // probably minus some offset
        });
        this.input_text = new PIXI.Text('>>> ' + this.input, this.norm_font);
        this.cursor_time = 530;
        this.content.addChild(this.input_text);
        this.width = width;
        this.height = height;
        let mask = new PIXI.Graphics();
        this.contain.addChild(mask);
        mask.lineStyle(0);
        mask.beginFill('#ffffff');
        mask.drawRect(0, -1 * height, width, height);
        mask.endFill();
        mask.position.set(0, 0);
        this.content.mask = mask;
        cont.addChild(this.contain);
    }

    write(line, font) {
        let text = new PIXI.Text(line, font);
        this.content.addChild(text);
        text.y = this.offset;
        this.offset += text.height;
        this.input_text.y = this.offset;
        this.jump();
    }

    scroll(dy) {
        this.scroll_pos -= dy;
        if (this.scroll_pos < -1 * this.offset - this.height) {
            this.scroll_pos = -1 * this.offset - this.height;
        } else if (this.scroll_pos > -1 * this.height) {
            this.scroll_pos = -1 * this.height;
        }
        this.content.y = Math.round(this.scroll_pos / this.line_height) * this.line_height;
    }
    
    jump() {
        if (this.content.y + this.offset + this.input_text.height > 0) {
            this.content.y = -1 * this.offset - this.input_text.height;
        }
    }
}