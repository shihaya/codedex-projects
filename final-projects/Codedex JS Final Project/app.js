// Constants
const bells = new Audio('sounds/bell.wav');

// DOM Elements
const startBtn = document.querySelector('.btn-start');
const pauseBtn = document.querySelector('.btn-pause');
const resetBtn = document.querySelector('.btn-reset');
const session = document.querySelector('.minutes');
const secondDiv = document.querySelector('.seconds');
const customSessionCheckbox = document.querySelector('.custom-settings-check');
const settingsInputs = document.querySelectorAll('.app-settings-box input[type="number"], .app-settings-box input[type="file"], .app-settings-box input[type="text"]');
const sessionButton = document.querySelector('.btn-session-settings');
const settingsButton = document.querySelector('.btn-visual-settings');
const colorPicker = document.querySelector('input[data-coloris]');
const fileInput = document.querySelector('.image-input');

// Variables
let myInterval;
let state = true;
let sessionAmount = Number.parseInt(session.value);
let totalSeconds;
let previousValue;
let phase = 'work';
let workTime = 25;
let breakTime = 5;
let longBreakTime = 15;
let pomodorosBeforeLongBreak = 4;
let pomodorosCount = 0;

// Functions
function updateSessionText() {
    const sessionElement = document.querySelector('.app-session');
    if (customSessionCheckbox.checked) {
        sessionElement.style.display = 'block';
        if (phase === 'work') {
            sessionElement.textContent = 'now: work';
        } else if (phase === 'break') {
            sessionElement.textContent = 'now: break';
        } else if (phase === 'longBreak') {
            sessionElement.textContent = 'now: long break';
        }
    } else {
        sessionElement.style.display = 'none';
    }
}

function updatePomodoros() {
    const pomodorosElement = document.querySelector('.app-pomodoros');
    if (customSessionCheckbox.checked) {
        pomodorosElement.style.display = 'block';
        pomodorosElement.textContent = 'today: ' + pomodorosCount;
    } else {
        pomodorosElement.style.display = 'none';
    }
}

const appTimer = () => {

    const minuteDiv = document.querySelector('.minutes');
    const secondDiv = document.querySelector('.seconds');

    totalSeconds = Number.parseInt(minuteDiv.value) * 60 + Number.parseInt(secondDiv.value);
    previousValue = Number.parseInt(session.value) * 60 + Number.parseInt(secondDiv.value);

    const updateSeconds = () => {
        const minuteDiv = document.querySelector('.minutes');
        const secondDiv = document.querySelector('.seconds');

        totalSeconds--;

        let minutesLeft = Math.floor(totalSeconds / 60);
        let secondsLeft = totalSeconds % 60;

        if (secondsLeft < 10) {
            secondDiv.value = '0' + secondsLeft;
        } else {
            secondDiv.value = secondsLeft;
        }

        if (minutesLeft < 10) {
            minuteDiv.value = '0' + minutesLeft;
        } else {
            minuteDiv.value = `${minutesLeft}`
        }


        if (minutesLeft === 0 && secondsLeft === 0) {
            bells.play();
            clearInterval(myInterval);
            startBtn.style.display = 'inline-block';
            pauseBtn.style.display = 'none';
            state = true;
            if (customSessionCheckbox.checked) {
                updateTimer();
            } else {
                resetTimer();
            }
        }
    }

    if (state) {
        state = false;
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-block';

        if (customSessionCheckbox.checked) {
            if (!totalSeconds) {
                if (pomodorosCount % pomodorosBeforeLongBreak === 0 && pomodorosCount !== 0) {
                    totalSeconds = longBreakTime * 60;
                } else {
                    totalSeconds = workTime * 60;
                }
            }
        } else {

            if (!totalSeconds) {
                totalSeconds = sessionAmount * 60;
            }

        }

        myInterval = setInterval(updateSeconds, 1000);
    } else {
        alert('Session has already started.')
    }
}

const pauseTimer = () => {
    clearInterval(myInterval);
    state = true;
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
}

const resetTimer = () => {
    clearInterval(myInterval);
    state = true;
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';

    if (customSessionCheckbox.checked) {
        phase = 'work';
        totalSeconds = workTime * 60;
    } else {
        totalSeconds = sessionAmount * 60;
    }

    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    if (minutes < 10) {
        document.querySelector('.minutes').value = '0' + minutes;
    } else {
        document.querySelector('.minutes').value = minutes;
    }

    if (seconds < 10) {
        document.querySelector('.seconds').value = '0' + seconds;
    } else {
        document.querySelector('.seconds').value = seconds;
    }

    updateSessionText();
}

function validateInput(inputElement, maxValue) {
    setTimeout(() => {
        let value = Number.parseInt(inputElement.value);
        if (isNaN(value)) {
            inputElement.value = '00';
        } else if (value > maxValue) {
            inputElement.value = maxValue;
        } else if (value < 10) {
            inputElement.value = '0' + value;
        } else if (value < 0) {
            inputElement.value = '00';
        }
    }, 1000);
}

const updateTimer = () => {
    clearInterval(myInterval);
    state = true;
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';

    if (phase === 'work') {
        pomodorosCount++;
        updatePomodoros();
        if (pomodorosCount % pomodorosBeforeLongBreak === 0 && pomodorosCount !== 0) {
            phase = 'longBreak';
            totalSeconds = longBreakTime * 60;
        } else {
            phase = 'break';
            totalSeconds = breakTime * 60;
        }
    } else if (phase === 'break') {
        phase = 'work';
        totalSeconds = workTime * 60;
    } else if (phase === 'longBreak') {
        phase = 'work';
        totalSeconds = workTime * 60;
    }

    updateSessionText();

    if (totalSeconds < 10) {
        document.querySelector('.minutes').value = '0' + Math.floor(totalSeconds / 60);
    } else {
        document.querySelector('.minutes').value = Math.floor(totalSeconds / 60);
    }

    document.querySelector('.seconds').value = '00';
    appTimer();
}

function toggleSettings() {
    settingsInputs.forEach(input => {
        input.disabled = !customSessionCheckbox.checked;
        const label = input.parentElement;
        console.log(label);
        label.style.color = customSessionCheckbox.checked ? "" : "rgba(204,204,204,0.5)";
    });

    session.disabled = customSessionCheckbox.checked;
    secondDiv.disabled = customSessionCheckbox.checked;

    sessionButton.style.color = customSessionCheckbox.checked ? "" : "rgba(204,204,204,0.5)";
    sessionButton.disabled = !customSessionCheckbox.checked;

    updateSessionText();
    updatePomodoros();

    if (!state) {
        return;
    }

    if (customSessionCheckbox.checked) {
        workTime = Number(document.querySelector('#work-time').value);
        breakTime = Number(document.querySelector('#break-time').value);
        longBreakTime = Number(document.querySelector('#long-break-time').value);
        pomodorosBeforeLongBreak = Number(document.querySelector('#long-break-interval').value);

        let workTimeString = String(workTime);
        if (workTime < 10) {
            workTimeString = '0' + workTimeString;
        }

        document.querySelector('.minutes').textContent = workTimeString;

        resetTimer();
    }
}

function handleColorChange(event) {
    document.documentElement.style.setProperty('--main-color', event.target.value);
}

function handleWindowLoad(event) {
    if (!colorPicker.value) {
        colorPicker.value = '#90c0d1';
    }
    document.documentElement.style.setProperty('--main-color', colorPicker.value);
    colorPicker.dispatchEvent(new Event('input', {bubbles: true}));

    const savedImage = localStorage.getItem('backgroundImage');
    if (savedImage) {
        document.documentElement.style.backgroundImage = 'url(' + savedImage + ')';
    }

    pauseBtn.style.display = 'none';
}

function handleFileChange(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = function () {
        const base64String = reader.result;
        document.documentElement.style.backgroundImage = 'url(' + base64String + ')';

        localStorage.setItem('backgroundImage', base64String);
    }

    if (file) {
        reader.readAsDataURL(file);
    } else {
        document.documentElement.style.backgroundImage = '';
        localStorage.removeItem('backgroundImage');
    }
}

function handleBeforeUnload() {
    localStorage.removeItem('backgroundImage');
}

function handleSettingsReset() {
    const defaultColor = '#90c0d1';
    const defaultBackgroundImage = 'url("images/background.png")';

    document.documentElement.style.setProperty('--main-color', defaultColor);

    colorPicker.value = defaultColor;

    colorPicker.dispatchEvent(new Event('input', {bubbles: true}));

    fileInput.value = '';
    fileInput.dispatchEvent(new Event('change', {bubbles: true}));

    document.documentElement.style.backgroundImage = 'none';

    localStorage.removeItem('backgroundImage');

    document.documentElement.style.backgroundImage = defaultBackgroundImage;
}

function handleSessionReset() {
    workTime = 25;
    breakTime = 5;
    longBreakTime = 15;
    pomodorosBeforeLongBreak = 4;

    document.querySelector('#work-time').value = workTime;
    document.querySelector('#break-time').value = breakTime;
    document.querySelector('#long-break-time').value = longBreakTime;
    document.querySelector('#long-break-interval').value = pomodorosBeforeLongBreak;

    resetTimer();
}

function handleWorkTimeChange(e) {
    workTime = Number(e.target.value);
    resetTimer();
}

function handleBreakTimeChange(e) {
    breakTime = Number(e.target.value);
    resetTimer();
}

function handleLongBreakTimeChange(e) {
    longBreakTime = Number(e.target.value);
    resetTimer();
}

function handleLongBreakIntervalChange(e) {
    pomodorosBeforeLongBreak = Number(e.target.value);
    resetTimer();
}

// Event Listeners
startBtn.addEventListener('click', appTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
secondDiv.addEventListener('input', () => validateInput(secondDiv, 59));
session.addEventListener('input', () => validateInput(session, 99));
customSessionCheckbox.addEventListener('change', toggleSettings);
colorPicker.addEventListener('change', handleColorChange);
window.addEventListener('load', handleWindowLoad);
fileInput.addEventListener('change', handleFileChange);
window.addEventListener('beforeunload', handleBeforeUnload);
settingsButton.addEventListener('click', handleSettingsReset);
sessionButton.addEventListener('click', handleSessionReset);
document.querySelector('#work-time').addEventListener('input', handleWorkTimeChange);
document.querySelector('#break-time').addEventListener('input', handleBreakTimeChange);
document.querySelector('#long-break-time').addEventListener('input', handleLongBreakTimeChange);
document.querySelector('#long-break-interval').addEventListener('input', handleLongBreakIntervalChange);
customSessionCheckbox.addEventListener('change', toggleSettings);

toggleSettings();