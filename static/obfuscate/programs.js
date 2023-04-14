let ice = [
    {
        name: "watchdog",
        type: "Sentry",
        info: "While slotted attempts to detect hostile breakers every 10ms. If an intrusion attempt is detected, watchdog will send an interrupt with information on the detected program and the number of milliseconds until it activates.",
        time: 10,
        strength: 0
    },
    {
        name: "password",
        type: "Gate",
        info: "While slotted prevents server from being breached",
        time: 30,
        strength: 2
    },
    {
        name: "codewall",
        type: "Barrier",
        info: "When slotted prevents server from being breached for 30ms before crumbling.",
        time:  20,
        strength: 5
    },
    {
        name: "katana",
        type: "Sentry",
        info: "When slotted launches deadly neural EMP upon any attempted breach.",
        time: 20,
        strength: 3
    }
];
let breakers = [
    {
        name: "codex",
        info: "Breaks Gate ICE of strength less than or equal to 3.",
        time: 40
    },
    {
        name: "gnat",
        info: "Reveals all ICE currently slotted by opponent on connected node.",
        time: 10
    },
    {
        name: "drill",
        info: "Breaks Barrier ICE of strength less than or equal to 7.",
        time: 40
    },
    {
        name: "shinobi",
        info: "Breaks Sentry ICE of strength less than or equal to 3.",
        time: 30
    }
];
let data = [
    {
        name: "readme.txt",
        contents: "These are the contents of a file."
    }
];