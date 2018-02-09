let minutesElement = document.getElementById('minutes');
let secondsElement = document.getElementById('seconds');
let millisecondsElement = document.getElementById('milliseconds');

let timeLeft = 0;
let replayTimeLeft = 0;

let currentTimeLength = 0;
let timeouts = [];

/**
 * Stops all active timeout repeats
 */
const clearAllTimeouts = () => {
    for (let i = 0; i < timeouts.length; i++) {
        clearTimeout(timeouts[i]);
    }
};

/**
 * Runs timer
 */
const startSchedule = () => {
    clearAllTimeouts();

    timeLeft = 0;
    timeouts = [];
    player.mode = 'record';

    printTime();
};

/**
 * Stops timer
 */
const stopSchedule = () => {
    currentTimeLength = timeLeft;

    timeLeft = 0;
    printTime();
    player.mode = 'play';

    clearAllTimeouts();
};


/**
 * Switches state of timer
 */
const switchScheduleState = () => {

    if (player.mode === 'record') {
        stopSchedule()
    } else {
        startSchedule()
    }
};

/**
 * Replays by schedule
 */
const playSchedule = () => {
    startSchedule();

    let replayTimeoutId = setInterval(() => {
            replayTimeLeft += 10;

            if (timings.timingSet.indexOf(replayTimeLeft) >= 0) {
                // FIXME: разобраться с некорректно выводимым временем replay

                timings.timingSet.forEach((value, index) => {

                    const soundName = timings.padSoundArray[index];
                    if (value === replayTimeLeft)
                    player.playSound(soundName);

                })

            } else if (replayTimeLeft >= currentTimeLength) {
                clearInterval(replayTimeoutId);
                stopSchedule();
            }
        }
        , 10);
};

/**
 * Outputs time, elapsed from start button pushed
 */
const printTime = () => {

    let innerTime = timeLeft;
    innerTime = innerTime % (1000 * 3600 * 24);
    innerTime = innerTime % (3600 * 1000);

    minutesElement.textContent = Math.floor(innerTime / (60 * 1000)).toString().padStart(2, '0');

    innerTime = innerTime % (60 * 1000);
    let secondsMilliSeconds = String(innerTime / 1000).split('.');

    let seconds = secondsMilliSeconds[0].padStart(2, '0');
    let milliseconds = secondsMilliSeconds[1] && secondsMilliSeconds[1] !== '' ? secondsMilliSeconds[1][0]
        : '0';

    secondsElement.textContent = seconds;
    millisecondsElement.textContent = milliseconds;

    timeLeft += 10;
    let timeoutId = setTimeout(printTime, 10);
    timeouts.push(timeoutId);
};