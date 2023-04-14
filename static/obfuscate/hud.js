const int_font = new PIXI.TextStyle({
    fontFamily: 'Courier',
    fontSize: 30,
    fontWeight: 'bold',
    fill: '#ee0000',
    lineHeight: 35,
});

const norm_font = new PIXI.TextStyle({
    fontFamily: 'Courier',
    fontSize: 30,
    fontWeight: 'bold',
    fill: '#00ee00',
    lineHeight: 35,
});

const int_ind = new PIXI.Text("SYSTEM INTERRUPT! (0)", int_font);
int_ind.position.set(10, NATIVE - 45);
int_ind.alpha = 0;
stage.addChild(int_ind);

let int_queue = [];
const int_sound = PIXI.sound.Sound.from('static/obfuscate/message.mp3');
const slot_sound = PIXI.sound.Sound.from('static/obfuscate/slot.mp3');

let time = 0;
const time_ind = new PIXI.Text("Time 0ms", norm_font);
time_ind.position.set(20 + WIDTH * 2 / 3, NATIVE - 45);
stage.addChild(time_ind);
function inc_time(dt) {
    time += dt;
    time_ind.text = "Time " + time.toString() + "ms";
}

let slots = ['','',''];
let threads = 3;
let running = [{name: "Ram", time: 50, cost: 2}, {name: "Mayfly", time: 3, cost: 1}];


const slots_readout = new PIXI.Text("Slots\n1\n2\n3", norm_font);
slots_readout.position.set(20 + WIDTH * 2 / 3, 10);
stage.addChild(slots_readout);
const threads_readout = new PIXI.Text("Threads (3 total)", norm_font);
threads_readout.position.set(20 + WIDTH * 2 / 3, 185);
stage.addChild(threads_readout);
/*
const program_readout = new PIXI.Text("ICE\n")
program_readout.position.set(20 + WIDTH * 2 / 3, 395);
stage.addChild(program_readout);
const data_readout = new PIXI.Text("Data (DISK IS EMPTY)", norm_font);
data_readout.position.set(20 + WIDTH * 2 / 3, 395);
stage.addChild(data_readout);*/

function display_threads() {
    threads_readout.text = "Threads (3 total)\n";
    let used = 0;
    for (let program of running) {
        threads_readout.text += "- " + program.name + " (" + program.time.toString() + "ms) on " + program.cost.toString() + " threads\n";
        used += program.cost;
    }
    threads_readout.text += (threads - used).toString() + " threads available";
}

function display_slots() {
    slots_readout.text = "Slots\n";
    for (let i = 0; i < slots.length; i++) {
        slots_readout.text += (i+1).toString() + " " + slots[i] + "\n";
    }
}

function enqueue_int(interrupt) {
    int_queue.splice(0, 0, interrupt);
    int_ind.text = "SYSTEM INTERRUPT! (" + int_queue.length.toString() + ")";
    int_ind.alpha = 1;
    int_sound.play();
}

function dequeue_int() {
    if (int_queue.length > 0) {
        let interrupt = int_queue.pop();
        int_ind.text = "SYSTEM INTERRUPT! (" + int_queue.length.toString() + ")";
        if (int_queue.length == 0) {
            int_ind.alpha = 0;
        }
        return interrupt;
    }
    return null;
}