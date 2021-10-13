const videoElement = document.getElementsByClassName("input_video")[0];
const canvasElement = document.getElementsByClassName("output_canvas")[0];
const canvasCtx = canvasElement.getContext("2d");

function getRandomInt(max) {
  const min = Math.ceil(0);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateSequence(quantityOfButtons, quantityOfSequence) {
  let sequence = [];
  for (i = 0; i < quantityOfSequence; i++) {
    sequence.push(getRandomInt(quantityOfButtons));
  }
  return sequence;
}

function drawBlock({ canvasCtx, x, y, width, height, color }) {
  canvasCtx.fillStyle = color || "yellow";
  canvasCtx.fillRect(x, y, width, height);
}

function touched(landmark, button) {
  return landmark.x > button.x &&
    landmark.x < button.x + button.width &&
    landmark.y > button.y &&
    landmark.y < button.y + button.height &&
    button.canTrigger
    ? true
    : false;
}
const maxSequenceLength = 7;
let actualSequenceLenght = 4;
let state = {
  handTriggerButton: {
    x: 1050,
    y: 20,
    width: 130,
    height: 160,
    active: false,
    canTrigger: true,
  },
  initGameButton: {
    x: 515,
    y: 365,
    width: 245,
    height: 47,
    active: false,
    canTrigger: true,
  },
  helpButton: {
    x: 30,
    y: 475,
    width: 130,
    height: 150,
    active: false,
    canTrigger: true,
  },
  reinitGameButton: {
    x: 470,
    y: 120,
    width: 340,
    height: 200,
    active: false,
    canTrigger: true,
  },
  shoudlShowHandConnectors: false,
};
const COLORS = [
  "#4287f5",
  "#f54242",
  "#51d613",
  "#930ee6",
  "#f5eb2f",
  "#2ff5e4",
];

const roundState = {
  colorSequence: generateSequence(4, actualSequenceLenght),
  actualUserSequence: [],
  userTime: false,
  round: 1,
  buttons: {
    topLeftCorner: {
      x: 650,
      y: 270,
      width: 150,
      height: 150,
      active: false,
      canTrigger: true,
    },
    topRightCorner: {
      x: 480,
      y: 270,
      width: 150,
      height: 150,
      active: false,
      canTrigger: true,
    },
    bottomLeftCorner: {
      x: 650,
      y: 450,
      width: 150,
      height: 150,
      active: false,
      canTrigger: true,
    },
    bottomRightCorner: {
      x: 480,
      y: 450,
      width: 150,
      height: 150,
      active: false,
      canTrigger: true,
    },
  },
};

function displaySequence({ colorSequence, actualIndex }) {
  roundState.userTime = false;
  let selectedButton;
  const blockNumber = colorSequence[actualIndex];

  if (actualIndex >= colorSequence.length) {
    setTimeout(() => {
      roundState.userTime = true;
      return;
    }, 1000);
  }

  setTimeout(() => {
    if (blockNumber === 0) {
      selectedButton = document.getElementById("top-left-corner");
      selectedButton.classList.add("active");
    }

    if (blockNumber === 1) {
      selectedButton = document.getElementById("top-right-corner");
      selectedButton.classList.add("active");
    }

    if (blockNumber === 2) {
      selectedButton = document.getElementById("bottom-left-corner");
      selectedButton.classList.add("active");
    }

    if (blockNumber === 3) {
      selectedButton = document.getElementById("bottom-right-corner");
      selectedButton.classList.add("active");
    }

    setTimeout(() => {
      if (selectedButton) {
        selectedButton.classList.remove("active");
        const effect = new Audio("crash-sound.mp3");
        effect.currentTime = 0.5;
        effect.play();
      }

      displaySequence({ colorSequence, actualIndex: actualIndex + 1 });
    }, 1000);
  }, 1000);
}

function getUserSequence({ colorSequence, buttons, landmark, actualIndex }) {
  if (touched(landmark, buttons.topLeftCorner)) {
    const effect = new Audio("crash-sound.mp3");
    effect.currentTime = 0.5;
    effect.play();

    roundState.buttons.topLeftCorner.active =
      !roundState.buttons.topLeftCorner.active;
    roundState.buttons.topLeftCorner.canTrigger = false;
    selectedButton = document.getElementById("top-left-corner");
    selectedButton.classList.add("active");

    setTimeout(function () {
      selectedButton.classList.remove("active");
      roundState.buttons.topLeftCorner.canTrigger = true;
      roundState.actualUserSequence.push(0);
    }, 1000);
  }

  if (touched(landmark, buttons.topRightCorner)) {
    const effect = new Audio("crash-sound.mp3");
    effect.currentTime = 0.5;
    effect.play();

    roundState.buttons.topRightCorner.active =
      !roundState.buttons.topRightCorner.active;
    roundState.buttons.topRightCorner.canTrigger = false;
    selectedButton = document.getElementById("top-right-corner");
    selectedButton.classList.add("active");
    setTimeout(function () {
      selectedButton.classList.remove("active");
      roundState.buttons.topRightCorner.canTrigger = true;
      roundState.actualUserSequence.push(1);
    }, 2000);
  }

  if (touched(landmark, buttons.bottomLeftCorner)) {
    const effect = new Audio("crash-sound.mp3");
    effect.currentTime = 0.5;
    effect.play();

    roundState.buttons.bottomLeftCorner.active =
      !roundState.buttons.bottomLeftCorner.active;
    roundState.buttons.bottomLeftCorner.canTrigger = false;
    selectedButton = document.getElementById("bottom-left-corner");
    selectedButton.classList.add("active");
    setTimeout(function () {
      selectedButton.classList.remove("active");
      roundState.buttons.bottomLeftCorner.canTrigger = true;
      roundState.actualUserSequence.push(2);
    }, 2000);
  }

  if (touched(landmark, buttons.bottomRightCorner)) {
    const effect = new Audio("crash-sound.mp3");
    effect.currentTime = 0.5;
    effect.play();

    roundState.buttons.bottomRightCorner.active =
      !roundState.buttons.bottomRightCorner.active;
    roundState.buttons.bottomRightCorner.canTrigger = false;
    selectedButton = document.getElementById("bottom-right-corner");
    selectedButton.classList.add("active");
    setTimeout(function () {
      selectedButton.classList.remove("active");
      roundState.buttons.bottomRightCorner.canTrigger = true;
      roundState.actualUserSequence.push(3);
    }, 2000);
  }
}

let actualUserSequence = 0;

function nextRoundOrWin() {
  roundState.round++;
  const winGame = roundState.round === 4;
  if (winGame) {
    game = document.getElementsByClassName("game")[0];
    game.classList.add("invisible");

    const effect = new Audio("win-game.mp3");
    effect.currentTime = 0.5;
    effect.play();

    selectedButton = document.getElementsByClassName("win-game")[0];
    selectedButton.classList.remove("invisible");

    state.reinitGameButton.active = false;
    state.reinitGameButton.canTrigger = false;
    return;
  } else {
    selectedButton = document.getElementsByClassName("pass-round-game")[0];
    selectedButton.classList.remove("invisible");
    actualSequenceLenght++;
    roundState.colorSequence = generateSequence(4, actualSequenceLenght);
    roundState.actualUserSequence = [];
    roundState.userTime = false;

    setTimeout(function () {
      displaySequence({ canvasCtx, ...roundState, actualIndex: 0 });
      selectedButton = document.getElementsByClassName("pass-round-game")[0];
      selectedButton.classList.add("invisible");
      round = document.getElementById("round");
      round.textContent = " " + roundState.round;
    }, 2000);
  }
}

function resetGame() {
  state.reinitGameButton.active = false;

  state.reinitGameButton.canTrigger = false;
  selectedButton = document.getElementsByClassName("lost-game")[0];
  selectedButton.classList.add("invisible");

  electedButton = document.getElementsByClassName("win-game")[0];
  selectedButton.classList.add("invisible");

  const game = document.getElementsByClassName("game")[0];
  game.classList.remove("invisible");
  roundState.colorSequence = generateSequence(4, 4);
  roundState.actualUserSequence = [];
  roundState.userTime = false;

  roundState.round = 1;
  round = document.getElementById("round");
  round.textContent = " " + roundState.round;

  displaySequence({ canvasCtx, ...roundState, actualIndex: 0 });
}

function lostGame() {
  game = document.getElementsByClassName("game")[0];
  game.classList.add("invisible");

  selectedButton = document.getElementsByClassName("lost-game")[0];
  selectedButton.classList.remove("invisible");
  const effect = new Audio("lost-game.mp3");
  effect.currentTime = 0.5;
  effect.play();

  state.reinitGameButton.active = true;
  state.reinitGameButton.canTrigger = true;
}

function compareResults() {
  let allRight = true;

  for (let i = 0; i < roundState.colorSequence.length; i++) {
    if (roundState.colorSequence[i] !== roundState.actualUserSequence[i]) {
      allRight = false;
    }
  }


  if (allRight) {
    nextRoundOrWin();
  } else {
    lostGame();
  }
}
function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
    results.image,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );

  const { handTriggerButton, initGameButton, helpButton, reinitGameButton } =
    state;

  if (results.multiHandLandmarks) {
    results.multiHandLandmarks.forEach((landmarks, index) => {
      const x = landmarks[8].x * canvasElement.width;
      const y = landmarks[8].y * canvasElement.height;
      const landmark = { x, y };

      if (roundState.userTime && !state.reinitGameButton.active) {
        getUserSequence({ landmark, ...roundState });
        if (
          roundState.actualUserSequence.length ===
          roundState.colorSequence.length
        ) {
          roundState.userTime = false;
          compareResults();
        }
      }

      if (touched(landmark, initGameButton)) {
        state.initGameButton.active = !state.initGameButton.active;
        state.initGameButton.canTrigger = false;
        const dashboard = document.getElementsByClassName("dashboard")[0];
        const game = document.getElementsByClassName("game")[0];
        const round = document.getElementsByClassName("round")[0];

        dashboard.classList.add("invisible");
        game.classList.remove("invisible");
        round.classList.remove("invisible");

        displaySequence({ canvasCtx, ...roundState, actualIndex: 0 });
      }

      if (touched(landmark, handTriggerButton)) {
        state.handTriggerButton.active = !state.handTriggerButton.active;
        state.handTriggerButton.canTrigger = false;
        setTimeout(function () {
          state.handTriggerButton.canTrigger = true;
        }, 2000);
      }
      if (
        touched(landmark, reinitGameButton) &&
        state.reinitGameButton.active
      ) {
        state.reinitGameButton.active = false;
        state.reinitGameButton.canTrigger = false;

        resetGame();
      }

      if (touched(landmark, helpButton)) {
        state.helpButton.active = !state.helpButton.active;
        state.helpButton.canTrigger = false;
        const helpView = document.getElementsByClassName("help-view")[0];
        const helpExplanation =
          document.getElementsByClassName("help-explanation")[0];

        if (state.helpButton.active) {
          helpView.style.boxShadow = "0 0 0 0";
          helpExplanation.classList.remove("invisible");
        } else {
          helpView.style.boxShadow =
            "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)";
          helpExplanation.classList.add("invisible");
        }

        setTimeout(function () {
          state.helpButton.canTrigger = true;
        }, 2000);
      }

      if (state.handTriggerButton.active) {
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 5,
        });
        drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 2 });
        setTimeout(function () {
          status = true;
        }, 2000);
      }
    });
  }

  canvasCtx.restore();
}

const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  },
});
hands.setOptions({
  maxNumHands: 2,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.65,
});
hands.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 1280,
  height: 720,
});

camera.start();
