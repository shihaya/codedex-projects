const bells = new Audio('sounds/bell.wav');
const startBtn = document.querySelector('.btn-start');
const pauseBtn = document.querySelector('.btn-pause');
const resetBtn = document.querySelector('.btn-reset');
const session = document.querySelector('.minutes');
const secondDiv = document.querySelector('.seconds');
let myInterval;
let state = true;

pauseBtn.style.display = 'none';

let sessionAmount = Number.parseInt(session.value);

let totalSeconds;

const appTimer = () => {

    const minuteDiv = document.querySelector('.minutes');
    const secondDiv = document.querySelector('.seconds');

    totalSeconds = Number.parseInt(minuteDiv.value) * 60 + Number.parseInt(secondDiv.value);

    if (state) {
        state = false;
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-block';

        if (!totalSeconds) {
            totalSeconds = sessionAmount * 60;
        }

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
            minuteDiv.value = `${minutesLeft}`

            if (minutesLeft === 0 && secondsLeft === 0) {
                bells.play()
                clearInterval(myInterval);
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
    document.querySelector('.minutes').value = 25;
    document.querySelector('.seconds').value = '00';
}

secondDiv.addEventListener('input', () => {
    setTimeout(() => {
        let value = Number.parseInt(secondDiv.value);
        if (isNaN(value)) {
            secondDiv.value = '00';
        } else if (value > 59) {
            secondDiv.value = 59;
        } else if (value < 0) {
            secondDiv.value = '00';
        }
    }, 1000);
});

startBtn.addEventListener('click', appTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
