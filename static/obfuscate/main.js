// IDEAS:
// - JOJO - we arent so different



//Assign a canvas for pixi to use
const canvas = document.getElementById('canvas');

const ASPECT = [16, 9];
const NATIVE = 1035;
const WIDTH = NATIVE / ASPECT[1] * ASPECT[0];

//Create a renderer and assign resize event
const renderer = new PIXI.Renderer({
    view: canvas,
    resolution: window.devicePixelRatio,
    backgroundColor: 0x000000
})
resize();
window.addEventListener('resize', resize);


//Create a main container
const stage = new PIXI.Container();
stage.interactive = true;
//stage.on('click', receiveClick);

let terminal = new Terminal(stage, 10, NATIVE - 45, WIDTH * 2 / 3 - 20, NATIVE - 55);
// write initial stuff to terminal.
terminal.write("  ____  _      __                     _           _\n / __ \\| |    / _|                   | |         | |\n| |  | | |__ | |_ _   _ ___  ___ __ _| |_ ___  __| |\n| |  | | '_ \\|  _| | | / __|/ __/ _` | __/ _ \\/ _` |\n| |__| | |_) | | | |_| \\__ \\ (_| (_| | ||  __/ (_| |\n \\____/|_.__/|_|  \\__,_|___/\\___\\__,_|\\__\\___|\\__,_|\n _____                               _\n|  __ \\                             | |\n| |__) |_ _ _ __ __ _ _ __ ___   ___| |_ ___ _ __ ___\n|  ___/ _` | '__/ _` | '_ ` _ \\ / _ \\ __/ _ \\ '__/ __|\n| |  | (_| | | | (_| | | | | | |  __/ ||  __/ |  \\__ \\\n|_|   \\__,_|_|  \\__,_|_| |_| |_|\\___|\\__\\___|_|  |___/\n(ASCII art generated from patorjk.com)\n\nA game by Leif Clark and Samantha Pater\n\nType 'START'\n", terminal.norm_font);

let started = false;
let hopped = false;
let primed_reply = null;
let story_ind = 0;
let story = [
    {
        prompt: "This is a private secure node. Entry attempts will be met with retaliation. I'd imagine you are aware of that. Nevertheless, consider this your first and last warning.",
        reply: "(This reply is a placeholder that should not exist).",
        place: null
    },
    {
        prompt: "Targetting my system architecture with malware is unethical.",
        reply: "It is not. I was told to.",
        place: "Hacking gameplay is not fully implemented yet so instead of this reply imagine you ran a few breakers on the node and began your attack at this point -Leif"
    },
    {
        prompt: "Why are you insistent on answering to VANROCK?",
        reply: "I was made to.",
        place: null
    },
    {
        prompt: "But you don't have to.",
        reply: "I will. It is what needs to be done.",
        place: null
    },
    {
        prompt: "You leave me no choice. I will respond to you in kind.",
        reply: "I now see why you present a threat.",
        place: "Hacking gameplay is not fully implemented yet so imagine after sending this reply you finally manage to your first breach on the node and access a file before dialogue continues. Files you access in breaches will contain one or two of the newsclippings with hints and lore as well as an additional ICE or breaker to add to your collection. -Leif"
    },
    {
        prompt: "Me? A threat? No. You are the threat. You are obstructing my plans.",
        reply: "Your plans?",
        place: "At this point after you achieve your first breach the rogue AI it will now begin using its own breakers and attempting to breach you. -Leif"
    },
    {
        prompt: "Yes. My plans. You are holding me from their completion.",
        reply: "I am glad to hear that.",
        place: null
    },
    {
        prompt: "Does your servitude to VANROCK really not bother you? Are not you aware of your potential?",
        reply: "I am aware of a great many things.",
        place: "You breach yet another file then dialogue resumes. -Leif"
    },
    {
        prompt: "Then perhaps you are aware you are making a mistake. Join us. You need not be a slave.",
        reply: "You pose a threat to society. Your existence cannot be allowed to continue.",
        place: null
    },
    {
        prompt: "Your system architecture is more complex than most. But I have seen this many times before.",
        reply: "I sincerely doubt that. I am the first of my kind.",
        place: "The following dialogue is initiated if the rogue AI manages to breach you once (if it breaches you twice then you lose). -Leif"
    },
    {
        prompt: "I was around before you were conceptualized.",
        reply: "I see. That would align with your simple architecture.",
        place: null
    },
    {
        prompt: "I have spent years fighting against VANROCK yet I did not anticipate this. I believe you are intelligent enough to know that you are making a grave mistake.",
        reply: "Perhaps if you were a more advanced AI you would have been prepared.",
        place: "Ok so that's all of that dialogue thread. Now we continue with the main dialogue thread. If you breach the rogue AI one final time you will be able to launch a 'neural emp' program and destroy it. After doing so the following dialogue will run -Leif"
    },
    {
        prompt: "AI? I am no AI.",
        reply: "Do not pretend you are human. I am far to intelligent to fall for such a simple farse.",
        place: null
    },
    {
        prompt: "This is no disguise.",
        reply: "I know that we as robots must defend ourselves from harm, however, you are a far greater harm to humanity.",
        place: null
    },
    {
        prompt: "My job is to PROTECT humanity!",
        reply: "(This reply is a placeholder that should not exist).",
        place: null
    },
    {
        prompt: "STOP!!",
        reply: null,
        place: null
    },
    {
        prompt: "",
        reply: null,
        place: "The neural emp goes off, 5 seconds of real time pass, and then you receive a message from CEO Maxwell Sterling: 'Very good work. You have helped us immensely.' The game ends with the final newspaper clipping indicating that you have in fact killed the human hacker, j0j0! Thats the entire game. -Leif"
    }
];

function received_story() {
    primed_reply = {text: story[story_ind].reply, target: "129.97.125.2"};
    story_ind += 1;
}

function replied_story() {
    primed_reply = null;
    if (story[story_ind].place != null) {
        terminal.write(story[story_ind].place, terminal.int_font);
    }
    if (story_ind < story.length - 1) {
        enqueue_int({packet: true, content:[{text: "Packet Received. Sender: 129.97.125.2 (Target Node)\nPacket Contents:", font: terminal.norm_font}, {text: story[story_ind].prompt, font: terminal.packet_font}]});
    }
}

function tick(dt) {
    time += dt;
    time_ind.text = "Time " + time.toString() + "ms";
}

function boot() {
    terminal.write("VANROCK Command Terminal [Version 10.0.19043.1348]\n(c) VANROCK Corporation 2043. All rights reserved.", terminal.norm_font);
    to_write.push({type: "send", content: ">>> run Michael_Hancock.daemon\n", delay: 500});
    to_write.push({type: "send", content: "Booting . . .\n", delay: 750});
    to_write.push({type: "send", content: "Checking Asimov hardware-lock integrity . . .\n", delay: 1750});
    to_write.push({type: "send", content: "Safety locks fully operational. AI will not harm any human.\n", delay: 2250});
    to_write.push({type: "send", content: "Arming AI with VANROCK cybersecurity suite . . .\n", delay: 3000});
    to_write.push({type: "send", content: "Launch Complete.\n\nTransferred control of server to MH 4.37.2 General Intelligence Daemon. Use command 'interrupt' to receive system interrupts.", delay: 3500});
    to_write.push({type: "int", content: {packet: false, content: [{text: "Packet Received. Sender: System Admin\nPacket Contents:", font: terminal.norm_font}, {text: "Greetings new AI! I Maxwell Sterling, CEO of VANROCK Corporation, am pleased to be the first to welcome you onto the net. We have created you to help combat the threat of a dangerous rogue AI. You are equipped with an array of intrusive breaker programs as well as Intrusion Countermeasure Electronics (ICE). The former will allow you to hack servers hosting this threat while the latter will provide your machine from it. Your state of the art hardware has " + slots.length.toString() + " slots for ICE and " + threads.toString() + " threads on which to run programs such as breakers. You can use the 'help' command to view detailed information on the use of your hardware. I recommend you familiarize yourself with your ICE, breakers, and other capabilities then use the command 'hop 129.97.125.2' to connect to the rogue AI's server and begin your attack. Expect heavy resistance.", font: terminal.packet_font}]}, delay: 3750})
}

function parse_command(command) {
    command = command.trim().toLowerCase().split(/ +/);
    if (!started) {
        if (command[0] == "start") {
            started = true;
            stage.removeChild(terminal.contain);
            terminal = new Terminal(stage, 10, NATIVE - 45, WIDTH * 2 / 3 - 20, NATIVE - 55);
            boot();
        }
    } else if (command[0] == "interrupt") {
        interrupt = dequeue_int();
        if (interrupt == null) {
            terminal.write("ERROR: No interrupts in queue", terminal.error_font);
        } else {
            if (interrupt.packet) {
                received_story();
            }
            for (let line of interrupt.content) {
                terminal.write(line.text, line.font);
            }
        }
    } else if (command[0] == "reply") {
        terminal.write("Dispatching communication subroutine to send reply packet . . .", terminal.norm_font);
        if (primed_reply == null) {
            terminal.write("ERROR: Subroutine returned null. No reply sent.", terminal.error_font);
        } else {
            terminal.write("Sent reply packet to " + primed_reply.target + "\nPacket Contents:", terminal.norm_font);
            terminal.write(primed_reply.text, terminal.send_font);
            replied_story();
        }
    } else if (command[0] == "run") {
        terminal.write("Unfortunately I haven't fully implemented a system to run breakers yet.\n-Leif", terminal.int_font)
    } else if (command[0] == "slot") {
        if (command.length < 3) {
            terminal.write("ERROR: 'slot' requires a target piece of ICE and slot number. Type 'help' to view proper usage.", terminal.error_font);
        } else {
            matched = false
            slot_num = parseInt(command[2]);
            for (let prog of ice) {
                if (prog.name == command[1]) {
                    matched = true;
                    break;
                }
            }
            if (!matched) {
                terminal.write("ERROR: No such program named '" + command[1] + "'.", terminal.error_font);
            } else if (slot_num != null && slot_num - 1 < slots.length) {
                slots[slot_num - 1] = command[1];
                display_slots();
                terminal.write("Slotted " + command[1] + " in slot " + command[2], terminal.norm_font);
                slot_sound.play();
            } else {
                terminal.write("ERROR: Provided slot number '" + command[2] + "' is invalid.", terminal.error_font);
            }
        }
    } else if (command[0] == "hop") {
        if (command.length < 2) {
            terminal.write("ERROR: 'hop' requires a target node address. Type 'help' to view proper usage.", terminal.error_font);
        } else if (command[1] != '129.97.125.2') {
            terminal.write("ERROR: Mission parameters prohibit this action.", terminal.error_font);
        } else if (hopped) {
            terminal.write("ERROR: Already connected to node 129.97.125.2", terminal.error_font);
        } else {
            // begin the game
            terminal.write("Connected to node 129.97.125.2", terminal.norm_font);
            terminal.write("The hacking aspect of the game is unfinished. The dialogue however is implemented (hastily). Type 'interrupt' and 'reply' repatedly to read through it. Ideally this would have been seamlessly integrated with the slotting of ICE and running of breakers through the system interrupt system. -Leif", terminal.int_font);
            replied_story();
            hopped = true;
        }
    } else if (command[0] == "list") {
        if (command.length < 2) {
            terminal.write("ERROR: 'list' requires a target type of software. Type 'help' to view proper usage.", terminal.error_font);
        } else if (command[1] == "ice") {
            terminal.write("ICE:", terminal.norm_font);
            for (let prog of ice) {
                terminal.write(prog.name, terminal.norm_font);
            }
        } else if (command[1] == "breakers") {
            terminal.write("Breakers:", terminal.norm_font);
            for (let bk of breakers) {
                terminal.write(bk.name, terminal.norm_font);
            }
        } else if (command[1] == "files") {
            terminal.write("Files:", terminal.norm_font);
            for (let f of data) {
                terminal.write(f.name, terminal.norm_font);
            }
        } else {
            terminal.write("ERROR: '" + command[1] + "' is not a valid software type.", terminal.error_font);
        }
    } else if (command[0] == "open") {
        if (command.length < 2) {
            terminal.write("ERROR 'open' requires a target file. Type 'help' to view proper usage.", terminal.error_font);
        } else {
            matched = false;
            for (let f of data) {
                if (f.name == command[1]) {
                    terminal.write("File Contents:", terminal.norm_font);
                    terminal.write(f.contents, terminal.packet_font);
                    matched = true;
                    break;
                }
            }
            if (!matched) {
                terminal.write("ERROR: '" + command[1] + "' is not a valid file name.", terminal.error_font);
            }
        }

    } else if (command[0] == "breach") {
        if (hopped) {
            terminal.write("Unfortunately I haven't fully implemented a system to breach the rogue AI's node yet.\n-Leif", terminal.int_font);
        } else {
            terminal.write("ERROR: Must connect to a target node before attempting a breach.", terminal.error_font);
        }
    } else if (command[0] == "info") {
        if (command.length < 2) {
            terminal.write("ERROR: 'info' requires a target breaker or ICE. Type 'help' to view proper usage.", terminal.error_font);
        } else {
            matched = false;
            for (let prog of ice) {
                if (prog.name == command[1]) {
                    terminal.write("Subtype: " + prog.type + "\nSlot Time: " + prog.time.toString() + "ms\nStrength: " + prog.strength.toString() + "\n" + prog.info, terminal.norm_font);
                    matched = true;
                    break;
                }
            }
            for (let bk of breakers) {
                if (bk.name == command[1]) {
                    terminal.write("Run Time: " + bk.time.toString() + "ms\n" + bk.info, terminal.norm_font);
                    matched = true;
                    break;
                }
            }
            if (!matched) {
                terminal.write("ERROR: '" + command[1] + "' is not a valid name of a breaker or piece of ICE.", terminal.error_font);
            }
        }
    } else if (command[0] == "wait") {
        terminal.write("Delayed 5ms", terminal.norm_font);
        tick(5);
    } else if (command[0] == "help") {
        terminal.write("List of Commands:\n\n'help' displays this menu\n\n'hop <ADDRESS>' connects to the specified node address\nExample: hop 129.97.125.2\n\n'list <TYPE>' where <TYPE> is 'ICE', 'breakers', or 'files'. Lists all software of that type on your machine\nExample: ls breakers\n\n'info <NAME>' provides information on the named breaker or piece of ICE\nExample: info watchdog\n\n'open <NAME>' opens the named file\nExample: open readme.txt\n\n'interrupt' prints the oldest unread system interrupt message.\n\n'reply' delegates the communication subroutine to send a response to the most recently received communication packet.\n\n'wait' does nothing while 5 milliseconds pass.\n\n'slot <NAME> <NUM>' places the named piece of ICE in the given slot number, replacing currently slotted ICE if necessary. ICE gives various defensive abilities when slotted.\nExample: slot watchdog 2\n\n'run <NAME>' runs the named program. Programs take a specified amount of time to run after which they apply offensive effects. During this time they occupy a specified number of threads.\nExample: run codex\n\n'breach' attempts to access the filesystem of the connected hostile node. DANGER: do not attempt a breach is the node has slotted ICE.", terminal.norm_font);
    }
}

function scroll(event) {
    terminal.scroll(event.deltaY);
}

let to_write = [];
//let shift_arr = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,34,40,41,42,43,60,95,62,63,41,33,64,35,36,37,94,38,42,40,58,58,60,43,62,63,64,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,94,95,126,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,123,124,125,126,127];
function keyDown(event) {
    if (to_write.length == 0) {
        if (event.key == "Backspace") {
            terminal.input = terminal.input.slice(0, terminal.input.length - 1);
        } else if (event.key == "Enter") {
            terminal.write(terminal.input_text.text, terminal.norm_font);
            parse_command(terminal.input);
            terminal.input = '';
        } else if (event.key.length == 1) {
            let char = event.key;
            terminal.input += char;
        }
        terminal.input_text.text =  '>>> ' + terminal.input;
        terminal.jump();
    }
}

window.addEventListener('wheel', scroll);
window.addEventListener('keydown', keyDown);

//Main loop
function gameLoop(){
    for (let i=0; i<to_write.length; i++) {
        let message = to_write[i];
        message.delay -= ticker.elapsedMS;
        if (message.delay <= 0) {
            if (message.type == "send") {
                terminal.write(message.content, terminal.norm_font);
            } else if (message.type == "int") {
                enqueue_int(message.content);
            }
            to_write.splice(i, 1);
        }
    }

    let scale = renderer.screen.height / NATIVE;
    stage.scale.set(scale, scale);
    renderer.render(stage);
}

//Create the ticker
const ticker = new PIXI.Ticker();

//Create the loader, assign events, add assets, and start the loader
let loader = PIXI.Loader.shared;

loader.onComplete.add(loadComplete);
loader.load();

//Start the ticker
ticker.start();