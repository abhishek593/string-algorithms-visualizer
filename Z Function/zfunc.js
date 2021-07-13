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
    Z_FUNCTION();
}

animateButton.addEventListener('click', function (event) {
    init();
})

resetButton.addEventListener('click', function (event) {
    init();
})


const BORDER_COLOR = "black";
const MATCHED_COLOR = "purple";
const SPECIAL_BORDER_COLOR = "brown"
const TITLES_COLOR = "orange";

const SQUARE_SIDE = 70;
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

function clearCanvas() {
    ctx.fillStyle = "white";
    ctx.fillRect(20, 30, 1500, 1000);
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

function drawThickBorderRectangle(X_TXT, Y_TXT, color, thickness) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect( X_TXT - thickness, Y_TXT - thickness, SQUARE_SIDE + thickness * 2, SQUARE_SIDE + thickness * 2);
    ctx.fillStyle = 'white';
    ctx.fillRect( X_TXT, Y_TXT, SQUARE_SIDE, SQUARE_SIDE);
    ctx.restore();
}

function drawBorderRectangle(X_TXT, Y_TXT, color) {
    ctx.strokeStyle = color;
    ctx.strokeRect(X_TXT, Y_TXT, SQUARE_SIDE, SQUARE_SIDE);
}

function buildZ(Z, till, special) {
    clearCanvas();
    writeTitles(30, 80, "Z[i]: ");
    let X_TXT = 160;
    let Y_TXT = 40;
    for (let i = 0; i < Z.length; i++) {
        if (i === special) {
            //Todo: Insert Animation here
            drawThickBorderRectangle(X_TXT, Y_TXT, SPECIAL_BORDER_COLOR, 5);
        }else{
            drawBorderRectangle(X_TXT, Y_TXT, BORDER_COLOR);
        }
        if (i <= till) {
            write_text(X_TXT, Y_TXT, Z[i], BORDER_COLOR);
        }
        X_TXT += SQUARE_SIDE + 4;
    }
}

function build_text(l, r, TXT) {
    writeTitles(30, 190, "PAT # TEXT: ");
    let X_TXT = 160;
    let Y_TXT = 150;
    for (let i = 0; i < TXT.length; i++) {
        if (i >= l && i <= r) {
            drawFilledRectangle(X_TXT, Y_TXT, "#00BFFF");
        }else{
            drawBorderRectangle(X_TXT, Y_TXT, BORDER_COLOR);
        }
        write_text(X_TXT, Y_TXT, TXT[i], "blue");
        X_TXT += SQUARE_SIDE + 4;
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

function Z_FUNCTION() {
    let PAT = pattern.value;
    let TXT = text.value;
    let STR = PAT + '#' + TXT;
    let STR_LEN = STR.length;
    let Z = new Array(STR_LEN);
    for (let j = 0; j < STR_LEN; j++) {
        Z[j] = 0;
    }

    let i = 1, l = 0, r = 0;
    buildZ(Z, 0);
    info.innerText = "Initialised Z table with Z[0] = 0."
    run();
    function run() {
        setTimeout(function () {
            info.innerText = `Building Z[${i}].`;
            if (i <= r) {
                if (r - i + 1 < Z[i - l]) {
                    Z[i] = r - i + 1;
                    info.innerText = `Mirror position length is ${Z[i - l]} but we know information of length ${r - i + 1}.
                                    So Z[${i}] currently is ${r - i + 1}.`
                }else{
                    Z[i] = Z[i - l];
                    info.innerText = `Mirror position length is ${Z[i - 1]}.`
                }
            }
            buildZ(Z, i, i - l);
            build_text(l, r, STR);
            run2();
            function run2() {
                setTimeout(function () {
                    if (i + Z[i] < STR_LEN && STR[i + Z[i]] === STR[Z[i]]) {
                        ++Z[i];
                        if (i + Z[i] - 1 > r) {
                            l = i;
                            r = i + Z[i] - 1;
                            info.innerText = `Rightmost matched segment updated to [${l}, ${r}].`
                        }
                        buildZ(Z, i, -1);
                        build_text(l, r, STR);
                        run2();
                    }else{
                        ++i;
                        if (i < STR_LEN) {
                            run();
                        }else{
                            info.innerText = `Finished building Z Function.`
                            let MATCHED_INDICES = [];
                            for (let j = PAT.length + 1; j < STR_LEN; j++) {
                                if (Z[j] === PAT.length) {
                                    MATCHED_INDICES.push(j - PAT.length - 1);
                                }
                            }
                            buildFinalMatches(MATCHED_INDICES, TXT);
                        }
                    }
                }, 1000);
            }
        }, 1500);
    }
}