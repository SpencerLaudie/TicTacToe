let currentlyDragging = null;
let currentlyDropping = null;
let exTurn = true;
let done = false;

var exes = new Set();
var ohs = new Set();


function mouseDown(elemId) {
  // set currentlyDragging to the element clicked on
  currentlyDragging = document.getElementById(elemId);
  currentlyDragging.style.zindex = "-100";
  currentlyDragging.style.position = "absolute";

  document.addEventListener('mousemove', onMouseMove);
  document.body.append(currentlyDragging);
}

function moveAt(clientX, clientY) {
  currentlyDragging.style.left = clientX - currentlyDragging.offsetWidth / 2 + 'px';
  currentlyDragging.style.top = clientY - currentlyDragging.offsetHeight / 2 + 'px';
}

function onMouseMove(event) {
  moveAt(event.clientX, event.clientY);
}

function remEventListeners() {
  // cannot be dragged anymore
  currentlyDragging.onmousedown = null;
  currentlyDragging.onmouseup = null;

  // stop following cursor
  document.removeEventListener('mousemove', onMouseMove);

  // can not drop here anymore
  currentlyDropping.onmouseover = null;
}

function attachToDropZone() {
  currentlyDropping.append(currentlyDragging);
  currentlyDragging.style.position = 'static';
}

function attachToPieceContainer() {
  if (isCurrPieceEx()) {
    document.getElementById("exes").append(currentlyDragging);
    currentlyDragging.style.position="static";
  }
  else {
    document.getElementById("ohs").append(currentlyDragging);
    currentlyDragging.style.position="static";
  }
}

function putNewPiece() {
  if (isCurrPieceEx()) {
    let ex = "<img src='/images/ex.svg' alt='ex' id='ex' class='piece ex' onmousedown=\"mouseDown('ex');\" onmouseup=\"mouseUp();\" ondragstart=\"return false;\">"
    document.getElementById("exes").innerHTML = ex;
  }
  else {
    let oh = "<img src='/images/oh.svg' alt='oh' id='oh' class='piece oh' onmousedown=\"mouseDown('oh');\" onmouseup=\"mouseUp();\" ondragstart=\"return false;\">"
    document.getElementById("ohs").innerHTML = oh;
  }
}

function isCurrPieceEx() {
  if (currentlyDragging.getAttribute('id') == 'ex') {
    return true;
  }
  else {
    return false;
  }
}

function recordPlacement() {
  if (isCurrPieceEx()) {
    exes.add(parseInt(currentlyDropping.getAttribute('id')));
  }
  else {
    ohs.add(parseInt(currentlyDropping.getAttribute('id')));
  }
}

function checkWin(set) {
  if (set.has(1) && set.has(2) && set.has(3)) return true;
  if (set.has(4) && set.has(5) && set.has(6)) return true;
  if (set.has(7) && set.has(8) && set.has(9)) return true;
  if (set.has(1) && set.has(4) && set.has(7)) return true;
  if (set.has(2) && set.has(5) && set.has(8)) return true;
  if (set.has(3) && set.has(6) && set.has(9)) return true;
  if (set.has(1) && set.has(5) && set.has(9)) return true;
  if (set.has(3) && set.has(5) && set.has(7)) return true;
}

function mouseUp() {
  if (currentlyDragging != null) {
    if (currentlyDropping != null && isTurn() && !done) {

      remEventListeners();
      attachToDropZone();
      recordPlacement();
      putNewPiece();
      finishTurn();


      currentlyDragging.removeAttribute('id');
      currentlyDragging = null;

      if (checkWin(exes)) {
        won(0);
      }
      if (checkWin(ohs)) {
        won(1);
      }
    }
    else {
      attachToPieceContainer();
    }
  }
}

function won(piece) {
  done = true;
  if (piece) {
    document.getElementById('message').innerHTML = "O's Win!";
  }
  else {
    document.getElementById('message').innerHTML = "X's Win!";
  }
  document.getElementById('message').appendChild();

}

function isTurn() {
  if (isCurrPieceEx() && exTurn) {
    return true;
  }
  else if (!isCurrPieceEx() && !exTurn) {
    return true;
  }
  else {
    return false;
  }
}

function finishTurn() {
  if (isCurrPieceEx()) {
    document.getElementById('message').innerHTML = "O's turn";
    exTurn = false;
  }
  else {
    document.getElementById('message').innerHTML = "X's turn";
    exTurn = true;
  }
}

function setDropSite(id) {
  if (currentlyDragging != null) {
    currentlyDropping = document.getElementById(id);
  }
}

function revertDropSite() {
  currentlyDropping = null;
}
