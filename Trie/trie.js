let addWordText = document.getElementById('add_word');
let addWordButton = document.getElementById('add');
let deleteWordText = document.getElementById('delete_word');
let deleteWordButton = document.getElementById('delete');
let searchWordText = document.getElementById('search_word');
let searchWordButton = document.getElementById('search');
let info = document.getElementById('info');
let id = 0;
let wordsList = [];

addWordButton.addEventListener('click', function (event) {
    if (addWordText.value.length === 0) {
        alert('Please enter a word.')
        return;
    }
    addWord();
});

deleteWordButton.addEventListener('click', function (event) {
    if (deleteWordText.value.length === 0) {
        alert('Please enter a word.')
        return;
    }
    deleteWord();
});

searchWordButton.addEventListener('click', function (event) {
    if (searchWordText.value.length === 0) {
        alert('Please enter a word.')
        return;
    }
    searchWord();
});


const SUCCESS_COLOR = "green";
const BORDER_COLOR = "black";

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function newNode(val, par) {
    return {
        val: val,
        par: par,
        occ: 0,
        end: false,
        children:{},
        childValues:[],
        x: undefined,
        y: undefined,
        width: undefined
    }
}

let root = newNode(undefined, undefined);
const GAP_Y = 50;
const NODE_DIAMETER = 30;
const NODE_SPACING_X = 50;
const NODE_SPACING_Y = 50;
const END_WORD_COLOR = "purple";
const NORMAL_NODE_COLOR = "black";
const TEXT_COLOR = "orange";

function calcWidth(node) {
    let width = 0;
    for (let i = 0; i < node.childValues.length; i++) {
        let char = node.childValues[i];
        calcWidth(node.children[char]);
        width += node.children[char].width;
    }
    width += Math.max(0, node.childValues.length - 1) * NODE_SPACING_X;
    node.width = Math.max(NODE_DIAMETER, width);
}

function findPos(node) {
    let x = node.x - node.width / 2;
    let y = node.y + Math.max(NODE_SPACING_Y, node.width * 0.2) + NODE_DIAMETER;
    for (let i = 0; i < node.childValues.length; i++) {
        let char = node.childValues[i];
        let child = node.children[char];
        child.x = x + child.width / 2;
        child.y = y;
        findPos(child);
        x += child.width + NODE_SPACING_X;
    }
}

function write_text(X, Y, character, color) {
    if (character === undefined) return;
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.font = "30px Arial";
    ctx.fillText(character, X - 10, Y + 10);
    ctx.restore();
}

function drawCircle(X, Y, color, thickness) {
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = thickness;
    ctx.strokeStyle = color;
    ctx.arc(X, Y, NODE_DIAMETER, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
}

function getModifiedCoordinates(X1, Y1, X2, Y2) {
    let dx = X2 - X1, dy = Y2 - Y1;
    let angle = Math.atan2(dy, dx);
    let angleInDegrees = angle * 180 / Math.PI;
    if (X2 > X1 && angleInDegrees <= 90) angle = Math.PI - angle;
    if (X2 < X1 && angleInDegrees >= 90) angle = Math.PI - angle;
    X1 -= NODE_DIAMETER* Math.cos(angle);
    Y1 += NODE_DIAMETER * Math.sin(angle);
    X2 += NODE_DIAMETER * Math.cos(angle);
    Y2 -= NODE_DIAMETER * Math.sin(angle);
    return {X1, Y1, X2, Y2};
}

function drawLine(X1, Y1, X2, Y2, thickness = 1) {
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = thickness;
    ctx.strokeStyle = thickness > 1 ? SUCCESS_COLOR: BORDER_COLOR;
    let C = getModifiedCoordinates(X1, Y1, X2, Y2);
    ctx.moveTo(C.X1, C.Y1);
    ctx.lineTo(C.X2, C.Y2);
    ctx.stroke();
    ctx.restore();
}

function drawTree(node) {
    drawCircle(node.x, node.y, node.end ? END_WORD_COLOR: NORMAL_NODE_COLOR, node.end ? 8: 2);
    write_text(node.x, node.y, node.val, TEXT_COLOR);
    for (let i = 0; i < node.childValues.length; i++) {
        let char = node.childValues[i];
        drawLine(node.x, node.y, node.children[char].x, node.children[char].y);
        drawTree(node.children[char]);
    }
}

function buildTree() {
    clearCanvas();
    calcWidth(root);
    root.x = canvas.width / 2;
    root.y = GAP_Y + NODE_DIAMETER / 2;
    findPos(root);
    drawTree(root);
}

function addWord() {
    let word = addWordText.value;

    for (let i = 0; i < wordsList.length; i++) {
        if (wordsList[i] === word) {
            wordsList.splice(i);
            info.innerText = `Word already present in dictionary.`
            return;
        }
    }

    wordsList.push(word);
    let current = root;
    for (let i = 0; i < word.length; i++) {
        let char = word[i];
        let child = current.children[char];
        if (child === undefined) {
            child = newNode(char, current);
            current.children[char] = child;
            current.childValues.push(char);
            current.childValues.sort(function (a, b) {
                return a.localeCompare(b);
            });
        }
        current = child;
        current.occ++;
    }
    current.end = true;
    info.innerText = `Word ${word} added to dictionary.`
    buildTree();
}

function deleteWord() {
    let word = deleteWordText.value;
    let pres = false;
    for (let i = 0; i < wordsList.length; i++) {
        if (wordsList[i] === word) {
            wordsList.splice(i);
            pres = true;
            break;
        }
    }
    if (pres) {
        let current = root;
        for (let i = 0; i < word.length; i++) {
            current.children[word[i]].occ--;
            if (current.children[word[i]].occ === 0) {
                let ind = current.childValues.indexOf(word[i]);
                current.childValues.splice(ind);
                current.children[word[i]] = undefined;
                delete current.children[word[i]];
                break;
            }else{
                current = current.children[word[i]];
            }
            if (i === word.length - 1) current.end = false;
        }
        buildTree();
        info.innerText = `Word ${word} deleted from dictionary.`;
    }else{
        info.innerText = `Word ${word} is not present in  dictionary.`
    }
}

function searchWord() {
    let word = searchWordText.value;
    let current = root;
    let path = [{x: current.x, y: current.y}];
    for (let i = 0; i < word.length; i++) {
        let char = word[i];
        let child = current.children[char];
        if (child === undefined) {
            info.innerText = `Word ${word} not found in dictionary.`
            break;
        }
        path.push({x: child.x, y: child.y});
        current = child;
    }
    drawCircle(path[0].x, path[0].y, SUCCESS_COLOR, 8);
    let i = 1;
    run();
    function run() {
        setTimeout(function () {
            drawLine(path[i - 1].x, path[i - 1].y, path[i].x, path[i].y, 8);
            drawCircle(path[i].x, path[i].y, SUCCESS_COLOR, 8);
            ++i;
            if (i < path.length) {
                run();
            }else{
                if (current !== undefined && current.end) {
                    info.innerText = `Found ${word} in dictionary.`;
                }else{
                    info.innerText = `${word} not present in dictionary.`;
                }
            }
        }, 700);
    }
}