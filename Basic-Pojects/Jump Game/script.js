const man = document.querySelector(".man");
const gameOver = document.querySelector(".gameover");
const mon1 = document.querySelector("#monster1");
let score = 0;
let cross = true;

audioj = new Audio("char.mp3")
audiobg = new Audio("bgmusic.mp3")
audio_over = new Audio("game-over.mp3")

setTimeout(() => {
    audiobg.play()
}, 1000);

document.onkeydown = function (e) {
    console.log("Key code is ", e.keyCode);
    if (e.keyCode == 38) { // Up arrow key
        console.log("Animation triggered");
        man.classList.add("Man-jump");
        audioj.play()

        // Remove animation class after 600ms (duration of the jump)
        setTimeout(() => {
            man.classList.remove("Man-jump");
            audioj.play()

        }, 400);
    }

    if (e.keyCode == 37) { // left arrow key
        manx = parseInt(window.getComputedStyle(man, null).getPropertyValue('left'));
        man.style.left = manx - 122 + "px";
    }

    if (e.keyCode == 39) { // left arrow key
        manx = parseInt(window.getComputedStyle(man, null).getPropertyValue('left'));
        man.style.left = manx + 122 + "px";
    }
};

setInterval(() => {
    dx = parseInt(window.getComputedStyle(man, null).getPropertyValue('left'));
    dy = parseInt(window.getComputedStyle(man, null).getPropertyValue('bottom'));

    mon1x = parseInt(window.getComputedStyle(mon1, null).getPropertyValue('left'));
    mon1y = parseInt(window.getComputedStyle(mon1, null).getPropertyValue('bottom'));

    offset1X = Math.abs(dx - mon1x);
    offset1Y = Math.abs(dy - mon1y);

    if (offset1X < 50 && offset1Y < 50) {
        gameOver.style.visibility = 'visible';
        mon1.classList.remove('monster-ani1');
        audiobg.pause();
        audio_over.play();
        man.style.bottom = "-10vh"
        setTimeout(() => {
            audio_over.pause();
        }, 1600);
    }
    else if ((offset1X < 70 && cross)) {
        score += 1;
        updatesscore(score);
        cross = false;
        setTimeout(() => {
            cross = true;
        }, 700);


        setTimeout(() => {
            aniDur1 = parseFloat(window.getComputedStyle(mon1, null).getPropertyValue('animation-duration'));
            if (aniDur1 > 2.8) {
                newDur1 = aniDur1 - 0.1;
            }
            mon1.style.animationDuration = newDur1 + "s";

        }, 300);
    }
}, 100)

function updatesscore(score) {
    document.querySelector(".scorecont").innerHTML = "Your Score : " + score;
}