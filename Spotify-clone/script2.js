console.log("Hii");

// DOM Elements
const playButton = document.querySelector(".play");
const playBar = document.querySelector(".playbar");
const songListContainer = document.querySelector(".songlist").querySelector("ul");
const songTime = document.querySelector(".songtime");
const playSongName = document.querySelector(".playsongname");
const songInfo = document.querySelector(".songinfo");
const muteButton = document.querySelector(".mute");
const dotsButton = document.querySelector(".dots");
const leftSidebar = document.querySelector(".left");
const hamburgerButton = document.querySelector(".bar");
const closeButton = document.querySelector(".arrow");
const previousButton = document.querySelector(".previous");
const nextButton = document.querySelector(".next");
const seekBar = document.querySelector(".seekbar");
const circle = document.querySelector(".circle");
const theme = document.querySelector(".toggle");
const star = document.querySelector(".fa-star")

// Variables
let currentSong = new Audio();
let currentFolder;
let songs = [];


//  function to convert second into minutes:seconds
function convert(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60); // Calculate minutes
    const remainingSeconds = seconds % 60;   // Calculate remaining seconds

    const formattedMinutes = String(minutes).padStart(2, '0').replace(".", " ").slice(0, 2);
    const formattedSeconds = String(remainingSeconds).padStart(2, '0').replace(".", " ").slice(0, 2);

    return `${formattedMinutes}:${formattedSeconds}`;
}

// Function to fetch songs from a folder
async function fetchSongs(folder) {
    currentFolder = folder;
    const response = await fetch(`http://127.0.0.1:5500/${folder}/`);
    const text = await response.text();

    const div = document.createElement("div");
    div.innerHTML = text;
    const anchorTags = div.getElementsByTagName("a");

    songs = []
    for (let index = 0; index < anchorTags.length; index++) {
        const ele = anchorTags[index]
        if (ele.href.endsWith(".mp3")) {
            songs.push(ele.href.split(`/${currentFolder}/`)[1].split(".mp3")[0].replaceAll("%20", " "))
        }
    }
    updateSongList();
}

// Function to update the song list in the UI
function updateSongList() {
    songListContainer.innerHTML = "";

    songs.forEach((song) => {
        songListContainer.innerHTML += `
                <li>
                    <i class="fa-solid fa-music"></i>
                    <div class="info">
                    <div>${song}</div>
                    </div>
                    <div class="playnow">
                    Play Now
                    <div class="cv"><i class="fa-solid fa-circle-play"></i></div>
                    </div>
                </li>`;
    });
}


// Function to play a selected song
function playMusic(track, pause = false) {
    console.log(track);
    currentSong.src = `/${currentFolder}/` + track + ".mp3";

    if (!pause) {
        currentSong.play();
        playButton.src = "Svg/pause.svg";
    }

    songInfo.innerText = track;
    songTime.innerHTML = "00:00/00:00";
}


// Play/Pause Button Event Listener
playButton.addEventListener("click", () => {
    if (currentSong.paused) {
        playButton.src = 'Svg/pause.svg';
        currentSong.play();
    } else {
        playButton.src = 'Svg/play.svg';
        currentSong.pause();
    }
});

// Time Update Event Listener for the song
currentSong.addEventListener("timeupdate", () => {
    songTime.innerHTML = `${convert(currentSong.currentTime)}/${convert(currentSong.duration)}`;
    circle.style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
});

// Mute/Unmute functionality
function toggleMute() {
    currentSong.muted = !currentSong.muted;
    muteButton.src = currentSong.muted ? "/Svg/mute.svg" : "/Svg/speker.svg";
}

muteButton.addEventListener("click", toggleMute);

// Toggle Menu Visibility
dotsButton.addEventListener("click", () => {
    const list = document.querySelector(".list");
    list.style.top = list.style.top === "-80%" ? "0%" : "-80%";
});

// Toggle Sidebar
hamburgerButton.addEventListener("click", () => {
    leftSidebar.style.display = "block";
});

closeButton.addEventListener("click", () => {
    leftSidebar.style.display = "none";
});


// add event listener to previous and next
document.querySelector(".previous").addEventListener("click", () => {
    console.log("previous clicked")
    star.style.color = "black"

    let index = songs.indexOf(currentSong.src.split(`/${currentFolder}/`)[1].split(".mp3")[0].replaceAll("%20", " "))
    console.log(index)
    if ((index - 1) < 0) {
        index = songs.length - 1;
        playMusic(songs[index])
    } else {
        playMusic(songs[index - 1])
    }
})

document.querySelector(".next").addEventListener("click", () => {
    console.log("next clicked")
    star.style.color = "black"

    let index = songs.indexOf(currentSong.src.split(`/${currentFolder}/`)[1].split(".mp3")[0].replaceAll("%20", " "))
    if ((index + 1) >= songs.length) {
        index = 0;
        playMusic(songs[index])
    } else {
        playMusic(songs[index + 1])
    }
})

// Seek Bar Functionality
seekBar.addEventListener("click", (e) => {
    const percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    circle.style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
});

// Load Playlist on Card Click
document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", async (event) => {
        const folder = event.currentTarget.dataset.folder;
        await fetchSongs(`musics/${folder}`);
    });
});

theme.addEventListener("click", ()=>{
    document.body.classList.toggle("light-theme");
    if(document.body.classList.contains("light-theme")){
        document.querySelector(".logo-svg").style.filter = "invert(0)"
        document.querySelector(".home-svg").style.filter = "invert(0)"
        document.querySelector(".search-svg").style.filter = "invert(0)"
        document.querySelector(".library-svg").style.filter = "invert(0)"
        theme.src = "images/moon.png"
        
    }else{
        theme.src = "images/sun.png"
        document.querySelector(".logo-svg").style.filter = "invert(1)"
        document.querySelector(".home-svg").style.filter = "invert(1)"
        document.querySelector(".search-svg").style.filter = "invert(1)"
        document.querySelector(".library-svg").style.filter = "invert(1)"
    }
})

star.addEventListener("click",()=>{
    if (star.style.color == "black"){
        star.style.color = "orange"
    }else{
        star.style.color = "black"
    }
})

// Main Function to Initialize Music Player
async function init() {
    await fetchSongs("Musics/sadsongs");

    // Event Listener for Song List Click
    songListContainer.addEventListener("click", (event) => {
        const songItem = event.target.closest("li");
        if (songItem) {
            const songName = songItem.querySelector(".info div").innerText.trim();
            playMusic(songName);
            playBar.style.display = "flex";
        }
    });

}

init();
