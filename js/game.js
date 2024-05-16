//* Selectors
const container = document.querySelector(".container");
const namePlayer = document.getElementById("name-player");
const periodRadio = document.getElementById("Period");
const numberRadio = document.getElementById("number");
const periodInput = document.getElementById("periodInput");
const numberInput = document.getElementById("numberInput");
const countdownDisplay = document.getElementById("time-try");
const boxInfoGame = document.querySelector(".info-game");
const form = document.querySelector(".gameInfo");
const memoryNumbers = document.getElementById("memoryNumbers");
const guessInput = document.getElementById("guessInput");
const tryBtn = document.getElementById("try-btn");
const formGuess = document.getElementById("gameForm");
const endGame = document.querySelector(".endGame");
//? Player information
let Player = [];

//? Variable to track whether the game has started
let gameStarted = false;
let limit = 3; //! limit of numbers to generate

//? To calculate consecutive wins
let fervor = 0;
let testerFervor = true;

let selectedGameMode;

let numberSuccesses = 0,
  numberFailures = 0,
  totalSuccess = numberSuccesses - numberFailures;

form.addEventListener("submit", (e) => {
  let nowDate = new Date();
  e.preventDefault();
  startGame();
  Player.push({
    namePlayer: namePlayer.value,
    numberSuccesses: numberSuccesses,
    numberFailures: numberFailures,
    totalSuccess: totalSuccess,
    time: nowDate,
    fervor: fervor,
  });
});

formGuess.addEventListener("submit", (e) => {
  e.preventDefault();
  handleTry();
  displayRandomNumbers();
});

//TODO: Function to toggle between game modes
function wayPlaying() {
  periodRadio.addEventListener("change", () => {
    toggleGameMode(1);
    getSelectedGameMode();
  });
  numberRadio.addEventListener("change", () => {
    toggleGameMode(2);
    getSelectedGameMode();
  });
}
wayPlaying();

//TODO: Function to start game based on selected mode
function startGame() {
  !gameStarted && displayStartMessage();
  gameStarted = true;
  boxInfoGame.classList.add("displayed");
}

//TODO: Function to start timed game
function startTimedGame() {
  const durationInSeconds = convertToSeconds(periodInput.value);
  displayRandomNumbers();
  startCountdown(durationInSeconds);
  countdownDisplay.style.display = "block";
  document.querySelector(".start-game").style.display = "block";

  setTimeout(() => {
    stopGame();
  }, durationInSeconds * 1000);
}

//TODO: Function to start limited attempts game
function startLimitedGame() {
  let n = numberInput.value;
  countdownDisplay.innerText = `${n <= 0 ? "Time Up" : n--}`;
  countdownDisplay.style.display = "block";
  displayRandomNumbers();
  document.querySelector(".start-game").style.display = "block";
}

//TODO: Function to toggle game mode UI
function toggleGameMode(mode) {
  if (mode === 1) {
    periodInput.style.display = "block";
    periodInput.setAttribute("required", "required");
    numberInput.removeAttribute("required");
    periodRadio.setAttribute("checked", "checked");
    numberRadio.removeAttribute("checked");
    numberInput.style.display = "none";
  } else if (mode === 2) {
    numberInput.style.display = "block";
    numberInput.setAttribute("required", "required");
    periodInput.removeAttribute("required");
    numberRadio.setAttribute("checked", "checked");
    periodRadio.removeAttribute("checked");
    periodInput.style.display = "none";
  }
}

//TODO: Function to get selected game mode
function getSelectedGameMode() {
  if (periodRadio.checked) {
    selectedGameMode = 1;
  } else if (numberRadio.checked) {
    selectedGameMode = 2;
  }
}
getSelectedGameMode();
//TODO: Function to convert period to seconds
function convertToSeconds(period) {
  const [hours, minutes, seconds] = period.split(":");
  return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
}

//TODO: Function to start countdown
function startCountdown(durationInSeconds) {
  let timeLeft = durationInSeconds;
  const countdownInterval = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      countdownDisplay.innerText = "Time's up";
    } else {
      const hours = Math.floor(timeLeft / 3600);
      const minutes = Math.floor((timeLeft % 3600) / 60);
      const seconds = timeLeft % 60;
      countdownDisplay.innerText = `${hours}:${minutes}:${seconds}`;
      timeLeft--;
    }
  }, 1000);
}

//TODO: Function to display random numbers
function displayRandomNumbers() {
  let numbersToRemember = [];
  memoryNumbers.innerText = "";
  const displayDuration = 1000;
  for (let i = 0; i < limit; i++) {
    const randomNumber = Math.floor(Math.random() * 10);
    const color = getRandomColor();
    const numberElement = document.createElement("span");
    numberElement.textContent = randomNumber;
    numberElement.className = "number";
    numberElement.style.color = color;
    numbersToRemember.push(randomNumber);
    memoryNumbers.appendChild(numberElement);
    memoryNumbers.style.opacity = "1";
  }
  setTimeout(() => {
    memoryNumbers.style.opacity = "0";
    guessInput.style.display = "block";
    tryBtn.style.display = "block";
  }, displayDuration);
}

//TODO: Function to generate a random color
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

//TODO: Function to handle try button click
function handleTry() {
  const userGuess = guessInput.value.trim();
  const numbersToRemember = getNumbersToRemember();
  checkGuess(userGuess, numbersToRemember)
    ? updateGame(true)
    : updateGame(false);
  if (selectedGameMode == 2) {
    --numberInput.value <= 0 ? stopGame() : startLimitedGame();
  }
}

//TODO: Function to get numbers to remember
function getNumbersToRemember() {
  let numbersToRemember = [];
  const numberElements = memoryNumbers.querySelectorAll(".number");
  numberElements.forEach((element) => {
    numbersToRemember.push(parseInt(element.textContent));
  });
  return numbersToRemember;
}

//TODO: Function to check user's guess
function checkGuess(userGuess, numbersToRemember) {
  return userGuess == numbersToRemember.join("");
}

//TODO: Function to update game state based on guess
function updateGame(success) {
  const successSound = new Audio("../audios/correct.mp3");
  const failSound = new Audio("../audios/wrong.mp3");
  if (success) {
    successSound.play();
    Player[Player.length - 1].numberSuccesses++;
    showMessage("Success Guess", 1);
    limit <= 15 ? limit++ : limit;
    checkFervor(success);
  } else {
    failSound.play();
    Player[Player.length - 1].numberFailures++;
    showMessage("Wrong Guess", 0);
    limit <= 3 ? limit : limit--;
    checkFervor(success);
  }
  Player[Player.length - 1].totalSuccess =
    Player[Player.length - 1].numberSuccesses -
    Player[Player.length - 1].numberFailures;
  localStorage.setItem("players", JSON.stringify(Player));
  showPlayerInfo();
}

//TODO: This function regulates fervor
function checkFervor(success) {
  let eleFervor = document.querySelector(".fervor");
  if (testerFervor && success) {
    fervor++;
    Player[Player.length - 1].fervor++;
    eleFervor.setAttribute("data-fervor", fervor);
  } else {
    fervor = 0;
    Player[Player.length - 1].fervor = 0;
    eleFervor.removeAttribute("data-fervor");
  }
}

//TODO: Function to display start message
function displayStartMessage() {
  let countdown = 3;
  const startMessageElement = document.createElement("h1");
  startMessageElement.textContent = "Get ready";
  startMessageElement.className = "time-start";
  container.appendChild(startMessageElement);

  //? Start a countdown to the beginning of the game
  const countdownInterval = setInterval(() => {
    if (countdown === 0) {
      clearInterval(countdownInterval);
      startMessageElement.remove();
      selectedGameMode == 1 ? startTimedGame() : startLimitedGame();
      console.log(selectedGameMode);
    } else {
      startMessageElement.textContent = `Starting in ${countdown}...`;
      countdown--;
    }
  }, 1000);
}

//TODO: Function to display message
function showMessage(title, status) {
  const messageElement = document.createElement("div");
  messageElement.className = "msg";
  const titleElement = document.createElement("h3");
  titleElement.innerText = title;
  const icon = document.createElement("i");
  status
    ? (icon.className = "fa-solid fa-circle-check")
    : (icon.className = "fa-solid fa-circle-xmark");
  messageElement.appendChild(titleElement);
  messageElement.appendChild(icon);

  formGuess.appendChild(messageElement);
  setTimeout(() => {
    messageElement.remove();
  }, 1000);
}

//TODO: Function to show player information
function showPlayerInfo() {
  const latestPlayer = Player[Player.length - 1];
  const playerInfoContainer = document.querySelector(".info");
  if (playerInfoContainer) {
    playerInfoContainer.innerHTML = "";
    const playerNameElement = document.createElement("h3");
    playerNameElement.innerText = `Player Name: ${latestPlayer.namePlayer}`;
    const successCountElement = document.createElement("h3");
    successCountElement.innerText = `Success Count: ${latestPlayer.numberSuccesses}`;
    const failureCountElement = document.createElement("h3");
    failureCountElement.innerText = `Failure Count: ${latestPlayer.numberFailures}`;
    const totalSuccessElement = document.createElement("h3");
    totalSuccessElement.innerText = `Total Success: ${latestPlayer.totalSuccess}`;
    playerInfoContainer.appendChild(playerNameElement);
    playerInfoContainer.appendChild(successCountElement);
    playerInfoContainer.appendChild(failureCountElement);
    playerInfoContainer.appendChild(totalSuccessElement);
  } else {
    console.error("playerInfoContainer is null");
  }
}
function stopGame() {
  gameStarted = false;
  endGame.classList.add("active");
}
window.onload = () => {
  localStorage.length > 0
    ? (Player = JSON.parse(localStorage.getItem("players")))
    : [];
};
