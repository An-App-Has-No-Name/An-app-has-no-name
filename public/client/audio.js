let sounds = {};
sounds.correct = new Audio("assets/Correct-answer.mp3");
sounds.gameOver = new Audio("assets/Game-over-yeah.mp3");
sounds.wrong = new Audio("assets/Wrong-answer-sound-effect.mp3");
sounds.nothing = new Audio("assets/times-up.mp3");

export let play = sound => {
    if (sounds[sound]) {
      sounds[sound].currentTime = 0;
      sounds[sound].play();
    }
};

export let stop = sound => {
    if (sounds[sound]) {
      sounds[sound].pause();
    }
};
