let pattern = document.getElementById('pattern');
let text = document.getElementById('text');
let animateButton = document.getElementById('animate');
let resetButton = document.getElementById('reset');
let info = document.getElementById('info');
let id = 0;

function init() {
    if (pattern.value.length === 0) {
        alert("Pattern is empty.");
        return;
    }
    if (text.value.length === 0) {
        alert("Text is empty.");
        return;
    }
    id += 100;
    while (id--) {
        clearTimeout(id);
    }
    kmp();
}

animateButton.addEventListener('click', function (event) {
    init();
})

resetButton.addEventListener('click', function (event) {
    init();
})


let TXT_POSITIONS = [];
const SUCCESS_COLOR = "green";
const FAILURE_COLOR = "red";
const BORDER_COLOR = "black";
const MATCHED_COLOR = "purple";
const TITLES_COLOR = "orange";

const SQUARE_SIDE = 70;
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

function clearCanvas() {
    ctx.fillStyle = "white";
    ctx.fillRect(20, 30, 1500, 1000);
    TXT_POSITIONS = [];
}

function drawFilledRectangle(X_TXT, Y_TXT, color) {
    ctx.fillStyle = color;
    ctx.fillRect(X_TXT, Y_TXT, SQUARE_SIDE, SQUARE_SIDE);
}

function write_text(X_TXT, Y_TXT, character, color) {
    ctx.fillStyle = color;
    ctx.font = "50px Arial";
    ctx.fillText(character, X_TXT + 24, Y_TXT + SQUARE_SIDE / 2 + 15);
}

function writeTitles(X_TXT, Y_TXT, text) {
    ctx.save();
    ctx.fillStyle = TITLES_COLOR;
    ctx.font = "20px Arial";
    ctx.fillText(text, X_TXT, Y_TXT);
    ctx.restore();
}

function drawBorderRectangle(X_TXT, Y_TXT, color) {
    ctx.strokeStyle = color;
    ctx.strokeRect(X_TXT, Y_TXT, SQUARE_SIDE, SQUARE_SIDE);
}

function drawThickBorderRectangle(X_TXT, Y_TXT, color, thickness) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect( X_TXT - thickness, Y_TXT - thickness, SQUARE_SIDE + thickness * 2, SQUARE_SIDE + thickness * 2);
    ctx.fillStyle = 'white';
    ctx.fillRect( X_TXT, Y_TXT, SQUARE_SIDE, SQUARE_SIDE);
    ctx.restore();
}

function buildPI(PI, till) {
    clearCanvas();
    writeTitles(30, 80, "Prefix[i]: ");
    let X_TXT = 160;
    let Y_TXT = 40;
    for (let i = 0; i < PI.length; i++) {
        drawBorderRectangle(X_TXT, Y_TXT, BORDER_COLOR);
        if (i <= till) {
            write_text(X_TXT, Y_TXT, PI[i], BORDER_COLOR);
        }
        X_TXT += SQUARE_SIDE + 4;
    }
}

function build_text(from, len, failIndex, TXT) {
    writeTitles(30, 190, "PAT # TEXT: ");
    let X_TXT = 160;
    let Y_TXT = 150;
    for (let i = 0; i < TXT.length; i++) {
        if (i === from) {
            drawFilledRectangle(X_TXT, Y_TXT, i === failIndex ? FAILURE_COLOR: SUCCESS_COLOR);
            len--;
            if (len > 0) from++;
        }else{
            drawBorderRectangle(X_TXT, Y_TXT, BORDER_COLOR);
        }
        TXT_POSITIONS.push({'X': X_TXT, 'Y': Y_TXT});
        write_text(X_TXT, Y_TXT, TXT[i], "blue");
        X_TXT += SQUARE_SIDE + 4;
    }
}

function build_pattern(matchStart, matchLen, failIndex, PAT) {
    let X_PAT = TXT_POSITIONS[matchStart].X;
    let Y_PAT = TXT_POSITIONS[matchStart].Y + SQUARE_SIDE + 70;
    for (let i = 0; i < PAT.length; i++) {
        if (matchLen > 0) {
            drawFilledRectangle(X_PAT, Y_PAT, i === failIndex ? FAILURE_COLOR: SUCCESS_COLOR);
            matchLen--;
        }else{
            drawBorderRectangle(X_PAT, Y_PAT, BORDER_COLOR);
        }
        write_text(X_PAT, Y_PAT, PAT[i], "blue");
        X_PAT += SQUARE_SIDE + 4;
    }
}

function buildFinalMatches(MATCHED_INDICES, TXT) {
    let X_TXT = 230;
    let Y_TXT = 280;
    writeTitles(30, 330, "Matched Positions: ");
    for (let i = 0; i < TXT.length; i++) {
        if (MATCHED_INDICES.includes(i)) {
            drawThickBorderRectangle(X_TXT, Y_TXT, MATCHED_COLOR, 5);
        }else{
            drawBorderRectangle(X_TXT, Y_TXT, BORDER_COLOR);
        }
        write_text(X_TXT, Y_TXT, TXT[i], "blue");
        X_TXT += SQUARE_SIDE + 4;
    }
}

function kmp() {
    let PAT = pattern.value;
    let TXT = text.value;
    let STR = PAT + '#' + TXT;
    let STR_LEN = STR.length;
    let PI = new Array(STR_LEN);
    PI[0] = 0;
    let i = 1;
    buildPI(PI, 0);
    info.innerText = "Initialised PI table with PI[0] = 0."
    run();
    function run() {
        setTimeout(function () {
            buildPI(PI, i - 1);
            build_text(-1, 0, -1, STR);
            let j = PI[i - 1];
            info.innerText = `Building PI for position ${i}`;
            run2(1000);
            function run2(delay) {
                setTimeout(function () {
                    if (j > 0 && STR[j] !== STR[i]) {
                        let msg = `Mismatch at ${STR[j]}.`;
                        if (PI[j - 1] > 0) {
                            msg += `Moving to prefix parent of length ${PI[j - 1]}.`
                        }else{
                            msg += `No prefix parent matched.`;
                        }
                        info.innerText = msg;
                        buildPI(PI, i - 1);
                        build_text(i - j, j + 1, i, STR);
                        build_pattern(i - j, j + 1, j, STR)
                        j = PI[j - 1];
                        run2(delay + 1000);
                    }else{
                        let failed = true;
                        if (STR[j] === STR[i]) {
                            PI[i] = j + 1;
                            info.innerText = `Prefix of length ${PI[i]} found.`;
                            failed = false;
                        }else{
                            info.innerText = `No prefix match.`;
                            PI[i] = j;
                        }
                        buildPI(PI, i);
                        build_text(i - j, j + 1, failed ? i: -1, STR);
                        build_pattern(i - j, j + 1, failed ? j: -1, STR);
                        ++i;
                        if (i < STR_LEN) {
                            run();
                        }else if (i === STR_LEN) {
                            info.innerText = `Finished building Prefix Array.`;
                            clearCanvas();
                            buildPI(PI, STR_LEN - 1);
                            build_text(-1, 0, -1, STR);

                            let MATCHED_INDICES = [];
                            for (let j = PAT.length + 1; j < STR_LEN; j++) {
                                if (PI[j] === PAT.length) {
                                    MATCHED_INDICES.push(j - 2 * PAT.length);
                                }
                            }
                            buildFinalMatches(MATCHED_INDICES, TXT);
                        }
                    }
                }, delay);
            }
        }, 1500);
    }
}