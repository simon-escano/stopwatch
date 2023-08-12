const stopwatch = JSON.parse(localStorage.getItem('stopwatch')) || {milliseconds: 0,seconds: 0, minutes: 0, hours: 0};

let laps = JSON.parse(localStorage.getItem('laps')) || [];

updateTime();
updateStopwatch();
generateLapsHTML();

let stopwatchInterval;
let isPressed = false;
const playButton = document.querySelector('.play-button');
const bgObject = JSON.parse(localStorage.getItem('background')) || {choice: 0, filetype: '0'};

changeBackground(bgObject);

function updateTime() {
  const currentTime = new Date();
  let hours = currentTime.getHours();
  let minutes = currentTime.getMinutes();
  let meridian = '';

  if (hours > 12) {
    meridian = 'PM';
    hours = hours - 12;
  } else {
    meridian = 'AM';
  } if (minutes < 10) {
    minutes = '0' + String(minutes);
  }
  document.querySelector('.time').innerHTML = `${hours}:${minutes} ${meridian}`;
}

setInterval(() => {
  updateTime();
}, 1000);

function addZero(num) {
  if (num < 10) num = '0' + String(num);
  return num;
}

function updateStopwatch() {
  document.querySelector('.timer-seconds').innerHTML = `${stopwatch.hours}:${addZero(stopwatch.minutes)}:${addZero(stopwatch.seconds)}`;
  document.querySelector('.timer-milliseconds').innerHTML = `${addZero(stopwatch.milliseconds)}`;
  
  localStorage.setItem('stopwatch', JSON.stringify(stopwatch));
}

function startStopwatch() {
  stopwatchInterval = setInterval(() => {
    stopwatch.milliseconds++;
    if (stopwatch.milliseconds > 99) {
      stopwatch.milliseconds = 0;
      stopwatch.seconds++;
    } if (stopwatch.seconds > 59) {
      stopwatch.seconds = 0;
      stopwatch.minutes++;
    } if (stopwatch.minutes > 59) {
      stopwatch.minutes = 0;
      stopwatch.hours++;
    } if (stopwatch.hours > 23) {
      resetStopWatch();
    }

    updateStopwatch();
  }, 10); 
}

function resetStopWatch() {
  stopwatch.milliseconds = 0;
  stopwatch.seconds = 0; 
  stopwatch.minutes = 0;
  stopwatch.hours = 0;

  isPressed = false;
  clearInterval(stopwatchInterval);
  playButton.style.backgroundColor = '#2dc9547e';
  playButton.innerHTML = `<img class="icon" src="images/play-icon.svg">`;

  updateStopwatch();
  laps = [];
  generateLapsHTML();
  localStorage.setItem('laps', JSON.stringify(laps));
}

function addLap() {
  const {milliseconds, seconds, minutes, hours} = stopwatch;
  laps.push({milliseconds, seconds, minutes, hours});
  generateLapsHTML();
  localStorage.setItem('laps', JSON.stringify(laps));
}

function generateLapsHTML() {
  let html = '';
  laps.forEach((lap, index) => {
    html += `
      <div class="lap">
        <p class="lap-number">Lap ${index + 1}</p>
        <p class="lap-time">${lap.hours}:${addZero(lap.minutes)}:${addZero(lap.seconds)}<span class="milliseconds">:${addZero(lap.milliseconds)}</span></p>
      </div>
    `
  });
  document.querySelector('.laps').innerHTML = html;
}

function changeBackground(bgObject) {
  if (document.querySelector('.mini-background-selected')) {
    document.querySelector('.mini-background-selected').classList.remove('mini-background-selected');
  }
  document.querySelector('.background-container').innerHTML = `<img class="background" src="images/background${bgObject.choice}.${bgObject.filetype}">`
  if (bgObject.choice === 0) {
    document.querySelector(`.bgChoice${bgObject.choice}`).classList.add('none-selected');
  } else {
    document.querySelector(`.bgChoice${bgObject.choice}`).classList.add('mini-background-selected');
  }
  localStorage.setItem('background', JSON.stringify(bgObject));
}

document.querySelector('.play-button').addEventListener('click', () => {
  if(!isPressed) {
    isPressed = true;
    startStopwatch();
    playButton.style.backgroundColor = '#f9960c7e';
    playButton.innerHTML = `<img class="icon" src="images/pause-icon.svg">`;
  } else {
    isPressed = false;
    clearInterval(stopwatchInterval);
    playButton.style.backgroundColor = '#2dc9547e';
    playButton.innerHTML = `<img class="icon" src="images/play-icon.svg">`;
  }
});

document.querySelector('.stop-button').addEventListener('click', () => {
  resetStopWatch();
});

document.querySelector('.lap-button').addEventListener('click', () => {
  addLap();
});

document.querySelector('.bgChoice0').addEventListener('click', () => {
  changeBackground({choice: 0, filetype: '0'});
});

document.querySelector('.bgChoice1').addEventListener('click', () => {
  changeBackground({choice: 1, filetype: 'jpg'});
});

document.querySelector('.bgChoice2').addEventListener('click', () => {
  changeBackground({choice: 2, filetype: 'jpg'});
});

document.querySelector('.bgChoice3').addEventListener('click', () => {
  changeBackground({choice: 3, filetype: 'png'});
});

