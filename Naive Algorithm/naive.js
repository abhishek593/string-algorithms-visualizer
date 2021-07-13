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
    naive_string_search();
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
const TITLES_COLOR = "orange";
const MATCHED_COLOR = "purple";

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

function drawBorderRectangle(X_TXT, Y_TXT, color) {
    ctx.strokeStyle = color;
    ctx.strokeRect(X_TXT, Y_TXT, SQUARE_SIDE, SQUARE_SIDE);
}

function writeTitles(X_TXT, Y_TXT, text) {
    ctx.save();
    ctx.fillStyle = TITLES_COLOR;
    ctx.font = "20px Arial";
    ctx.fillText(text, X_TXT, Y_TXT);
    ctx.restore();
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

function build_text(from, len, failIndex, TXT) {
    clearCanvas();
    writeTitles(30, 90, "TEXT: ");
    let X_TXT = 150;
    let Y_TXT = 40;
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
    writeTitles(30, 230, "PATTERN: ");
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
    writeTitles(30, 350, "Matched Positions: ");
    let X_TXT = 230;
    let Y_TXT = 300;
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

function naive_string_search() {
    clearCanvas();
    let MATCHED_INDICES = [];
    let PAT = pattern.value;
    let TXT = text.value;
    let PAT_LEN = PAT.length, TXT_LEN = TXT.length;
    let i = 0;
    run();
    function run() {
        info.innerText = `Starting Matching at position ${i}.`
        setTimeout(function () {
            build_text(-1, 0, -1, TXT);
            let k = i;
            let j = 0;
            run2();
            let matched = true;
            function run2() {
                setTimeout(function () {
                    if (PAT[j] === TXT[k]) {
                        info.innerText = `Matched ${TXT[k]}.`
                        ++k;
                        build_text(i, j + 1, -1, TXT);
                        build_pattern(i, j + 1, -1, PAT);
                    }else{
                        info.innerText = `Mismatch at ${TXT[k]}.`
                        matched = false;
                        build_text(i, j + 1, i + j, TXT);
                        build_pattern(i, j + 1, j, PAT);
                        j = PAT_LEN;
                    }
                    ++j;
                    if (j < PAT_LEN) {
                        run2();
                    }else{
                        if (matched) MATCHED_INDICES.push(i);
                        ++i;
                        if (i < TXT_LEN) {
                            run();
                        }else{
                            info.innerText = `Finished Naive String Matching Algorithm.`
                            buildFinalMatches(MATCHED_INDICES, TXT);
                        }
                    }
                }, 300);
            }
        }, 1000);
    }
}