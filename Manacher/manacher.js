let string = document.getElementById('string');
let animateOddManacherButton = document.getElementById('animateOddManacher');
let animateEvenManacherButton = document.getElementById('animateEvenManacher');
let info = document.getElementById('info');
let id = 0;

function init() {
    if (string.value.length === 0) {
        alert("String is empty.");
        return;
    }
    id += 100;
    while (id--) {
        clearTimeout(id);
    }
}

animateOddManacherButton.addEventListener('click', function (event) {
    init();
    OddManacher();
})

animateEvenManacherButton.addEventListener('click', function (event) {
    init();
    EvenManacher();
})

const BORDER_COLOR = "black";
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

function buildManacherArray(arr, till, special, shift = false) {
    clearCanvas();
    writeTitles(30, 80, shift ? "Even[i]: ": "Odd[i]: ");
    let X_TXT = shift ? 125: 160;
    let Y_TXT = 40;
    for (let i = 0; i < arr.length; i++) {
        if (i === special) {
            //Todo: Insert Animation here
            drawThickBorderRectangle(X_TXT, Y_TXT, SPECIAL_BORDER_COLOR, 5);
        }else{
            drawBorderRectangle(X_TXT, Y_TXT, BORDER_COLOR);
        }
        if (i <= till) {
            write_text(X_TXT, Y_TXT, arr[i], BORDER_COLOR);
        }
        X_TXT += SQUARE_SIDE + 4;
    }
}

function build_text(l, r, TXT) {
    writeTitles(30, 190, "String: ");
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

function OddManacher() {
    let STR = string.value;
    let STR_LEN = STR.length;
    let odd = new Array(STR_LEN);
    let i = 0, l = 0, r = -1;
    run();
    function run() {
        info.innerText = `Building Odd[${i}].`
        setTimeout(function () {
            if (i <= r) {
                if (r - i + 1 < odd[l + r - i]) {
                    odd[i] = r - i + 1;
                    info.innerText = `Mirror position is ${l + r - i}. But taken ${r - i + 1} since we know till information
                        till that point only.`
                }else{
                    odd[i] = odd[l + r - i];
                    info.innerText = `Mirror position is ${l + r - i}.Taken full.`
                }
                buildManacherArray(odd, i, l + r - i);
            }else{
                odd[i] = 1;
                l = i;
                r = i;
                info.innerText = `Index outside the rightmost found palindrome. Updated Segment to [${l}, ${r}].`
                buildManacherArray(odd, i, -1);
            }
            build_text(l, r, STR);
            run2();
            function run2() {
                setTimeout(function () {
                    if (i - odd[i] >= 0 && i + odd[i] < STR_LEN && STR[i - odd[i]] === STR[i + odd[i]]) {
                        ++odd[i];
                        if (i + odd[i] - 1 > r) {
                            l = i - odd[i] + 1;
                            r = i + odd[i] - 1;
                            info.innerText = `Updated rightmost palindrome to [${l}, ${r}].`
                        }
                        buildManacherArray(odd, i, -1);
                        build_text(l, r, STR);
                        run2();
                    }else{
                        ++i;
                        if (i < STR_LEN) {
                            run();
                        }else{
                            info.innerText = `Finished building Odd Manacher Array.`
                        }
                    }
                }, 2000);
            }
        }, 3000);
    }
}


function EvenManacher() {
    let STR = string.value;
    let STR_LEN = STR.length;
    let even = new Array(STR_LEN + 1);
    let i = 0, l = 0, r = -1;
    run();
    function run() {
        info.innerText = `Building Even[${i}].`
        setTimeout(function () {
            if (i <= r) {
                if (r - i + 1 < even[l + r - i + 1]) {
                    even[i] = r - i + 1;
                    info.innerText = `Mirror position is ${l + r - i + 1}. But taken ${r - i + 1} since we know till information 
                    till that point only.`
                }else{
                    even[i] = even[l + r - i + 1];
                    info.innerText = `Mirror position is ${l + r - i}.Taken full.`
                }
                buildManacherArray(even, i, l + r - i + 1, true);
            }else{
                even[i] = 0;
                buildManacherArray(even, i, -1, true);
            }
            build_text(l, r, STR);
            run2();
            function run2() {
                setTimeout(function () {
                    if (i - even[i] - 1 >= 0 && i + even[i] < STR_LEN && STR[i - even[i] - 1] === STR[i + even[i]]) {
                        if (i + even[i] > r) {
                            l = i - even[i] - 1;
                            r = i + even[i];
                            info.innerText = `Updated rightmost palindrome to [${l}, ${r}].`
                        }
                        ++even[i];
                        buildManacherArray(even, i, -1, true);
                        build_text(l, r, STR);
                        run2();
                    }else{
                        ++i;
                        if (i <= STR_LEN) {
                            run();
                        }else{
                            info.innerText = `Finished building Even Manacher Array.`
                        }
                    }
                }, 2000);
            }
        }, 3000);
    }
}